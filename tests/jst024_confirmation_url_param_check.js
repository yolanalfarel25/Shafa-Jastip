const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const canonical = fs.readFileSync(path.join(root, '03_Konfirmasi_Pembelian', 'Konfirmasi.html'), 'utf8');
const deployed = fs.readFileSync(path.join(root, '04_Backend_GAS', 'Konfirmasi.html'), 'utf8');
assert.strictEqual(canonical, deployed, 'Confirmation templates must stay identical');

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

const init = functionBlock(canonical, 'function init(');
const boot = functionBlock(canonical, 'function boot(');

function setup({ hostParams, search = '' }) {
  const calls = [];
  const edits = [];
  let items = 0;
  const run = {
    withSuccessHandler() { return this; },
    withFailureHandler() { return this; },
    getPublicConfig(shop, id, token) { calls.push({ shop, id, token }); }
  };
  const script = { run };
  if (hostParams) {
    script.url = {
      getLocation(callback) { callback({ parameter: hostParams }); }
    };
  }
  const context = {
    URLSearchParams,
    location: { search },
    google: { script },
    editState: {},
    addItem: () => { items++; },
    renderConfig: () => {},
    showStatus: () => {},
    loadEditData: (id, token) => edits.push({ id, token })
  };
  vm.runInNewContext(`${init}\n${boot}`, context);
  context.boot();
  return { calls, edits, itemCount: () => items, editState: context.editState };
}

{
  const test = setup({
    hostParams: { shop: 'SHOP-HOST', id: 'ORDER-HOST', token: 'TOKEN-HOST' },
    search: '?shop=SHOP-IFRAME&id=ORDER-IFRAME&token=TOKEN-IFRAME'
  });
  assert.deepStrictEqual(test.calls, [{ shop: 'SHOP-HOST', id: 'ORDER-HOST', token: 'TOKEN-HOST' }]);
  assert.deepStrictEqual(test.edits, [{ id: 'ORDER-HOST', token: 'TOKEN-HOST' }]);
  assert.strictEqual(test.editState.shareCode, 'SHOP-HOST');
  assert.strictEqual(test.itemCount(), 1);
}

{
  const test = setup({ search: '?shop=SHOP-LOCAL&id=ORDER-LOCAL&token=TOKEN-LOCAL' });
  assert.deepStrictEqual(test.calls, [{ shop: 'SHOP-LOCAL', id: 'ORDER-LOCAL', token: 'TOKEN-LOCAL' }]);
  assert.deepStrictEqual(test.edits, [{ id: 'ORDER-LOCAL', token: 'TOKEN-LOCAL' }]);
  assert.strictEqual(test.editState.shareCode, 'SHOP-LOCAL');
  assert.strictEqual(test.itemCount(), 1);
}

console.log('JST-024 confirmation URL param check passed.');
