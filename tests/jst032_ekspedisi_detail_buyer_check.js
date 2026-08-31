const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const code = read('04_Backend_GAS/Code.gs');
const dashboard = read('04_Backend_GAS/Dashboard.html');
const confirmation = read('04_Backend_GAS/Konfirmasi.html');

assert.strictEqual(dashboard, read('02_Dashboard_Jastiper/Dashboard.html'));
assert.strictEqual(dashboard, read('dashboard.html'));
assert.strictEqual(confirmation, read('03_Konfirmasi_Pembelian/Konfirmasi.html'));
assert.strictEqual(confirmation, read('index.html'));
new vm.Script(code, { filename: 'Code.gs' });

const sandbox = {
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => '1234567890abcdefghij-1234567890' }) },
  ScriptApp: { getService: () => ({ getUrl: () => 'https://example.test/exec' }) },
  HtmlService: { XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' } },
  SpreadsheetApp: {}, DriveApp: {}, LockService: {},
  CacheService: { getScriptCache: () => ({ get: () => null, put: () => {}, remove: () => {} }) },
  Session: { getScriptTimeZone: () => 'Asia/Jakarta' },
  Utilities: {
    computeDigest: (alg, text) => Array.from(require('crypto').createHash('sha256').update(String(text)).digest()),
    DigestAlgorithm: { SHA_256: 'SHA_256' }, Charset: { UTF_8: 'UTF_8' }
  },
  console
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const plain = value => JSON.parse(JSON.stringify(value));

assert.ok(vm.runInContext('USER_HEADERS', sandbox).includes('ekspedisiListJson'));
assert.deepStrictEqual(plain(sandbox.cleanEkspedisiList_([' Shopee ', '', 'J&T'])), ['Shopee', 'J&T']);
assert.deepStrictEqual(plain(sandbox.parseEkspedisiList_({})), ['Shopee', 'J&T']);
assert.deepStrictEqual(plain(sandbox.parseEkspedisiList_({ ekspedisiListJson: '["JNE"]' })), ['JNE']);
assert.deepStrictEqual(plain(sandbox.parseEkspedisiList_({ ekspedisiListJson: '[]' })), ['Shopee', 'J&T']);
assert.throws(() => sandbox.cleanEkspedisiList_('JNE'), /Format daftar ekspedisi/);
assert.throws(() => sandbox.cleanEkspedisiList_(Array.from({ length: 11 }, (_, i) => `E${i}`)), /Maksimal 10/);
assert.throws(() => sandbox.cleanEkspedisiList_(['JNE', 'jne']), /duplikat/);
assert.throws(() => sandbox.cleanEkspedisiList_(['Lainnya']), /sudah disediakan/);
for (const prefix of ['=', '+', '-', '@']) {
  assert.throws(() => sandbox.cleanEkspedisiList_([prefix + 'RISK']), /tidak valid/);
}
assert.throws(() => sandbox.validateBuyerPayload_({
  namaLengkap: 'Buyer', alamat: 'Alamat', noHp: '0800', ekspedisi: '=RISK',
  bankTujuan: 'Bank - 1234', items: [{}]
}), /Nama ekspedisi tidak valid/);

const headers = vm.runInContext('USER_HEADERS', sandbox);
const userRow = (id, email, ekspedisiListJson) => headers.map(header => ({
  jastiperId: id, createdAt: new Date(), updatedAt: new Date(), namaJastip: `Toko ${id}`,
  namaPemilik: `Pemilik ${id}`, email, noHp: '0800', passwordSalt: 'salt',
  passwordHash: 'hash', shareCode: `SHARE-${id}`, driveFolderId: `FOLDER-${id}`,
  briNumber: '', briName: '', bsiNumber: '', bsiName: '', status: 'active',
  bankAccountsJson: '[]', ekspedisiListJson
})[header]);
const rows = [userRow('A', 'a@example.test', ''), userRow('B', 'b@example.test', '["JNE"]')];
const beforeB = JSON.stringify(rows[1]);
sandbox.requireSession_ = () => ({ jastiperId: 'A' });
sandbox.getUsersSheet_ = () => ({
  getLastRow: () => 3,
  getRange: row => ({
    getValues: () => rows.map(value => value.slice()),
    setValues: values => { rows[row - 2] = values[0].slice(); }
  })
});
sandbox.findUserByEmail_ = () => null;
sandbox.LockService = { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) };
sandbox.buildAuthResponse_ = () => ({ ok: true });
sandbox.updateJastiperSettings('session-a', {
  namaJastip: 'Toko A', namaPemilik: 'Pemilik A', email: 'a@example.test', noHp: '0800',
  ekspedisiList: ['Shopee', 'SiCepat']
});
assert.strictEqual(rows[0][headers.indexOf('ekspedisiListJson')], '["Shopee","SiCepat"]');
assert.strictEqual(JSON.stringify(rows[1]), beforeB, 'Update jastiper A must not modify jastiper B');

function scripts(html, name) {
  const source = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1].replace(/<\?[\s\S]*?\?>/g, '')).join('\n');
  new vm.Script(source, { filename: name });
  return source;
}
const dashboardJs = scripts(dashboard, 'Dashboard.html');
const confirmationJs = scripts(confirmation, 'Konfirmasi.html');

assert.ok(dashboard.includes('id="ekspedisiList"'));
assert.ok(dashboard.includes('id="addEkspedisiBtn"'));
assert.ok(dashboardJs.includes('ekspedisiList=collectEkspedisiList()'));
assert.match(dashboardJs, /bankAccounts,\s+ekspedisiList/);
assert.ok(dashboard.includes('.buyer .body{display:none'));
assert.ok(dashboardJs.includes('class="buyer-summary"'));
assert.ok(dashboardJs.includes('class="buyer-address"'));
assert.ok(dashboardJs.includes('class="btn outline detail-toggle"'));
assert.ok(dashboardJs.includes('aria-expanded="false"'));
assert.ok(dashboardJs.includes("card.classList.toggle('open')"));
assert.ok(dashboardJs.includes("button.setAttribute('aria-expanded',String(open))"));

assert.ok(confirmation.includes('id="shipOptions"'));
assert.ok(confirmation.includes('id="otherShipWrap"'));
assert.ok(confirmation.includes('id="ekspedisiManual" maxlength="60"'));
assert.ok(confirmationJs.includes("[...list, '__OTHER__']"));
assert.ok(confirmationJs.includes("title.textContent = other ? 'Lainnya' : name"));
assert.ok(confirmationJs.includes("$('#ekspedisiManual').required = other"));
assert.ok(confirmationJs.includes("if (!ekspedisi) throw new Error('Nama ekspedisi lainnya wajib diisi.')"));
assert.ok(confirmationJs.includes('renderShipOptions(cfg.ekspedisiList)'));
assert.ok(confirmationJs.includes('selectShip(pendingShipValue)'));
assert.ok(!confirmationJs.includes('CSS.escape(data.ekspedisi'));

console.log('JST-032 ekspedisi dan detail buyer check passed.');
