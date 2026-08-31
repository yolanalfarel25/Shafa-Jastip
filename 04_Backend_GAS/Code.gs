const CONFIG = {
  ORDERS_SHEET: 'Konfirmasi Jastip v4',
  USERS_SHEET: 'Jastipers',
  SESSIONS_SHEET: 'Sessions',
  EMAIL_HISTORY_SHEET: 'JastiperEmailHistory',
  MAX_FILE_MB: 5,
  SESSION_HOURS: 12,
  AUTH_RATE_LIMIT_SECONDS: 10 * 60,
  LOGIN_FAILURE_LIMIT: 10,
  SIGNUP_ATTEMPT_LIMIT: 5
};

const ORDER_HEADERS = [
  'orderId','jastiperId','shareCode','editTokenHash','createdAt','updatedAt',
  'namaLengkap','alamat','noHp','ekspedisi','bankTujuan','itemsJson','buktiTransferUrl'
];

const USER_HEADERS = [
  'jastiperId','createdAt','updatedAt','namaJastip','namaPemilik','email','noHp',
  'passwordSalt','passwordHash','shareCode','driveFolderId',
  'briNumber','briName','bsiNumber','bsiName','status','bankAccountsJson','ekspedisiListJson'
];

const SESSION_HEADERS = ['tokenHash','jastiperId','createdAt','expiresAt'];

const EMAIL_HISTORY_HEADERS = [
  'historyId','jastiperId','oldEmail','newEmail','changedAt','status','errorCode'
];

function doPost(e) {
  try {
    let raw = '';
    if (e && e.postData && e.postData.contents) {
      raw = e.postData.contents;
    }
    const body = safeJsonParse_(raw, {});
    const action = String(body.action || '').trim();

    switch (action) {
      case 'signupJastiper':
        return jsonResponse_(signupJastiper(body.payload));
      case 'loginJastiper':
        return jsonResponse_(loginJastiper(body.email, body.password));
      case 'getJastiperSession':
        return jsonResponse_(getJastiperSession(body.sessionToken));
      case 'logoutJastiper':
        return jsonResponse_(logoutJastiper(body.sessionToken));
      case 'updateJastiperSettings':
        return jsonResponse_(updateJastiperSettings(body.sessionToken, body.payload));
      case 'getPublicConfig':
        return jsonResponse_(getPublicConfig(body.shareCode, body.orderId, body.editToken));
      case 'saveConfirmation':
        return jsonResponse_(saveConfirmation(body.payload));
      case 'getConfirmation':
        return jsonResponse_(getConfirmation(body.orderId, body.editToken));
      case 'getJastiperDashboard':
        return jsonResponse_(getJastiperDashboard(body.sessionToken, body.searchText));
      case 'getJastiperImageData':
        return jsonResponse_(getJastiperImageData(body.sessionToken, body.driveFileUrl));
      case 'deleteOrder':
        return jsonResponse_(deleteOrder(body.sessionToken, body.orderId));
      default:
        return jsonResponse_({ ok: false, error: 'Aksi API tidak valid: ' + (action || 'kosong') });
    }
  } catch (err) {
    return jsonResponse_({ ok: false, error: err.message || String(err) });
  }
}

function jsonResponse_(obj) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getFrontendBaseUrl_() {
  const custom = String(
    PropertiesService.getScriptProperties().getProperty('FRONTEND_BASE_URL') || ''
  ).trim();
  if (!custom) return ScriptApp.getService().getUrl();
  if (!/^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/[^?#]*)?$/i.test(custom)) {
    throw new Error('Konfigurasi FRONTEND_BASE_URL tidak valid.');
  }
  return custom.replace(/\/+$/, '');
}

function doGet(e) {
  const page = String((e && e.parameter && e.parameter.page) || '').toLowerCase();

  let fileName = 'Konfirmasi';
  let title = 'Konfirmasi Pembelian Jastip';

  if (page === 'login' || page === 'account') {
    fileName = 'Login';
    title = 'Login & Signup Jastiper';
  } else if (page === 'dashboard') {
    fileName = 'Dashboard';
    title = 'Dashboard Jastiper';
  }

  const template = HtmlService.createTemplateFromFile(fileName);

  return template
    .evaluate()
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ========================= SETUP ========================= */

function setupApp() {
  ensureSheet_(CONFIG.ORDERS_SHEET, ORDER_HEADERS);
  ensureSheet_(CONFIG.USERS_SHEET, USER_HEADERS);
  ensureSheet_(CONFIG.SESSIONS_SHEET, SESSION_HEADERS);
  ensureSheet_(CONFIG.EMAIL_HISTORY_SHEET, EMAIL_HISTORY_HEADERS);
  return 'Setup multi-jastiper selesai.';
}

/* ========================= AUTH JASTIPER ========================= */

function signupJastiper(payload) {
  payload = payload || {};
  const namaJastip = clean_(payload.namaJastip, 120);
  const namaPemilik = clean_(payload.namaPemilik, 120);
  const email = clean_(payload.email, 180).toLowerCase();
  const noHp = clean_(payload.noHp, 40);
  const password = String(payload.password || '');

  if (!namaJastip || !namaPemilik || !email || !noHp || !password) {
    throw new Error('Semua data pendaftaran wajib diisi.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Format email tidak valid.');
  }
  if (password.length < 8) {
    throw new Error('Password minimal 8 karakter.');
  }

  enforceAndRecordAuthRateLimit_('signup', email, CONFIG.SIGNUP_ATTEMPT_LIMIT);

  const users = getUsersSheet_();
  if (findUserByEmail_(users, email)) {
    throw new Error('Email ini sudah terdaftar.');
  }

  const jastiperId = 'JSTP-' + randomHex_(10).toUpperCase();
  const shareCode = 'J-' + randomHex_(12).toUpperCase();
  const salt = createToken_().slice(0, 32);
  const passwordHash = hashPassword_(password, salt);
  const now = new Date();

  const rootFolder = getRootFolder_();
  const folder = rootFolder.createFolder(`${jastiperId} - ${safeFileName_(namaJastip)}`);

  users.appendRow([
    jastiperId, now, now, namaJastip, namaPemilik, email, noHp,
    salt, passwordHash, shareCode, folder.getId(),
    '', '', '', '', 'active', '', ''
  ]);

  const session = createSession_(jastiperId);
  return buildAuthResponse_(jastiperId, session);
}

function loginJastiper(email, password) {
  email = clean_(email, 180).toLowerCase();
  password = String(password || '');
  if (!email || !password) throw new Error('Email dan password wajib diisi.');

  enforceAuthRateLimit_('login', email, CONFIG.LOGIN_FAILURE_LIMIT);

  const users = getUsersSheet_();
  const found = findUserByEmail_(users, email);
  if (!found) {
    recordAuthRateLimit_('login', email);
    throw new Error('Email atau password salah.');
  }

  const user = found.obj;
  if (String(user.status || 'active') !== 'active') {
    recordAuthRateLimit_('login', email);
    throw new Error('Akun tidak aktif.');
  }
  if (hashPassword_(password, user.passwordSalt) !== user.passwordHash) {
    recordAuthRateLimit_('login', email);
    throw new Error('Email atau password salah.');
  }

  clearAuthRateLimit_('login', email);
  const session = createSession_(user.jastiperId);
  return buildAuthResponse_(user.jastiperId, session);
}

function getJastiperSession(sessionToken) {
  const session = requireSession_(sessionToken);
  return buildAuthResponse_(session.jastiperId, sessionToken);
}

function logoutJastiper(sessionToken) {
  const tokenHash = sha256_(String(sessionToken || ''));
  const sheet = getSessionsSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return {ok:true};

  const hashes = sheet.getRange(2, 1, last - 1, 1).getDisplayValues().flat();
  const idx = hashes.findIndex(v => v === tokenHash);
  if (idx >= 0) sheet.deleteRow(idx + 2);
  return {ok:true};
}

function updateJastiperSettings(sessionToken, payload) {
  payload = payload || {};
  const session = requireSession_(sessionToken);
  const email = clean_(payload.email, 180).toLowerCase();
  const namaJastip = clean_(payload.namaJastip, 120);
  const namaPemilik = clean_(payload.namaPemilik, 120);
  const noHp = clean_(payload.noHp, 40);

  if (!namaJastip || !namaPemilik || !noHp || !email) {
    throw new Error('Nama jastip, nama pemilik, nomor WhatsApp, dan email wajib diisi.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Format email tidak valid.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const users = getUsersSheet_();
    const found = findUserById_(users, session.jastiperId);
    if (!found || String(found.obj.status || '') !== 'active') {
      throw new Error('Akun tidak ditemukan atau tidak aktif.');
    }

    const current = found.obj;
    const emailChanged = email !== String(current.email || '').toLowerCase();
    const duplicate = emailChanged ? findUserByEmail_(users, email) : null;
    if (duplicate && String(duplicate.obj.jastiperId) !== String(session.jastiperId)) {
      throw new Error('Email ini sudah terdaftar.');
    }

    const updated = USER_HEADERS.map(h => current[h]);
    const set = (header, value) => {
      updated[USER_HEADERS.indexOf(header)] = value;
    };

    set('updatedAt', new Date());
    set('namaJastip', namaJastip);
    set('namaPemilik', namaPemilik);
    set('email', email);
    set('noHp', noHp);
    if (Object.prototype.hasOwnProperty.call(payload, 'ekspedisiList')) {
      set('ekspedisiListJson', JSON.stringify(cleanEkspedisiList_(payload.ekspedisiList)));
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'bankAccounts')) {
      const bankAccounts = cleanBankAccounts_(payload.bankAccounts);
      set('bankAccountsJson', JSON.stringify(bankAccounts));

      // Tetap simpan fallback legacy BRI / BSI jika ada di list untuk backward compatibility
      const briLegacy = bankAccounts.find(b => /^bri$/i.test(b.bankName));
      const bsiLegacy = bankAccounts.find(b => /^bsi$/i.test(b.bankName));
      set('briNumber', briLegacy ? briLegacy.accountNumber : '');
      set('briName', briLegacy ? briLegacy.accountHolder : '');
      set('bsiNumber', bsiLegacy ? bsiLegacy.accountNumber : '');
      set('bsiName', bsiLegacy ? bsiLegacy.accountHolder : '');
    }

    if (!emailChanged) {
      users.getRange(found.row, 1, 1, USER_HEADERS.length).setValues([updated]);
      return buildAuthResponse_(session.jastiperId, sessionToken);
    }

    const history = getEmailHistorySheet_();
    const historyRow = history.getLastRow() + 1;
    history.appendRow([
      'EMAIL-' + randomHex_(16).toUpperCase(),
      session.jastiperId,
      current.email,
      email,
      new Date(),
      'PENDING',
      ''
    ]);

    try {
      users.getRange(found.row, 1, 1, USER_HEADERS.length).setValues([updated]);
      history.getRange(
        historyRow,
        EMAIL_HISTORY_HEADERS.indexOf('status') + 1
      ).setValue('APPLIED');
      revokeSessionsForUser_(session.jastiperId);
    } catch (error) {
      try {
        users.getRange(found.row, 1, 1, USER_HEADERS.length)
          .setValues([USER_HEADERS.map(h => current[h])]);
        history.getRange(
          historyRow,
          EMAIL_HISTORY_HEADERS.indexOf('status') + 1,
          1,
          2
        ).setValues([['FAILED', 'PROFILE_UPDATE_FAILED']]);
      } catch (rollbackError) {
        throw new Error('Perubahan profil gagal dan perlu ditinjau administrator.');
      }
      throw new Error('Perubahan profil gagal. Data akun dipulihkan.');
    }

    return {
      ok: true,
      sessionInvalidated: true,
      profile: publicProfile_(rowToObject_(USER_HEADERS, updated)),
      shareUrl: buildShareUrl_(current.shareCode)
    };
  } finally {
    lock.releaseLock();
  }
}

/* ========================= BUYER PUBLIC FORM ========================= */

function getPublicConfig(shareCode, orderId, editToken) {
  let user;

  if (orderId && editToken) {
    const order = getVerifiedOrder_(orderId, editToken);
    user = getUserObjectById_(order.jastiperId);
  } else {
    shareCode = clean_(shareCode, 80);
    if (!shareCode) {
      throw new Error('Link jastip tidak lengkap. Silakan gunakan link yang dibagikan oleh jastiper.');
    }
    user = getUserObjectByShareCode_(shareCode);
  }

  if (!user || String(user.status || '') !== 'active') {
    throw new Error('Link jastip tidak aktif.');
  }

  return {
    maxFileMb: CONFIG.MAX_FILE_MB,
    jastiper: {
      namaJastip: user.namaJastip,
      shareCode: user.shareCode
    },
    bankAccounts: parseBankAccounts_(user),
    ekspedisiList: parseEkspedisiList_(user)
  };
}

function saveConfirmation(payload) {
  validateBuyerPayload_(payload);

  const orders = getOrdersSheet_();
  const now = new Date();

  let orderId = clean_(payload.orderId, 80);
  let editToken = String(payload.editToken || '').trim();
  let rowNumber = 0;
  let createdAt = now;
  let user;
  let previousProofUrl = '';

  if (orderId) {
    rowNumber = findOrderRow_(orders, orderId);
    if (!rowNumber) throw new Error('Data pesanan tidak ditemukan.');

    const row = rowToObject_(ORDER_HEADERS,
      orders.getRange(rowNumber, 1, 1, ORDER_HEADERS.length).getValues()[0]);

    if (!editToken || sha256_(editToken) !== row.editTokenHash) {
      throw new Error('Link edit tidak valid.');
    }
    createdAt = row.createdAt || now;
    previousProofUrl = row.buktiTransferUrl || '';
    user = getUserObjectById_(row.jastiperId);
  } else {
    user = getUserObjectByShareCode_(clean_(payload.shareCode, 80));
    if (!user) throw new Error('Link jastip tidak valid.');
    orderId = createOrderId_();
    editToken = createToken_();
  }

  if (!user || String(user.status || '') !== 'active') {
    throw new Error('Akun jastiper tidak aktif.');
  }

  const validAccounts = parseBankAccounts_(user);
  if (!validAccounts.length) throw new Error('Jastiper belum mengatur rekening transfer.');
  const selected = clean_(payload.bankTujuan, 100);
  const matched = validAccounts.some(acc => {
    const value = bankAccountValue_(acc);
    return value === selected || acc.bankName === selected;
  });
  if (!matched) {
    throw new Error('Pilihan rekening bank tidak valid untuk jastiper ini.');
  }

  const uploadedItems = [];
  const incomingItems = Array.isArray(payload.items) ? payload.items : [];

  incomingItems.forEach((item, index) => {
    const cleanName = clean_(item.name || `Barang ${index + 1}`, 180);
    let photoUrl = String(item.existingUrl || '').trim();

    if (item.file && item.file.data) {
      photoUrl = saveBase64FileForUser_(
        user, item.file, `${orderId}_barang_${index + 1}`
      );
    }
    if (!photoUrl) {
      throw new Error(`Foto untuk ${cleanName || `Barang ${index + 1}`} belum dipilih.`);
    }

    uploadedItems.push({
      name: cleanName || `Barang ${index + 1}`,
      photoUrl
    });
  });

  let proofUrl = previousProofUrl;
  if (payload.buktiTransfer && payload.buktiTransfer.data) {
    proofUrl = saveBase64FileForUser_(user, payload.buktiTransfer, `${orderId}_bukti_transfer`);
  }

  const values = [
    orderId,
    user.jastiperId,
    user.shareCode,
    sha256_(editToken),
    createdAt,
    now,
    clean_(payload.namaLengkap, 180),
    clean_(payload.alamat, 5000),
    clean_(payload.noHp, 80),
    clean_(payload.ekspedisi, 80),
    clean_(payload.bankTujuan, 100),
    JSON.stringify(uploadedItems),
    proofUrl
  ];

  if (rowNumber) {
    orders.getRange(rowNumber, 1, 1, ORDER_HEADERS.length).setValues([values]);
  } else {
    orders.appendRow(values);
  }

  const baseUrl = getFrontendBaseUrl_();
  return {
    ok: true,
    orderId,
    editToken,
    editUrl: `${baseUrl}?id=${encodeURIComponent(orderId)}&token=${encodeURIComponent(editToken)}`
  };
}

function getConfirmation(orderId, editToken) {
  const row = getVerifiedOrder_(orderId, editToken);

  return {
    orderId: row.orderId,
    namaLengkap: row.namaLengkap || '',
    alamat: row.alamat || '',
    noHp: row.noHp || '',
    ekspedisi: row.ekspedisi || '',
    bankTujuan: row.bankTujuan || '',
    items: safeJsonParse_(row.itemsJson, []),
    buktiTransferUrl: row.buktiTransferUrl || '',
    updatedAt: formatDate_(row.updatedAt)
  };
}

/* ========================= JASTIPER DASHBOARD ========================= */

function getJastiperDashboard(sessionToken, searchText) {
  const session = requireSession_(sessionToken);
  const user = getUserObjectById_(session.jastiperId);
  const sheet = getOrdersSheet_();
  const last = sheet.getLastRow();
  const q = clean_(searchText, 200).toLowerCase();
  const tz = Session.getScriptTimeZone() || 'Asia/Jakarta';
  const todayKey = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

  if (last < 2) {
    return {
      profile: publicProfile_(user),
      shareUrl: buildShareUrl_(user.shareCode),
      stats: {total:0,today:0,withProof:0},
      rows: []
    };
  }

  const values = sheet.getRange(2, 1, last - 1, ORDER_HEADERS.length).getValues()
    .filter(row => String(row[ORDER_HEADERS.indexOf('jastiperId')]) === session.jastiperId);

  let today = 0;
  let withProof = 0;

  let rows = values.map(row => {
    const obj = rowToObject_(ORDER_HEADERS, row);
    const createdDate = obj.createdAt instanceof Date ? obj.createdAt : new Date(obj.createdAt);
    if (!isNaN(createdDate) && Utilities.formatDate(createdDate, tz, 'yyyy-MM-dd') === todayKey) today++;
    if (obj.buktiTransferUrl) withProof++;

    return {
      orderId: obj.orderId,
      createdAt: formatDate_(obj.createdAt),
      updatedAt: formatDate_(obj.updatedAt),
      namaLengkap: obj.namaLengkap || '',
      alamat: obj.alamat || '',
      noHp: obj.noHp || '',
      ekspedisi: obj.ekspedisi || '',
      bankTujuan: obj.bankTujuan || '',
      items: safeJsonParse_(obj.itemsJson, []),
      buktiTransferUrl: obj.buktiTransferUrl || ''
    };
  });

  if (q) {
    rows = rows.filter(r => [
      r.orderId,r.namaLengkap,r.alamat,r.noHp,r.ekspedisi,r.bankTujuan,
      ...(r.items || []).map(i => i.name)
    ].join(' ').toLowerCase().includes(q));
  }

  rows.reverse();

  return {
    profile: publicProfile_(user),
    shareUrl: buildShareUrl_(user.shareCode),
    stats: {total:values.length,today,withProof},
    rows
  };
}

function getJastiperImageData(sessionToken, driveFileUrl) {
  const session = requireSession_(sessionToken);
  const user = getUserObjectById_(session.jastiperId);
  const fileId = extractDriveFileId_(driveFileUrl);
  if (!fileId) throw new Error('ID foto tidak valid.');

  const file = DriveApp.getFileById(fileId);
  assertFileInFolder_(file, user.driveFolderId);

  const blob = file.getBlob();
  const mime = blob.getContentType() || 'image/jpeg';
  if (!/^image\//i.test(mime)) throw new Error('File bukan gambar.');

  return `data:${mime};base64,${Utilities.base64Encode(blob.getBytes())}`;
}

function deleteOrder(sessionToken, orderId) {
  const session = requireSession_(sessionToken);
  const user = getUserObjectById_(session.jastiperId);
  const cleanId = clean_(orderId, 100);
  if (!cleanId) throw new Error('ID pesanan tidak valid.');

  const sheet = getOrdersSheet_();
  const rowNumber = findOrderRow_(sheet, cleanId);
  if (!rowNumber) throw new Error('Pesanan tidak ditemukan.');

  const rowValues = sheet.getRange(rowNumber, 1, 1, ORDER_HEADERS.length).getValues()[0];
  const orderObj = rowToObject_(ORDER_HEADERS, rowValues);

  if (String(orderObj.jastiperId) !== String(session.jastiperId)) {
    throw new Error('Anda tidak memiliki hak untuk menghapus pesanan ini.');
  }

  const fileUrls = [];
  const items = safeJsonParse_(orderObj.itemsJson, []);
  if (Array.isArray(items)) {
    items.forEach(it => {
      if (it && it.photoUrl) fileUrls.push(it.photoUrl);
    });
  }
  if (orderObj.buktiTransferUrl) {
    fileUrls.push(orderObj.buktiTransferUrl);
  }

  let deletedFiles = 0;
  let failedFiles = 0;

  fileUrls.forEach(url => {
    try {
      const fileId = extractDriveFileId_(url);
      if (fileId) {
        const file = DriveApp.getFileById(fileId);
        assertFileInFolder_(file, user.driveFolderId);
        file.setTrashed(true);
        deletedFiles++;
      }
    } catch (e) {
      failedFiles++;
    }
  });

  sheet.deleteRow(rowNumber);

  return {
    ok: true,
    orderId: cleanId,
    deletedFiles,
    failedFiles
  };
}

/* ========================= HELPERS ========================= */

function authRateLimitKey_(operation, identity) {
  return `auth:${operation}:${sha256_(String(identity || ''))}`;
}

function getAuthRateLimitCount_(cache, key) {
  const value = Number(cache.get(key) || 0);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

function enforceAuthRateLimit_(operation, identity, limit) {
  try {
    const cache = CacheService.getScriptCache();
    if (getAuthRateLimitCount_(cache, authRateLimitKey_(operation, identity)) >= limit) {
      throw new Error('Terlalu banyak percobaan. Silakan coba lagi nanti.');
    }
  } catch (error) {
    if (error && error.message === 'Terlalu banyak percobaan. Silakan coba lagi nanti.') {
      throw error;
    }
    // CacheService fail-open: autentikasi tetap tersedia saat cache bermasalah.
  }
}

function recordAuthRateLimit_(operation, identity) {
  try {
    const cache = CacheService.getScriptCache();
    const key = authRateLimitKey_(operation, identity);
    cache.put(
      key,
      String(getAuthRateLimitCount_(cache, key) + 1),
      CONFIG.AUTH_RATE_LIMIT_SECONDS
    );
  } catch (error) {
    // CacheService fail-open; jangan log identity atau key.
  }
}

function enforceAndRecordAuthRateLimit_(operation, identity, limit) {
  enforceAuthRateLimit_(operation, identity, limit);
  recordAuthRateLimit_(operation, identity);
}

function clearAuthRateLimit_(operation, identity) {
  try {
    CacheService.getScriptCache().remove(authRateLimitKey_(operation, identity));
  } catch (error) {
    // CacheService fail-open; jangan log identity atau key.
  }
}

function validateBuyerPayload_(payload) {
  if (!payload) throw new Error('Data formulir kosong.');
  ['namaLengkap','alamat','noHp','ekspedisi','bankTujuan'].forEach(k => {
    if (!String(payload[k] || '').trim()) throw new Error('Mohon lengkapi semua field wajib.');
  });
  if (/^[=+\-@]/.test(String(payload.ekspedisi).trim())) {
    throw new Error('Nama ekspedisi tidak valid.');
  }
  if (!Array.isArray(payload.items) || !payload.items.length) {
    throw new Error('Minimal satu barang harus ditambahkan.');
  }
}

function ensureSheet_(name, headers) {
  const ss = getSpreadsheet_();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);

  if (sh.getLastRow() === 0) {
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    return sh;
  }

  // Migrasi aman untuk sheet lama: tambahkan header yang belum ada di ujung.
  const current = sh.getRange(1,1,1,Math.max(sh.getLastColumn(),1)).getDisplayValues()[0];
  headers.forEach(h => {
    if (!current.includes(h)) {
      sh.getRange(1, sh.getLastColumn()+1).setValue(h);
      current.push(h);
    }
  });
  return sh;
}

function getRequiredResourceConfig_(name) {
  const value = String(
    PropertiesService.getScriptProperties().getProperty(name) || ''
  ).trim();
  if (!/^[a-zA-Z0-9_-]{20,}$/.test(value) || value.indexOf('PASTE_') === 0) {
    throw new Error('Konfigurasi resource server belum valid.');
  }
  return value;
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(
    getRequiredResourceConfig_('SPREADSHEET_ID')
  );
}

function getRootFolder_() {
  return DriveApp.getFolderById(
    getRequiredResourceConfig_('DRIVE_ROOT_FOLDER_ID')
  );
}

function getOrdersSheet_() { return ensureSheet_(CONFIG.ORDERS_SHEET, ORDER_HEADERS); }
function getUsersSheet_() { return ensureSheet_(CONFIG.USERS_SHEET, USER_HEADERS); }
function getSessionsSheet_() { return ensureSheet_(CONFIG.SESSIONS_SHEET, SESSION_HEADERS); }
function getEmailHistorySheet_() {
  return ensureSheet_(CONFIG.EMAIL_HISTORY_SHEET, EMAIL_HISTORY_HEADERS);
}

function findUserByEmail_(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const rows = sheet.getRange(2,1,last-1,USER_HEADERS.length).getValues();
  const idx = USER_HEADERS.indexOf('email');
  for (let i=0;i<rows.length;i++) {
    if (String(rows[i][idx] || '').toLowerCase() === email) {
      return {row:i+2,obj:rowToObject_(USER_HEADERS, rows[i])};
    }
  }
  return null;
}

function findUserById_(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const rows = sheet.getRange(2,1,last-1,USER_HEADERS.length).getValues();
  const idx = USER_HEADERS.indexOf('jastiperId');
  for (let i=0;i<rows.length;i++) {
    if (String(rows[i][idx]) === String(id)) {
      return {row:i+2,obj:rowToObject_(USER_HEADERS, rows[i])};
    }
  }
  return null;
}

function getUserObjectById_(id) {
  const found = findUserById_(getUsersSheet_(), id);
  return found ? found.obj : null;
}

function getUserObjectByShareCode_(shareCode) {
  const sheet = getUsersSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const rows = sheet.getRange(2,1,last-1,USER_HEADERS.length).getValues();
  const idx = USER_HEADERS.indexOf('shareCode');
  for (let i=0;i<rows.length;i++) {
    if (String(rows[i][idx]) === String(shareCode)) {
      return rowToObject_(USER_HEADERS, rows[i]);
    }
  }
  return null;
}

function createSession_(jastiperId) {
  cleanupSessions_();
  const token = createToken_() + createToken_();
  const now = new Date();
  const expires = new Date(now.getTime() + CONFIG.SESSION_HOURS * 3600 * 1000);
  getSessionsSheet_().appendRow([sha256_(token), jastiperId, now, expires]);
  return token;
}

function requireSession_(token) {
  if (!token) throw new Error('Sesi login tidak ditemukan.');
  const hash = sha256_(String(token));
  const sh = getSessionsSheet_();
  const last = sh.getLastRow();
  if (last < 2) throw new Error('Sesi login sudah berakhir.');

  const rows = sh.getRange(2,1,last-1,SESSION_HEADERS.length).getValues();
  for (let i=0;i<rows.length;i++) {
    const obj = rowToObject_(SESSION_HEADERS, rows[i]);
    if (obj.tokenHash === hash) {
      const exp = obj.expiresAt instanceof Date ? obj.expiresAt : new Date(obj.expiresAt);
      if (exp.getTime() <= Date.now()) {
        sh.deleteRow(i+2);
        throw new Error('Sesi login sudah berakhir. Silakan login kembali.');
      }
      return {jastiperId:obj.jastiperId, token:String(token)};
    }
  }
  throw new Error('Sesi login tidak valid.');
}

function cleanupSessions_() {
  const sh = getSessionsSheet_();
  for (let row = sh.getLastRow(); row >= 2; row--) {
    const expires = sh.getRange(row, SESSION_HEADERS.indexOf('expiresAt')+1).getValue();
    const d = expires instanceof Date ? expires : new Date(expires);
    if (!expires || d.getTime() <= Date.now()) sh.deleteRow(row);
  }
}

function revokeSessionsForUser_(jastiperId) {
  const sh = getSessionsSheet_();
  const idColumn = SESSION_HEADERS.indexOf('jastiperId') + 1;
  for (let row = sh.getLastRow(); row >= 2; row--) {
    if (String(sh.getRange(row, idColumn).getValue()) === String(jastiperId)) {
      sh.deleteRow(row);
    }
  }
}

function buildAuthResponse_(jastiperId, sessionToken) {
  const user = getUserObjectById_(jastiperId);
  if (!user) throw new Error('Akun tidak ditemukan.');
  return {
    ok:true,
    sessionToken,
    profile: publicProfile_(user),
    shareUrl: buildShareUrl_(user.shareCode)
  };
}

function publicProfile_(user) {
  return {
    jastiperId:user.jastiperId,
    namaJastip:user.namaJastip,
    namaPemilik:user.namaPemilik,
    email:user.email,
    noHp:user.noHp,
    shareCode:user.shareCode,
    bankAccounts: parseBankAccounts_(user),
    ekspedisiList: parseEkspedisiList_(user),
    briNumber:user.briNumber || '',
    briName:user.briName || '',
    bsiNumber:user.bsiNumber || '',
    bsiName:user.bsiName || ''
  };
}

function cleanEkspedisiList_(rawList) {
  if (rawList == null) return [];
  if (!Array.isArray(rawList)) throw new Error('Format daftar ekspedisi tidak valid.');
  if (rawList.length > 10) throw new Error('Maksimal 10 ekspedisi.');

  const cleaned = [];
  const seen = {};
  rawList.forEach((rawName, index) => {
    const name = String(rawName || '').trim();
    if (!name) return;
    if (name.length > 40) throw new Error(`Ekspedisi ke-${index + 1}: Nama maksimal 40 karakter.`);
    if (/^[=+\-@]/.test(name)) throw new Error(`Ekspedisi ke-${index + 1}: Nama tidak valid.`);
    if (/^lainnya$/i.test(name)) throw new Error('Nama ekspedisi "Lainnya" sudah disediakan untuk buyer.');
    const key = name.toLowerCase();
    if (seen[key]) throw new Error(`Ekspedisi "${name}" duplikat.`);
    seen[key] = true;
    cleaned.push(name);
  });
  return cleaned;
}

function parseEkspedisiList_(user) {
  const fallback = ['Shopee', 'J&T'];
  const jsonStr = String((user && user.ekspedisiListJson) || '').trim();
  if (!jsonStr) return fallback;
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return fallback;
    const cleaned = cleanEkspedisiList_(parsed);
    return cleaned.length ? cleaned : fallback;
  } catch (e) {
    return fallback;
  }
}

function cleanBankAccounts_(rawList) {
  if (rawList == null) return [];
  if (!Array.isArray(rawList)) throw new Error('Format rekening bank tidak valid.');
  if (rawList.length > 10) throw new Error('Maksimal 10 rekening bank.');
  const cleaned = [];
  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i] || {};
    const bankName = String(item.bankName || '').trim();
    const accountNumber = String(item.accountNumber || '').trim();
    const accountHolder = String(item.accountHolder || '').trim();

    if (!bankName && !accountNumber && !accountHolder) continue;
    if (!bankName || !accountNumber || !accountHolder) {
      throw new Error(`Rekening ke-${i+1}: Nama bank, nomor rekening, dan nama pemilik wajib diisi.`);
    }
    if (bankName.length > 40) throw new Error(`Rekening ke-${i+1}: Nama bank maksimal 40 karakter.`);
    if (/^[=+\-@]/.test(bankName) || /^[=+\-@]/.test(accountNumber) || /^[=+\-@]/.test(accountHolder)) {
      throw new Error(`Rekening ke-${i+1}: Data rekening tidak valid.`);
    }
    if (accountNumber.length < 4 || accountNumber.length > 40) {
      throw new Error(`Rekening ${bankName}: Nomor rekening harus 4–40 karakter.`);
    }
    if (accountHolder.length > 120) {
      throw new Error(`Rekening ${bankName}: Nama pemilik maksimal 120 karakter.`);
    }
    cleaned.push({ bankName, accountNumber, accountHolder });
  }
  return cleaned;
}

function parseBankAccounts_(user) {
  if (!user) return [];
  const jsonStr = String(user.bankAccountsJson || '').trim();
  if (jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed)) return [];
      return cleanBankAccounts_(parsed);
    } catch (e) {
      return [];
    }
  }
  // Fallback rekening legacy BRI / BSI hanya saat JSON belum pernah disimpan
  const fallback = [];
  if (user.briNumber) {
    fallback.push({
      bankName: 'BRI',
      accountNumber: String(user.briNumber),
      accountHolder: String(user.briName || '-')
    });
  }
  if (user.bsiNumber) {
    fallback.push({
      bankName: 'BSI',
      accountNumber: String(user.bsiNumber),
      accountHolder: String(user.bsiName || '-')
    });
  }
  return cleanBankAccounts_(fallback);
}

function bankAccountValue_(account) {
  return `${account.bankName} - ${account.accountNumber}`;
}

function buildShareUrl_(shareCode) {
  return `${getFrontendBaseUrl_()}?shop=${encodeURIComponent(shareCode)}`;
}

function getVerifiedOrder_(orderId, token) {
  const sh = getOrdersSheet_();
  const row = findOrderRow_(sh, orderId);
  if (!row) throw new Error('Data tidak ditemukan.');
  const obj = rowToObject_(ORDER_HEADERS, sh.getRange(row,1,1,ORDER_HEADERS.length).getValues()[0]);
  if (sha256_(String(token || '')) !== obj.editTokenHash) throw new Error('Token edit tidak valid.');
  return obj;
}

function findOrderRow_(sheet, orderId) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const col = ORDER_HEADERS.indexOf('orderId') + 1;
  const values = sheet.getRange(2,col,last-1,1).getDisplayValues().flat();
  const idx = values.findIndex(v => String(v) === String(orderId));
  return idx < 0 ? 0 : idx + 2;
}

function saveBase64FileForUser_(user, fileObj, prefix) {
  const mime = String(fileObj.mimeType || '');
  const originalName = String(fileObj.name || 'file');
  if (!/^image\//i.test(mime)) throw new Error('Upload harus berupa gambar.');

  const bytes = Utilities.base64Decode(String(fileObj.data || ''));
  if (bytes.length / (1024*1024) > CONFIG.MAX_FILE_MB) {
    throw new Error(`Ukuran ${originalName} melebihi ${CONFIG.MAX_FILE_MB} MB.`);
  }

  const ext = (originalName.match(/\.([a-zA-Z0-9]+)$/) || [,'jpg'])[1];
  const blob = Utilities.newBlob(bytes, mime, `${prefix}_${Date.now()}.${ext}`);
  return DriveApp.getFolderById(user.driveFolderId).createFile(blob).getUrl();
}

function assertFileInFolder_(file, folderId) {
  const parents = file.getParents();
  while (parents.hasNext()) {
    if (parents.next().getId() === String(folderId)) return true;
  }
  throw new Error('Anda tidak memiliki akses ke foto ini.');
}

function rowToObject_(headers, row) {
  const obj = {};
  headers.forEach((h,i) => obj[h] = row[i]);
  return obj;
}

function safeJsonParse_(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; }
  catch(e) { return fallback; }
}

function clean_(value, maxLen) {
  return String(value || '').trim().slice(0, maxLen || 5000);
}

function safeFileName_(value) {
  return String(value || 'Jastip').replace(/[\\/:*?"<>|]/g,'-').slice(0,80);
}

function createOrderId_() {
  const tz = Session.getScriptTimeZone() || 'Asia/Jakarta';
  const d = Utilities.formatDate(new Date(), tz, 'yyyyMMdd');
  return `JST-${d}-${randomHex_(6).toUpperCase()}`;
}

function createToken_() {
  return Utilities.getUuid().replace(/-/g,'');
}

function randomHex_(length) {
  return createToken_().slice(0,length);
}

function hashPassword_(password, salt) {
  // Iterasi SHA-256 + salt. Cukup untuk MVP GAS, tetapi untuk skala SaaS
  // produksi sebaiknya gunakan provider auth khusus seperti Supabase Auth.
  let value = `${salt}:${password}`;
  for (let i=0;i<2500;i++) value = sha256_(value + ':' + salt);
  return value;
}

function sha256_(text) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(text),
    Utilities.Charset.UTF_8
  );
  return digest.map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
}

function extractDriveFileId_(url) {
  const text = String(url || '');
  let m = text.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = text.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = text.match(/([a-zA-Z0-9_-]{20,})/);
  return m ? m[1] : '';
}

function formatDate_(value) {
  if (!value) return '';
  try {
    const d = value instanceof Date ? value : new Date(value);
    return Utilities.formatDate(d, Session.getScriptTimeZone() || 'Asia/Jakarta', 'dd MMM yyyy, HH:mm');
  } catch(e) { return String(value); }
}
