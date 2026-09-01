const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const canonical = read('02_Dashboard_Jastiper/Dashboard.html');
const gas = read('04_Backend_GAS/Dashboard.html');
const pages = read('dashboard.html');
const code = read('04_Backend_GAS/Code.gs');

assert.strictEqual(canonical, gas, 'Canonical and GAS Dashboard templates must match');
assert.strictEqual(canonical, pages, 'Canonical and Pages Dashboard templates must match');
assert.ok(!canonical.includes('class="chips"'), 'Duplicate item chips must be removed');
assert.ok(!canonical.includes('class="chip"'), 'Duplicate item chip style must be removed');
assert.ok(!canonical.includes('<b>Barang</b>'), 'Duplicate item label must be removed');
assert.ok(canonical.includes('class="photos"'), 'Photo grid must remain');
assert.ok(canonical.includes('function photoCard('), 'Photo card helper must remain');
assert.doesNotThrow(() => new vm.Script(code, { filename: 'Code.gs' }));
const scripts = [...canonical.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
assert.doesNotThrow(() => new vm.Script(scripts, { filename: 'Dashboard.html' }));

const sandbox = {
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'https://example.test' }) },
  ScriptApp: { getService: () => ({ getUrl: () => 'https://example.test/api' }) },
  HtmlService: { XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' } }, SpreadsheetApp: {}, DriveApp: {},
  LockService: {}, CacheService: { getScriptCache: () => ({ get: () => null, put: () => {}, remove: () => {} }) },
  Session: { getScriptTimeZone: () => 'Asia/Jakarta' },
  Utilities: {
    formatDate: () => '2026-09-01',
    computeDigest: (alg, text) => Array.from(require('crypto').createHash('sha256').update(String(text)).digest())
  }, console
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
assert.strictEqual(sandbox.formatWhatsApp_('8123456789'), '08123456789');
assert.strictEqual(sandbox.formatWhatsApp_('08123456789'), '08123456789');
assert.strictEqual(sandbox.formatWhatsApp_('+628123456789'), '+628123456789');
assert.strictEqual(sandbox.formatWhatsApp_('628123456789'), '628123456789');

const orders = [[
  'ORD-1','JSTP-1','SHARE','hash',new Date(),new Date(),'Buyer 1','Jakarta','81234567890','J&T','BCA - 1234',
  JSON.stringify([{ name: 'Barang', photoUrl: '' }]),''
], [
  'ORD-2','JSTP-1','SHARE','hash',new Date(),new Date(),'Buyer 2','Bandung','08987654321','Shopee','OldBank - 9999','[]',''
], [
  'ORD-3','JSTP-2','OTHER','hash',new Date(),new Date(),'Other','Solo','899999999','J&T','BCA - 1234','[]',''
]];
const user = { jastiperId: 'JSTP-1', shareCode: 'SHARE', namaJastip: 'Toko', namaPemilik: 'Owner', email: 'owner@example.test',
  bankAccountsJson: JSON.stringify([{ bankName: 'BCA', accountNumber: '1234', accountHolder: 'Shafa Owner' }]) };
sandbox.requireSession_ = () => ({ jastiperId: 'JSTP-1' });
sandbox.getUserObjectById_ = () => user;
sandbox.getOrdersSheet_ = () => ({ getLastRow: () => orders.length + 1, getRange: () => ({ getValues: () => orders }) });
const result = sandbox.getJastiperDashboard('session', '');
assert.strictEqual(result.rows.length, 2, 'Dashboard must isolate tenant rows');
const first = result.rows.find(r => r.orderId === 'ORD-1');
assert.strictEqual(first.noHp, '081234567890');
assert.strictEqual(first.accountHolder, 'Shafa Owner');
const second = result.rows.find(r => r.orderId === 'ORD-2');
assert.strictEqual(second.noHp, '08987654321');
assert.strictEqual(second.accountHolder, '');

const elements = {
  '#shareUrl': { value: '' }, '#stTotal': { textContent: '' }, '#stToday': { textContent: '' },
  '#stProof': { textContent: '' }, '#list': { className: '', textContent: '', innerHTML: '' }
};
const client = {
  state: {},
  esc: value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])),
  photoCard: () => '', lazyImages: () => {}, $: id => elements[id], document: { querySelectorAll: () => [] }
};
const start = scripts.indexOf('function renderDashboard(');
let depth = 0, end = -1;
for (let i = start; i < scripts.length; i++) { if (scripts[i] === '{') depth++; if (scripts[i] === '}' && --depth === 0) { end = i + 1; break; } }
vm.createContext(client);
vm.runInContext(scripts.slice(start, end), client);
client.renderDashboard(result);
assert.ok(elements['#list'].innerHTML.includes('<b>WhatsApp</b>081234567890'));
assert.ok(elements['#list'].innerHTML.includes('a.n. Shafa Owner'));
assert.ok(!elements['#list'].innerHTML.includes('class="chip"'));
console.log('JST-034 dashboard detail check passed.');
