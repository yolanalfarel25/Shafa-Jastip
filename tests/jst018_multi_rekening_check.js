const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const codeGsPath = path.join(rootDir, '04_Backend_GAS', 'Code.gs');
const confirmationHtmlPath = path.join(rootDir, '03_Konfirmasi_Pembelian', 'Konfirmasi.html');
const codeGs = fs.readFileSync(codeGsPath, 'utf8');
const confirmationHtml = fs.readFileSync(confirmationHtmlPath, 'utf8');

// 1. Syntax check
const script = new vm.Script(codeGs);
assert.ok(script, 'Code.gs syntax check OK');

// 2. VM Sandbox context for GAS functions
const fakeCache = new Map();
const sandbox = {
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => '1234567890abcdefghij-1234567890' }) },
  ScriptApp: { getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/STAGING/exec' }) },
  HtmlService: { XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' } },
  SpreadsheetApp: {},
  DriveApp: {},
  LockService: {},
  CacheService: {
    getScriptCache: () => ({
      get: k => fakeCache.get(k) || null,
      put: (k, v) => fakeCache.set(k, String(v)),
      remove: k => fakeCache.delete(k)
    })
  },
  Session: { getScriptTimeZone: () => 'Asia/Jakarta' },
  Utilities: {
    computeDigest: (alg, text) => {
      const crypto = require('crypto');
      return Array.from(crypto.createHash('sha256').update(String(text), 'utf8').digest());
    },
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    Charset: { UTF_8: 'UTF_8' }
  },
  console
};

vm.createContext(sandbox);
vm.runInContext(codeGs, sandbox);

// 3. Test cleanBankAccounts_
// Valid list
const valid = sandbox.cleanBankAccounts_([
  { bankName: 'BCA', accountNumber: '1234567890', accountHolder: 'Shafa Owner' },
  { bankName: 'Mandiri', accountNumber: '9876543210', accountHolder: 'Shafa Owner' }
]);
assert.strictEqual(valid.length, 2);
assert.strictEqual(valid[0].bankName, 'BCA');
assert.strictEqual(valid[1].bankName, 'Mandiri');

// Empty and whitespace filtered
const cleanedEmpty = sandbox.cleanBankAccounts_([
  { bankName: '', accountNumber: '', accountHolder: '' },
  { bankName: 'BRI', accountNumber: '11223344', accountHolder: 'Shafa Owner' }
]);
assert.strictEqual(cleanedEmpty.length, 1);
assert.strictEqual(cleanedEmpty[0].bankName, 'BRI');

// Incomplete accounts rejected
assert.throws(() => sandbox.cleanBankAccounts_([{ bankName: 'BCA', accountNumber: '', accountHolder: 'Owner' }]), /wajib diisi/);
assert.throws(() => sandbox.cleanBankAccounts_([{ bankName: '', accountNumber: '12345', accountHolder: 'Owner' }]), /wajib diisi/);

// Formula injection prefix in bankName/accountNumber/accountHolder rejected
assert.throws(() => sandbox.cleanBankAccounts_([{ bankName: '=SUM(1,2)', accountNumber: '123456', accountHolder: 'Owner' }]), /tidak valid/);
assert.throws(() => sandbox.cleanBankAccounts_([{ bankName: '+CMD', accountNumber: '123456', accountHolder: 'Owner' }]), /tidak valid/);
assert.throws(() => sandbox.cleanBankAccounts_([{ bankName: 'BCA', accountNumber: '-123456', accountHolder: 'Owner' }]), /tidak valid/);
assert.throws(() => sandbox.cleanBankAccounts_([{ bankName: 'BCA', accountNumber: '123456', accountHolder: '@Attacker' }]), /tidak valid/);

// Account number length bounds
assert.throws(() => sandbox.cleanBankAccounts_([{ bankName: 'BCA', accountNumber: '12', accountHolder: 'Owner' }]), /4–40/);

// Max 10 accounts limit
const eleven = Array.from({ length: 11 }, (_, i) => ({ bankName: `Bank${i}`, accountNumber: '123456', accountHolder: 'Owner' }));
assert.throws(() => sandbox.cleanBankAccounts_(eleven), /Maksimal 10/);

// 4. Test parseBankAccounts_ fallback legacy vs JSON
const userLegacy = { briNumber: '11112222', briName: 'Legacy BRI', bsiNumber: '33334444', bsiName: 'Legacy BSI', bankAccountsJson: '' };
const parsedLegacy = sandbox.parseBankAccounts_(userLegacy);
assert.strictEqual(parsedLegacy.length, 2);
assert.strictEqual(parsedLegacy[0].bankName, 'BRI');
assert.strictEqual(parsedLegacy[1].bankName, 'BSI');

const userJson = {
  briNumber: '11112222',
  briName: 'Legacy BRI',
  bankAccountsJson: JSON.stringify([{ bankName: 'SeaBank', accountNumber: '99887766', accountHolder: 'Digital' }])
};
const parsedJson = sandbox.parseBankAccounts_(userJson);
assert.strictEqual(parsedJson.length, 1);
assert.strictEqual(parsedJson[0].bankName, 'SeaBank');

// 5. Test bankAccountValue_
assert.strictEqual(sandbox.bankAccountValue_({ bankName: 'BCA', accountNumber: '1234' }), 'BCA - 1234');

// 6. Test Konfirmasi.html uses safe DOM rendering (textContent) for dynamic bank account list
assert.ok(confirmationHtml.includes("bankTitle.textContent = acc.bankName;"), 'Bank title uses textContent');
assert.ok(confirmationHtml.includes("detail.textContent = `${acc.accountNumber}"), 'Bank detail uses textContent');
assert.ok(!confirmationHtml.includes("container.innerHTML = `"), 'Dynamic bank options does not use raw template innerHTML');

// 7. Tenant isolation: authenticated jastiper A updates only row A, never row B
const userHeaders = vm.runInContext('USER_HEADERS', sandbox);
const makeUser = (id, email, bankJson) => userHeaders.map(header => ({
  jastiperId: id,
  createdAt: new Date(),
  updatedAt: new Date(),
  namaJastip: `Shop ${id}`,
  namaPemilik: `Owner ${id}`,
  email,
  noHp: '08123456789',
  passwordSalt: 'salt',
  passwordHash: 'hash',
  shareCode: `SHARE-${id}`,
  driveFolderId: `FOLDER-${id}`,
  briNumber: '',
  briName: '',
  bsiNumber: '',
  bsiName: '',
  status: 'active',
  bankAccountsJson: bankJson
})[header]);

const rows = [
  makeUser('A', 'a@example.test', '[]'),
  makeUser('B', 'b@example.test', JSON.stringify([{ bankName: 'BCA', accountNumber: '9999', accountHolder: 'Owner B' }]))
];
const beforeB = JSON.stringify(rows[1]);
const fakeUsersSheet = {
  getLastRow: () => rows.length + 1,
  getRange: (row, col, rowCount, colCount) => ({
    getValues: () => rows.map(r => r.slice()),
    setValues: values => { rows[row - 2] = values[0].slice(); }
  })
};

sandbox.requireSession_ = () => ({ jastiperId: 'A' });
sandbox.getUsersSheet_ = () => fakeUsersSheet;
sandbox.findUserByEmail_ = () => null;
sandbox.LockService = { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) };
sandbox.buildAuthResponse_ = id => ({ ok: true, profile: { jastiperId: id } });

sandbox.updateJastiperSettings('token-a', {
  namaJastip: 'Shop A Updated',
  namaPemilik: 'Owner A',
  email: 'a@example.test',
  noHp: '08123456789',
  bankAccounts: [{ bankName: 'Mandiri', accountNumber: '12345678', accountHolder: 'Owner A' }]
});

assert.strictEqual(rows[0][userHeaders.indexOf('namaJastip')], 'Shop A Updated');
assert.strictEqual(JSON.parse(rows[0][userHeaders.indexOf('bankAccountsJson')])[0].bankName, 'Mandiri');
assert.strictEqual(JSON.stringify(rows[1]), beforeB, 'Jastiper B remains unchanged');

console.log('JST-018 multi-rekening unit check passed.');
