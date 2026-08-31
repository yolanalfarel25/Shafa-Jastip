const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const canonical = fs.readFileSync(path.join(root, '02_Dashboard_Jastiper', 'Dashboard.html'), 'utf8');
const deployed = fs.readFileSync(path.join(root, '04_Backend_GAS', 'Dashboard.html'), 'utf8');
assert.strictEqual(canonical, deployed, 'Dashboard templates must stay identical');

for (const [name, html] of [['canonical', canonical], ['deployed', deployed]]) {
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length, `${name} script missing`);
  scripts.forEach((match, index) => assert.doesNotThrow(
    () => new vm.Script(match[1].replace(/<\?[\s\S]*?\?>/g, ''), { filename: `${name}#${index + 1}` })
  ));
}

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

const busy = functionBlock(canonical, 'function busy(');
const collect = functionBlock(canonical, 'function collectBankAccounts(');
const handler = canonical.match(/\$\('#saveSettings'\)\.onclick=async\(\)=>\{[\s\S]*?\n  \};/);
assert.ok(handler, 'saveSettings handler missing');

function setup(accounts, result) {
  const button = { disabled: false, textContent: 'Simpan Pengaturan', onclick: null };
  const fields = {
    '#saveSettings': button,
    '#pNamaJastip': { value: 'Toko Sintetis' },
    '#pNamaPemilik': { value: 'Pemilik Sintetis' },
    '#pEmail': { value: 'owner@example.test' },
    '#pNoHp': { value: '08123456789' }
  };
  const alerts = [];
  const calls = [];
  const context = {
    document: {
      querySelector: selector => fields[selector],
      querySelectorAll: selector => selector === '#bankList>div' ? accounts.map(account => ({
        querySelector: child => ({
          value: child === '.bank-name' ? account.bankName : child === '.bank-number' ? account.accountNumber : account.accountHolder
        })
      })) : []
    },
    state: { sessionToken: 'synthetic-session', profile: null, shareUrl: '' },
    alert: message => alerts.push(String(message)),
    showApp: () => {},
    localStorage: { removeItem: () => {} },
    navigatePage: () => {},
    callApi: async (action, request) => {
      calls.push({ action, request });
      if (result instanceof Error) throw result;
      return result;
    }
  };
  context.$ = selector => context.document.querySelector(selector);
  vm.runInNewContext(`${busy}\n${collect}\n${handler[0]}`, context);
  return { button, alerts, calls };
}

async function main() {
  {
    const test = setup([{ bankName: 'BCA', accountNumber: '', accountHolder: 'Pemilik Sintetis' }]);
    await test.button.onclick();
    assert.strictEqual(test.calls.length, 0, 'Incomplete account must block request');
    assert.match(test.alerts[0], /wajib diisi/);
    assert.strictEqual(test.button.disabled, false);
  }

  {
    const test = setup([{ bankName: 'BCA', accountNumber: '123', accountHolder: 'Pemilik Sintetis' }]);
    await test.button.onclick();
    assert.strictEqual(test.calls.length, 0, 'Short account number must block request');
    assert.match(test.alerts[0], /minimal 4 digit/);
  }

  {
    const response = { profile: { namaJastip: 'Toko Sintetis' }, shareUrl: 'https://example.test/synthetic' };
    const test = setup([{ bankName: 'BRI', accountNumber: '208901001614501', accountHolder: 'Pemilik Sintetis' }], response);
    await test.button.onclick();
    assert.strictEqual(test.calls.length, 1, 'Valid click must call backend once');
    assert.strictEqual(test.calls[0].action, 'updateJastiperSettings');
    assert.strictEqual(test.calls[0].request.sessionToken, 'synthetic-session');
    assert.strictEqual(test.calls[0].request.payload.bankAccounts[0].bankName, 'BRI');
    assert.strictEqual(test.button.disabled, false);
    assert.strictEqual(test.button.textContent, 'Simpan Pengaturan');
    assert.strictEqual(test.alerts.includes('Pengaturan tersimpan.'), true);
  }

  {
    const test = setup([{ bankName: 'BSI', accountNumber: '7123456789', accountHolder: 'Pemilik Sintetis' }], new Error('Kegagalan sintetis'));
    await test.button.onclick();
    assert.strictEqual(test.button.disabled, false);
    assert.strictEqual(test.button.textContent, 'Simpan Pengaturan');
    assert.strictEqual(test.alerts.includes('Kegagalan sintetis'), true);
  }

  console.log('JST-023 dashboard save settings check passed.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
