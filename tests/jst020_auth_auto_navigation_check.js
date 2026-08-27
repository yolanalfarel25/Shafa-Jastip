const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const codeGsPath = path.join(rootDir, '04_Backend_GAS', 'Code.gs');
const loginHtmlPath = path.join(rootDir, '01_Login_Signup', 'Login.html');
const dashboardHtmlPath = path.join(rootDir, '02_Dashboard_Jastiper', 'Dashboard.html');
const konfirmasiHtmlPath = path.join(rootDir, '03_Konfirmasi_Pembelian', 'Konfirmasi.html');

// 1. Read files
const codeGs = fs.readFileSync(codeGsPath, 'utf8');
const loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');
const dashboardHtml = fs.readFileSync(dashboardHtmlPath, 'utf8');
const konfirmasiHtml = fs.readFileSync(konfirmasiHtmlPath, 'utf8');

// 2. Syntax validation Code.gs
const script = new vm.Script(codeGs);
assert.ok(script, 'Code.gs syntax check OK');

// 3. Check automatic top-level navigation using server-bound URL
assert.ok(loginHtml.includes('const webAppUrl = "<?= typeof webAppUrl !== \'undefined\' ? webAppUrl : \'\' ?>";'), 'Login.html has webAppUrl');
assert.ok(loginHtml.includes('function navigatePage(page)'), 'Login.html has navigatePage');
assert.ok(loginHtml.includes('window.top.location.replace(target)'), 'Login.html targets top viewport');
assert.ok(loginHtml.includes('navigatePage(\'dashboard\')'), 'Login.html automatically navigates to dashboard on auth');
assert.ok(!loginHtml.includes('id="navManualLink"'), 'Login.html has no manual link button');

assert.ok(dashboardHtml.includes('const webAppUrl = "<?= typeof webAppUrl !== \'undefined\' ? webAppUrl : \'\' ?>";'), 'Dashboard.html has webAppUrl');
assert.ok(dashboardHtml.includes('function navigatePage(page)'), 'Dashboard.html has navigatePage');
assert.ok(dashboardHtml.includes('window.top.location.replace(target)'), 'Dashboard.html targets top viewport');
assert.ok(dashboardHtml.includes('navigatePage(\'login\')'), 'Dashboard.html navigates to login on logout/session expiry');
assert.ok(!dashboardHtml.includes('id="navManualLink"'), 'Dashboard.html has no manual link button');

// 4. Test doGet in vm sandbox
const fakePropertiesService = {
  getScriptProperties: () => ({
    getProperty: (k) => '1234567890abcdefghij-1234567890'
  })
};

const fakeScriptApp = {
  getService: () => ({
    getUrl: () => 'https://script.google.com/macros/s/STAGING_ID/exec'
  })
};

const evaluatedTemplates = [];

const fakeHtmlService = {
  createTemplateFromFile: (filename) => {
    return {
      evaluate: function() {
        evaluatedTemplates.push({
          filename,
          webAppUrl: this.webAppUrl
        });
        return {
          setTitle: () => ({
            setXFrameOptionsMode: () => ({})
          })
        };
      }
    };
  },
  XFrameOptionsMode: {
    ALLOWALL: 'ALLOWALL'
  }
};

const sandbox = {
  PropertiesService: fakePropertiesService,
  ScriptApp: fakeScriptApp,
  HtmlService: fakeHtmlService,
  SpreadsheetApp: {},
  DriveApp: {},
  LockService: {},
  CacheService: {},
  Session: {},
  Utilities: {},
  console
};

vm.createContext(sandbox);
vm.runInContext(codeGs, sandbox);

// Test doGet without page param (defaults to Konfirmasi buyer form)
sandbox.doGet({});
assert.strictEqual(evaluatedTemplates.length, 1);
assert.strictEqual(evaluatedTemplates[0].filename, 'Konfirmasi');
assert.strictEqual(evaluatedTemplates[0].webAppUrl, 'https://script.google.com/macros/s/STAGING_ID/exec');

// Test doGet with page=dashboard
sandbox.doGet({ parameter: { page: 'dashboard' } });
assert.strictEqual(evaluatedTemplates.length, 2);
assert.strictEqual(evaluatedTemplates[1].filename, 'Dashboard');
assert.strictEqual(evaluatedTemplates[1].webAppUrl, 'https://script.google.com/macros/s/STAGING_ID/exec');

// Test doGet with page=login
sandbox.doGet({ parameter: { page: 'login' } });
assert.strictEqual(evaluatedTemplates.length, 3);
assert.strictEqual(evaluatedTemplates[2].filename, 'Login');
assert.strictEqual(evaluatedTemplates[2].webAppUrl, 'https://script.google.com/macros/s/STAGING_ID/exec');

// Test doGet with page=account
sandbox.doGet({ parameter: { page: 'account' } });
assert.strictEqual(evaluatedTemplates.length, 4);
assert.strictEqual(evaluatedTemplates[3].filename, 'Login');
assert.strictEqual(evaluatedTemplates[3].webAppUrl, 'https://script.google.com/macros/s/STAGING_ID/exec');

console.log('JST-020 auth auto-navigation unit check passed.');