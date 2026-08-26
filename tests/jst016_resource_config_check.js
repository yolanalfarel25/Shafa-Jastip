const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const codeGs = fs.readFileSync(
  path.join(__dirname, '..', '04_Backend_GAS', 'Code.gs'),
  'utf8'
);

// 1. Syntax check
const script = new vm.Script(codeGs);
assert.ok(script, 'Code.gs parse OK');

// 2. Unit check getRequiredResourceConfig_
let fakeProps = {};
const fakePropertiesService = {
  getScriptProperties: () => ({
    getProperty: (k) => fakeProps[k] || null
  })
};

const sandbox = {
  PropertiesService: fakePropertiesService,
  SpreadsheetApp: {},
  DriveApp: {},
  HtmlService: {},
  LockService: {},
  CacheService: {},
  Session: {},
  Utilities: {},
  ScriptApp: {},
  console
};

vm.createContext(sandbox);
vm.runInContext(codeGs, sandbox);

// Test empty property
fakeProps = {};
assert.throws(
  () => sandbox.getRequiredResourceConfig_('SPREADSHEET_ID'),
  /Konfigurasi resource server belum valid/
);

// Test placeholder property
fakeProps = { SPREADSHEET_ID: 'PASTE_SPREADSHEET_ID_HERE' };
assert.throws(
  () => sandbox.getRequiredResourceConfig_('SPREADSHEET_ID'),
  /Konfigurasi resource server belum valid/
);

// Test short invalid property
fakeProps = { SPREADSHEET_ID: 'abc-123' };
assert.throws(
  () => sandbox.getRequiredResourceConfig_('SPREADSHEET_ID'),
  /Konfigurasi resource server belum valid/
);

// Test valid property
fakeProps = { SPREADSHEET_ID: '1234567890abcdefghij-1234567890' };
const res = sandbox.getRequiredResourceConfig_('SPREADSHEET_ID');
assert.strictEqual(res, '1234567890abcdefghij-1234567890');

console.log('JST-016 local unit check passed.');