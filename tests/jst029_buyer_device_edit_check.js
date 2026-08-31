const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const canonical = fs.readFileSync(path.join(root, '03_Konfirmasi_Pembelian', 'Konfirmasi.html'), 'utf8');
const gasMirror = fs.readFileSync(path.join(root, '04_Backend_GAS', 'Konfirmasi.html'), 'utf8');
const pagesEntry = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.strictEqual(canonical, gasMirror, 'Canonical and GAS buyer templates must match');
assert.strictEqual(canonical, pagesEntry, 'Canonical and GitHub Pages buyer templates must match');

function functionBlock(source, signature) {
  const start = source.indexOf(signature);
  assert.notStrictEqual(start, -1, `${signature} missing`);
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`${signature} braces unmatched`);
}

function storageMock() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: key => values.delete(String(key)),
    has: key => values.has(key)
  };
}

const storageSource = [
  'function getDeviceOrderStorageKey(',
  'function saveDeviceOrder(',
  'function getSavedDeviceOrder(',
  'function clearSavedDeviceOrder('
].map(signature => functionBlock(canonical, signature)).join('\n');

{
  const storage = storageMock();
  const context = { localStorage: storage, JSON, String, encodeURIComponent };
  vm.createContext(context);
  vm.runInContext(storageSource, context);

  context.saveDeviceOrder('SHOP-A', 'ORDER-A', 'TOKEN-A', 'https://example.com/edit-a');
  assert.strictEqual(storage.has('jastip-order-SHOP-A'), true, 'Storage key must use jastip-order-{shareCode}');
  assert.deepStrictEqual(
    JSON.parse(JSON.stringify(context.getSavedDeviceOrder('SHOP-A'))),
    { orderId: 'ORDER-A', editToken: 'TOKEN-A', editUrl: 'https://example.com/edit-a' },
    'Saved buyer edit credential must round-trip'
  );
  assert.strictEqual(context.getSavedDeviceOrder('SHOP-B'), null, 'Saved order must be isolated per shop');
  context.clearSavedDeviceOrder('SHOP-A');
  assert.strictEqual(context.getSavedDeviceOrder('SHOP-A'), null, 'Forget action must remove saved credential');
}

async function runInit(params, savedOrder) {
  const edits = [];
  const context = {
    editState: {},
    callApi: async () => ({ jastiper: {} }),
    renderConfig: () => {},
    showStatus: () => {},
    getSavedDeviceOrder: () => savedOrder,
    loadEditData: async (id, token, source) => edits.push({ id, token, source }),
    history: { replaceState: () => {} },
    location: { pathname: '/' },
    encodeURIComponent
  };
  vm.createContext(context);
  vm.runInContext(functionBlock(canonical, 'async function init('), context);
  await context.init(params);
  return edits;
}

async function runLoadFailure(credentialRejected) {
  let cacheClears = 0;
  const error = new Error('Server gagal.');
  error.credentialRejected = credentialRejected;
  const badge = { style: {} };
  const context = {
    editState: { orderId: '', editToken: '', editUrl: '', shareCode: 'SHOP-A' },
    showStatus: () => {},
    callApi: async () => { throw error; },
    clearStatus: () => {},
    clearSavedDeviceOrder: () => { cacheClears++; },
    $: () => badge,
    document: { querySelector: () => null },
    CSS: { escape: value => value },
    encodeURIComponent,
    history: { replaceState: () => {} },
    location: { origin: 'https://example.com', pathname: '/' }
  };
  vm.createContext(context);
  vm.runInContext(functionBlock(canonical, 'async function loadEditData('), context);
  await context.loadEditData('ORDER-A', 'TOKEN-A', 'device');
  return cacheClears;
}

(async () => {
  assert.deepStrictEqual(
    await runInit(
      { shop: 'SHOP-A', id: 'ORDER-URL', token: 'TOKEN-URL' },
      { orderId: 'ORDER-SAVED', editToken: 'TOKEN-SAVED', editUrl: 'https://example.com/saved' }
    ),
    [{ id: 'ORDER-URL', token: 'TOKEN-URL', source: 'url' }],
    'Explicit edit URL must win over browser storage'
  );
  assert.deepStrictEqual(
    await runInit(
      { shop: 'SHOP-A', id: '', token: '' },
      { orderId: 'ORDER-SAVED', editToken: 'TOKEN-SAVED', editUrl: 'https://example.com/saved' }
    ),
    [{ id: 'ORDER-SAVED', token: 'TOKEN-SAVED', source: 'device' }],
    'Shop link must restore same-browser order'
  );

  assert.strictEqual(await runLoadFailure(false), 0, 'Transient error must preserve cached device order');
  assert.strictEqual(await runLoadFailure(true), 1, 'Confirmed invalid credential must clear cached device order');

  const loadEditData = functionBlock(canonical, 'async function loadEditData(');
  assert.ok(loadEditData.includes("source === 'device' && err.credentialRejected"), 'Transient and unrelated server failure must not evict cache');
  assert.ok(canonical.includes("error.message === 'Token edit tidak valid.'"), 'Server token rejection must mark credential invalid');
  assert.ok(canonical.includes("error.message === 'Data tidak ditemukan.'"), 'Missing order must mark credential invalid');
  assert.ok(loadEditData.includes('clearSavedDeviceOrder'), 'Rejected stored credential must be removed');
  assert.ok(canonical.includes("saveDeviceOrder(editState.shareCode, res.orderId, res.editToken, res.editUrl)"), 'Successful save must remember edit credential with editUrl');
  assert.ok(canonical.includes('id="forgetDevice"'), 'Shared-device forget control must exist');
  assert.ok(canonical.includes("$('#forgetDevice').addEventListener('click'"), 'Forget control must be wired');
  assert.ok(canonical.includes('history.replaceState'), 'Validated URL token must be removed from address bar');
  assert.ok(!storageSource.includes('namaLengkap'), 'Buyer PII must not be stored in browser credential');
  assert.ok(!storageSource.includes('alamat'), 'Buyer address must not be stored in browser credential');
  assert.ok(!storageSource.includes('noHp'), 'Buyer phone must not be stored in browser credential');

  console.log('JST-029 buyer device edit check passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
