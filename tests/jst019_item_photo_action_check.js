const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const canonicalPath = path.join(rootDir, '03_Konfirmasi_Pembelian', 'Konfirmasi.html');
const deploymentPath = path.join(rootDir, '04_Backend_GAS', 'Konfirmasi.html');
const html = fs.readFileSync(canonicalPath, 'utf8');
const deploymentHtml = fs.readFileSync(deploymentPath, 'utf8');

assert.strictEqual(html, deploymentHtml, 'Canonical and deployment templates must match');

// 1. Parse complete inline JavaScript
const scriptText = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
new vm.Script(scriptText, { filename: 'Konfirmasi.html' });

// 2. Execute reset helper without browser dependencies
const helperMatch = scriptText.match(/function resetItemPhotoState\([\s\S]*?\n    \}/);
assert.ok(helperMatch, 'resetItemPhotoState helper exists');
const revoked = [];
const sandbox = {
  URL: { revokeObjectURL: url => revoked.push(url) }
};
vm.createContext(sandbox);
vm.runInContext(`${helperMatch[0]}; this.resetItemPhotoState = resetItemPhotoState;`, sandbox);

const fileInput = { value: 'C:\\fakepath\\photo-a.jpg' };
const removedAttrs = [];
const previewImg = {
  src: 'blob:photo-a',
  style: { display: 'block' },
  removeAttribute: name => { removedAttrs.push(name); previewImg.src = ''; }
};
const previewWrap = { style: { display: 'flex' } };

const nextUrl = sandbox.resetItemPhotoState(fileInput, previewImg, previewWrap, 'blob:photo-a');
assert.strictEqual(nextUrl, null);
assert.strictEqual(fileInput.value, '');
assert.deepStrictEqual(revoked, ['blob:photo-a']);
assert.deepStrictEqual(removedAttrs, ['src']);
assert.strictEqual(previewImg.src, '');
assert.strictEqual(previewImg.style.display, 'none');
assert.strictEqual(previewWrap.style.display, 'none');

// 3. Source-level interaction contract
assert.ok(html.includes('class="btn-clear-photo">Hapus Foto</button>'), 'Remove photo button exists');
assert.ok(html.includes("clearBtn.addEventListener('click', clearSelectedFile);"), 'Remove button resets selected file');
assert.ok(html.includes('currentObjectUrl = URL.createObjectURL(file);'), 'Selecting file creates preview URL');
assert.ok(/if \(currentObjectUrl\) \{\s*URL\.revokeObjectURL\(currentObjectUrl\);/.test(html), 'Replacing file revokes previous URL');
assert.ok(html.includes("if (helpExisting) helpExisting.style.display = '';"), 'Canceling new file restores existing-photo indicator');
assert.ok(html.includes("const existingUrl = row.dataset.existingUrl || '';"), 'Existing photo URL remains source of edit state');
assert.ok(html.includes('if(!file && !existingUrl) throw new Error(`Foto Barang ${i+1} wajib diupload.`);'), 'Submit rejects item without new or existing photo');

// No backend upload call from the file change/remove handlers
const addItemSection = scriptText.slice(scriptText.indexOf('function addItem'), scriptText.indexOf('function renumberItems'));
assert.ok(!addItemSection.includes('google.script.run'), 'Selecting/removing photo does not upload before submit');

console.log('JST-019 item photo action unit check passed.');
