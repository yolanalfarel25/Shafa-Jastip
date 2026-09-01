const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const codeGs = fs.readFileSync(path.join(root, '04_Backend_GAS', 'Code.gs'), 'utf8');

// 1. Verifikasi sintaks Code.gs
assert.doesNotThrow(() => new vm.Script(codeGs, { filename: 'Code.gs' }), 'Code.gs syntax check OK');

// 2. Verifikasi static entrypoint files & nojekyll
assert.ok(fs.existsSync(path.join(root, '.nojekyll')), '.nojekyll must exist in repo root');
assert.ok(fs.existsSync(path.join(root, 'index.html')), 'index.html must exist in repo root');
assert.ok(fs.existsSync(path.join(root, 'login.html')), 'login.html must exist in repo root');
assert.ok(fs.existsSync(path.join(root, 'dashboard.html')), 'dashboard.html must exist in repo root');

// 3. Verifikasi frontend templates bebas dari google.script.run dan scriptlet server-side GAS
const frontendFiles = [
  '01_Login_Signup/Login.html',
  '02_Dashboard_Jastiper/Dashboard.html',
  '03_Konfirmasi_Pembelian/Konfirmasi.html',
  '04_Backend_GAS/Login.html',
  '04_Backend_GAS/Dashboard.html',
  '04_Backend_GAS/Konfirmasi.html',
  'index.html',
  'login.html',
  'dashboard.html'
];

for (const rel of frontendFiles) {
  const content = fs.readFileSync(path.join(root, rel), 'utf8');
  assert.ok(!content.includes('google.script.run'), `${rel} must not use google.script.run`);
  assert.ok(!content.includes('<?= typeof webAppUrl'), `${rel} must not use webAppUrl scriptlet`);
  assert.ok(content.includes('callApi'), `${rel} must declare callApi helper`);
  assert.ok(!content.includes('window.JASTIP_API_URL'), `${rel} must not allow runtime endpoint override`);
  assert.ok(!content.includes("localStorage.getItem('jastipApiUrl')"), `${rel} must not read API endpoint from localStorage`);
  assert.ok(content.includes('JSON.stringify({...(payload||{}),action})'), `${rel} must prevent payload from overriding action`);
}

// 4. Verifikasi sandbox doPost dispatcher
function createBackendSandbox(props = {}) {
  const properties = Object.assign({
    SPREADSHEET_ID: '1234567890abcdefghij-1234567890',
    DRIVE_ROOT_FOLDER_ID: '1234567890abcdefghij-1234567890',
    FRONTEND_BASE_URL: ''
  }, props);

  const outputs = [];
  const textOutput = {
    setMimeType(mime) { this.mime = mime; return this; }
  };

  const sandbox = {
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: k => properties[k] || ''
      })
    },
    ScriptApp: {
      getService: () => ({
        getUrl: () => 'https://script.google.com/macros/s/STAGING/exec'
      })
    },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: (text) => {
        const out = Object.assign({ text, mime: '' }, textOutput);
        outputs.push(out);
        return out;
      }
    },
    HtmlService: {
      createTemplateFromFile: () => ({
        evaluate: () => ({
          setTitle: () => ({ setXFrameOptionsMode: () => ({}) })
        })
      }),
      XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' }
    },
    SpreadsheetApp: {},
    DriveApp: {},
    LockService: {
      getScriptLock: () => ({
        waitLock: () => true,
        releaseLock: () => true
      })
    },
    CacheService: {
      getScriptCache: () => ({
        get: () => null,
        put: () => {},
        remove: () => {}
      })
    },
    Session: {
      getScriptTimeZone: () => 'Asia/Jakarta'
    },
    Utilities: {
      getUuid: () => '1111222233334444',
      formatDate: (d, tz, fmt) => '2026-08-31',
      computeDigest: () => [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    },
    console
  };

  vm.createContext(sandbox);
  vm.runInContext(codeGs, sandbox);
  return { sandbox, outputs };
}

// 4a. Test exact allowlist and doPost argument mapping for all public actions
const actionContracts = {
  signupJastiper: [{ synthetic: 'payload' }],
  loginJastiper: ['owner@example.test', 'synthetic-password'],
  getJastiperSession: ['synthetic-session'],
  logoutJastiper: ['synthetic-session'],
  updateJastiperSettings: ['synthetic-session', { synthetic: 'payload' }],
  getPublicConfig: ['J-SYNTHETIC', 'ORDER-SYNTHETIC', 'EDIT-SYNTHETIC'],
  saveConfirmation: [{ synthetic: 'payload' }],
  getConfirmation: ['ORDER-SYNTHETIC', 'EDIT-SYNTHETIC'],
  getJastiperDashboard: ['synthetic-session', 'search'],
  getJastiperImageData: ['synthetic-session', 'https://drive.example.test/file'],
  deleteOrder: ['synthetic-session', 'ORDER-SYNTHETIC']
};

const dispatcherBlock = codeGs.slice(codeGs.indexOf('function doPost(e)'), codeGs.indexOf('function jsonResponse_'));
const routedActions = [...dispatcherBlock.matchAll(/case '([^']+)'/g)].map(match => match[1]);
assert.deepStrictEqual(routedActions.sort(), Object.keys(actionContracts).sort(), 'doPost must expose exact action allowlist');

function requestForAction(action) {
  return {
    signupJastiper: { payload: actionContracts[action][0] },
    loginJastiper: { email: actionContracts[action][0], password: actionContracts[action][1] },
    getJastiperSession: { sessionToken: actionContracts[action][0] },
    logoutJastiper: { sessionToken: actionContracts[action][0] },
    updateJastiperSettings: { sessionToken: actionContracts[action][0], payload: actionContracts[action][1] },
    getPublicConfig: { shareCode: actionContracts[action][0], orderId: actionContracts[action][1], editToken: actionContracts[action][2] },
    saveConfirmation: { payload: actionContracts[action][0] },
    getConfirmation: { orderId: actionContracts[action][0], editToken: actionContracts[action][1] },
    getJastiperDashboard: { sessionToken: actionContracts[action][0], searchText: actionContracts[action][1] },
    getJastiperImageData: { sessionToken: actionContracts[action][0], driveFileUrl: actionContracts[action][1] },
    deleteOrder: { sessionToken: actionContracts[action][0], orderId: actionContracts[action][1] }
  }[action];
}

for (const [action, expectedArgs] of Object.entries(actionContracts)) {
  const { sandbox, outputs } = createBackendSandbox();
  sandbox[action] = (...args) => ({ ok: true, action, args });
  const body = Object.assign({ action }, requestForAction(action));
  sandbox.doPost({ postData: { contents: JSON.stringify(body) } });
  assert.strictEqual(outputs.length, 1, `${action} must return one JSON response`);
  assert.strictEqual(outputs[0].mime, 'application/json', `${action} must use JSON MIME type`);
  const result = JSON.parse(outputs[0].text);
  assert.strictEqual(result.ok, true, `${action} must return successful stub result`);
  assert.strictEqual(result.action, action, `${action} must call matching backend function`);
  assert.deepStrictEqual(result.args, expectedArgs, `${action} must preserve argument mapping`);
}

// 4b. Test doPost with invalid action
{
  const { sandbox, outputs } = createBackendSandbox();
  sandbox.doPost({ postData: { contents: JSON.stringify({ action: 'unknownAction' }) } });
  assert.strictEqual(outputs.length, 1);
  const res = JSON.parse(outputs[0].text);
  assert.strictEqual(res.ok, false);
  assert.match(res.error, /Aksi API tidak valid/);
}

// 4c. Test doPost with empty postData
{
  const { sandbox, outputs } = createBackendSandbox();
  sandbox.doPost({});
  assert.strictEqual(outputs.length, 1);
  const res = JSON.parse(outputs[0].text);
  assert.strictEqual(res.ok, false);
}

// 4c. Test getFrontendBaseUrl_ fallback and configured URL
{
  const { sandbox: fallbackSandbox } = createBackendSandbox();
  assert.strictEqual(
    sandboxRun(fallbackSandbox, 'getFrontendBaseUrl_()'),
    'https://script.google.com/macros/s/STAGING/exec',
    'Fallback base URL should match Web App URL when FRONTEND_BASE_URL is empty'
  );

  const { sandbox: customSandbox } = createBackendSandbox({ FRONTEND_BASE_URL: 'https://yolanalfarel25.github.io/Shafa-Jastip/' });
  assert.strictEqual(
    sandboxRun(customSandbox, 'getFrontendBaseUrl_()'),
    'https://yolanalfarel25.github.io/Shafa-Jastip',
    'Configured FRONTEND_BASE_URL should be trimmed and honored'
  );

  const { sandbox: invalidSandbox } = createBackendSandbox({ FRONTEND_BASE_URL: 'ftp://bad-url' });
  assert.throws(
    () => sandboxRun(invalidSandbox, 'getFrontendBaseUrl_()'),
    /Konfigurasi FRONTEND_BASE_URL tidak valid/,
    'Invalid protocol must throw explicit error'
  );
}

// 4d. Test buildShareUrl_ uses base URL
{
  const { sandbox: shareSandbox } = createBackendSandbox({ FRONTEND_BASE_URL: 'https://yolanalfarel25.github.io/Shafa-Jastip' });
  const url = sandboxRun(shareSandbox, "buildShareUrl_('J-SYNTHETIC-CODE')");
  assert.strictEqual(url, 'https://yolanalfarel25.github.io/Shafa-Jastip?shop=J-SYNTHETIC-CODE');
}

function sandboxRun(sb, code) {
  return vm.runInContext(code, sb);
}

console.log('JST-028 API contract and static frontend check passed.');