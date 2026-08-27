const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const srcHtml = fs.readFileSync(path.join(rootDir, '02_Dashboard_Jastiper', 'Dashboard.html'), 'utf8');
const backendHtml = fs.readFileSync(path.join(rootDir, '04_Backend_GAS', 'Dashboard.html'), 'utf8');

// 1. Check sync between canonical source and deployment template
assert.strictEqual(srcHtml, backendHtml, 'Dashboard canonical and GAS backend templates must be identical');

// 2. Extract and parse client JavaScript
const scriptMatches = [...srcHtml.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
assert.ok(scriptMatches.length > 0, 'Script block must be present');

const classList = active => {
  const values = new Set(active ? ['active'] : []);
  return { add: value => values.add(value), remove: value => values.delete(value), contains: value => values.has(value) };
};
const element = (panel, active = false) => ({ dataset: { panel }, classList: classList(active), onclick: null });
const navBtnOrders = element('orders', true);
const navBtnSettings = element('settings');
const panelOrders = element('', true);
const panelSettings = element('');
const navButtons = [navBtnOrders, navBtnSettings];
const panels = [panelOrders, panelSettings];
const documentMock = {
  querySelectorAll: selector => selector === '.nav button' ? navButtons : panels,
  getElementById: id => id === 'orders' ? panelOrders : id === 'settings' ? panelSettings : null
};

const handler = srcHtml.match(/  document\.querySelectorAll\('\.nav button'\)\.forEach\(b=>b\.onclick=\(\)=>\{[\s\S]*?\n  \}\);/);
assert.ok(handler, 'Dashboard tab handler must be present');
vm.runInNewContext(handler[0], { document: documentMock });

// 3. Test initial state
assert.strictEqual(navBtnOrders.classList.contains('active'), true, 'Orders button initially active');
assert.strictEqual(navBtnSettings.classList.contains('active'), false, 'Settings button initially inactive');
assert.strictEqual(panelOrders.classList.contains('active'), true, 'Orders panel initially active');
assert.strictEqual(panelSettings.classList.contains('active'), false, 'Settings panel initially inactive');

// 4. Click 'Pengaturan Jastip'
assert.strictEqual(typeof navBtnSettings.onclick, 'function', 'Settings button must have onclick handler');
navBtnSettings.onclick();
assert.strictEqual(navBtnOrders.classList.contains('active'), false, 'Orders button becomes inactive');
assert.strictEqual(navBtnSettings.classList.contains('active'), true, 'Settings button becomes active');
assert.strictEqual(panelOrders.classList.contains('active'), false, 'Orders panel hidden');
assert.strictEqual(panelSettings.classList.contains('active'), true, 'Settings panel visible');

// 5. Click 'Data Buyer'
assert.strictEqual(typeof navBtnOrders.onclick, 'function', 'Orders button must have onclick handler');
navBtnOrders.onclick();
assert.strictEqual(navBtnOrders.classList.contains('active'), true, 'Orders button active again');
assert.strictEqual(navBtnSettings.classList.contains('active'), false, 'Settings button inactive again');
assert.strictEqual(panelOrders.classList.contains('active'), true, 'Orders panel active again');
assert.strictEqual(panelSettings.classList.contains('active'), false, 'Settings panel inactive again');

console.log('JST-022 dashboard tabs check passed.');