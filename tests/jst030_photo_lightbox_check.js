const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const canonical = fs.readFileSync(path.join(root, '02_Dashboard_Jastiper', 'Dashboard.html'), 'utf8');
const gas = fs.readFileSync(path.join(root, '04_Backend_GAS', 'Dashboard.html'), 'utf8');
const pages = fs.readFileSync(path.join(root, 'dashboard.html'), 'utf8');

assert.strictEqual(canonical, gas, 'Canonical and GAS templates must match');
assert.strictEqual(canonical, pages, 'Canonical and Pages templates must match');

assert.ok(canonical.includes('id="imgModal"'), '#imgModal exists');
assert.ok(canonical.includes('role="dialog"'), 'role="dialog" exists');
assert.ok(canonical.includes('aria-modal="true"'), 'aria-modal exists');
assert.ok(canonical.includes('id="lbClose"'), '#lbClose exists');
assert.ok(canonical.includes('id="lbImg"'), '#lbImg exists');
assert.ok(canonical.includes('id="lbCap"'), '#lbCap exists');
assert.ok(canonical.includes('aria-describedby="lbCap"'), 'aria-describedby exists');

const scripts = [...canonical.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
new vm.Script(scripts, { filename: 'Dashboard.html' });

function functionBlock(src, sig) {
  const start = src.indexOf(sig);
  assert.notStrictEqual(start, -1, sig + ' missing');
  let d = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '{') d++;
    if (src[i] === '}' && --d === 0) return src.slice(start, i + 1);
  }
  throw new Error(sig + ' unclosed');
}

// 1. photoCard label
{
  const fn = functionBlock(scripts, 'function photoCard(');
  const ctx = { esc: value => String(value || '') };
  vm.createContext(ctx);
  vm.runInContext(fn, ctx);
  const res = ctx.photoCard('http://x.com/a.jpg', 'Item Alpha');
  assert.ok(res.includes('data-label="Item Alpha"'), 'Embeds data-label');
  assert.ok(res.includes('data-url="http://x.com/a.jpg"'), 'Embeds data-url');
}

// 2. Open / Close / Backdrop / Keyboard
{
  const openClass = new Set();
  let focused = null;
  const modal = {
    classList: {
      add: c => openClass.add(c),
      remove: c => openClass.delete(c),
      contains: c => openClass.has(c)
    },
    evts: {},
    addEventListener(k, f) { this.evts[k] = f; }
  };
  const lbImg = { src: '' };
  const lbCap = { textContent: '' };
  const lbClose = { focus: () => { focused = 'close'; }, onclick: null };
  const opener = { isConnected: true, focus: () => { focused = 'opener'; } };
  const docEvts = {};

  const ctx = {
    state: {},
    $: id => ({ '#imgModal': modal, '#lbImg': lbImg, '#lbCap': lbCap, '#lbClose': lbClose }[id]),
    document: {
      activeElement: opener,
      addEventListener: (k, f) => { docEvts[k] = f; }
    }
  };

  const openFn = functionBlock(scripts, 'function openLightbox(');
  const closeFn = functionBlock(scripts, 'function closeLightbox(');
  vm.createContext(ctx);
  vm.runInContext(`
    ${openFn}
    ${closeFn}
    $('#imgModal').addEventListener('click', e => { if (e.target === $('#imgModal')) closeLightbox(); });
    $('#lbClose').onclick = closeLightbox;
    document.addEventListener('keydown', e => {
      if (!$('#imgModal').classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'Tab') { e.preventDefault(); $('#lbClose').focus(); }
    });
  `, ctx);

  ctx.openLightbox('http://x.com/b.jpg', 'Label B');
  assert.strictEqual(lbImg.src, 'http://x.com/b.jpg');
  assert.strictEqual(lbImg.alt, 'Label B');
  assert.strictEqual(lbCap.textContent, 'Label B');
  assert.strictEqual(openClass.has('open'), true);
  assert.strictEqual(focused, 'close');

  ctx.closeLightbox();
  assert.strictEqual(openClass.has('open'), false);
  assert.strictEqual(focused, 'opener');

  ctx.openLightbox('http://x.com/b.jpg', 'Label B');
  modal.evts['click']({ target: modal });
  assert.strictEqual(openClass.has('open'), false, 'Backdrop click closes');

  ctx.openLightbox('http://x.com/b.jpg', 'Label B');
  let tabPrevented = false;
  docEvts['keydown']({ key: 'Tab', preventDefault: () => { tabPrevented = true; } });
  assert.strictEqual(tabPrevented, true, 'Tab trapped to close button');
  assert.strictEqual(focused, 'close');

  docEvts['keydown']({ key: 'Escape' });
  assert.strictEqual(openClass.has('open'), false, 'Escape closes');
}

// 3. loadImg wiring
(async () => {
  let opened = null;
  const container = { child: null, replaceChildren(c) { this.child = c; } };
  const card = { dataset: { label: 'Topi' } };
  const dummy = {
    parentElement: container,
    dataset: { url: 'http://drive.com/1' },
    closest: s => (s === '.photo-card' && dummy.parentElement ? card : null)
  };
  Object.defineProperty(container, 'textContent', {
    set() { dummy.parentElement = null; this.child = null; }
  });
  const ctx = {
    state: { sessionToken: 't1' },
    callApi: async () => 'data:img',
    document: { createElement: () => ({ setAttribute(k, v) { this[k] = v; } }) },
    openLightbox: (src, label) => { opened = { src, label }; }
  };
  vm.createContext(ctx);
  vm.runInContext(functionBlock(scripts, 'async function loadImg('), ctx);
  await ctx.loadImg(dummy);
  const img = container.child;
  assert.strictEqual(img.src, 'data:img');
  assert.strictEqual(img.className, 'zoomable');
  assert.strictEqual(img.tabIndex, 0);
  assert.strictEqual(img.role, 'button');
  assert.strictEqual(img['aria-label'], 'Perbesar Topi');
  img.onclick();
  assert.deepStrictEqual(opened, { src: 'data:img', label: 'Topi' });
  opened = null;
  let p = false;
  img.onkeydown({ key: 'Enter', preventDefault: () => { p = true; } });
  assert.strictEqual(p, true);
  assert.deepStrictEqual(opened, { src: 'data:img', label: 'Topi' });
  opened = null;
  img.onkeydown({ key: ' ', preventDefault: () => {} });
  assert.deepStrictEqual(opened, { src: 'data:img', label: 'Topi' });

  console.log('JST-030 photo lightbox check passed.');
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
