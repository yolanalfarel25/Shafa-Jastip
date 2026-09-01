const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const canonical = read('01_Login_Signup/Login.html');
const gas = read('04_Backend_GAS/Login.html');
const pages = read('login.html');

assert.strictEqual(canonical, gas, 'Canonical and GAS Login templates must match');
assert.strictEqual(canonical, pages, 'Canonical and Pages Login templates must match');
assert.ok(canonical.includes('Ingat email &amp; Password'), 'Remember checkbox must show Ingat email & Password');
assert.ok(canonical.includes('autocomplete="current-password"'), 'Login password must keep browser autofill fallback');
assert.ok(canonical.includes('async function rememberPassword('), 'Password-manager helper must exist');
assert.ok(canonical.includes("const res=await callApi('loginJastiper',{email,password:pw})"), 'Login must await server authentication');
assert.ok(canonical.indexOf('await rememberPassword(email,pw)') > canonical.indexOf("const res=await callApi('loginJastiper',{email,password:pw})"), 'Password storage must run after successful authentication');
assert.ok(!/localStorage\.(?:getItem|setItem)\([^)]*(?:password|\bpw\b)/i.test(canonical), 'Password must not enter localStorage');
assert.ok(!/sessionStorage\.(?:getItem|setItem)/.test(canonical), 'Password must not enter sessionStorage');
assert.ok(!/document\.cookie\s*=/.test(canonical), 'Password must not enter application cookies');

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

const helper = functionBlock(canonical, 'async function rememberPassword(');

async function runRemember(checked, { rejectStore = false, passwordCredential = true, store = true } = {}) {
  const stored = [];
  class PasswordCredential {
    constructor(value) { Object.assign(this, value); }
  }
  const context = {
    $: () => ({ checked }),
    window: passwordCredential ? { PasswordCredential } : {},
    navigator: { credentials: {} }
  };
  if (passwordCredential) context.PasswordCredential = PasswordCredential;
  if (store) context.navigator.credentials.store = credential => rejectStore ? Promise.reject(new Error('denied')) : (stored.push(credential), Promise.resolve());
  vm.createContext(context);
  vm.runInContext(helper, context);
  await context.rememberPassword('owner@example.test', 'synthetic-password');
  return stored;
}

(async () => {
  const stored = await runRemember(true);
  assert.strictEqual(stored.length, 1, 'Checked control must request browser credential storage');
  assert.strictEqual(stored[0].id, 'owner@example.test');
  assert.strictEqual(stored[0].password, 'synthetic-password');
  assert.strictEqual((await runRemember(false)).length, 0, 'Unchecked control must not request credential storage');
  await assert.doesNotReject(() => runRemember(true, { rejectStore: true }), 'Credential-manager failure must not block login');
  await assert.doesNotReject(() => runRemember(true, { passwordCredential: false }), 'Missing PasswordCredential must not block login');
  await assert.doesNotReject(() => runRemember(true, { store: false }), 'Missing credential store must not block login');

  const scripts = [...canonical.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]).join('\n');
  assert.doesNotThrow(() => new vm.Script(scripts, { filename: 'Login.html' }));
  console.log('JST-035 remember email and password check passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
