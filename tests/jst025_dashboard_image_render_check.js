const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.join(__dirname, '..');
const canonicalPath = path.join(rootDir, '02_Dashboard_Jastiper', 'Dashboard.html');
const deploymentPath = path.join(rootDir, '04_Backend_GAS', 'Dashboard.html');
const html = fs.readFileSync(canonicalPath, 'utf8');
const deploymentHtml = fs.readFileSync(deploymentPath, 'utf8');

assert.strictEqual(html, deploymentHtml, 'Canonical and deployment templates must match');

const scriptText = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]).join('\n');
new vm.Script(scriptText, { filename: 'Dashboard.html' });

const loadImgMatch = scriptText.match(/async function loadImg\(img\)\{[\s\S]*?\n  \}/);
assert.ok(loadImgMatch, 'loadImg helper exists');

async function runScenario(outcome) {
  const rpc = {};
  const createdImages = [];
  const sandbox = {
    state: { sessionToken: 'synthetic-session-token' },
    document: {
      createElement(tagName) {
        assert.strictEqual(tagName, 'img');
        const image = { parentElement: null, src: '' };
        createdImages.push(image);
        return image;
      }
    },
    callApi: async (action, request) => {
      rpc.action = action;
      rpc.request = request;
      if (outcome === 'failure') throw new Error('synthetic failure');
      return 'data:image/png;base64,c3ludGhldGlj';
    }
  };

  const container = {
    child: null,
    status: '',
    replaceChildren(child) {
      this.child = child;
      child.parentElement = this;
      this.status = '';
    }
  };
  Object.defineProperty(container, 'textContent', {
    get() { return this.status; },
    set(value) {
      this.status = value;
      if (this.child) this.child.parentElement = null;
      this.child = null;
    }
  });

  const originalImage = {
    parentElement: container,
    dataset: { url: 'synthetic-drive-url' }
  };
  container.child = originalImage;

  vm.createContext(sandbox);
  vm.runInContext(`${loadImgMatch[0]}; this.loadImg = loadImg;`, sandbox);
  await sandbox.loadImg(originalImage);

  assert.strictEqual(rpc.action, 'getJastiperImageData');
  assert.strictEqual(rpc.request.sessionToken, 'synthetic-session-token');
  assert.strictEqual(rpc.request.driveFileUrl, 'synthetic-drive-url');

  if (outcome === 'success') {
    assert.strictEqual(createdImages.length, 1);
    assert.strictEqual(container.child, createdImages[0]);
    assert.strictEqual(container.child.src, 'data:image/png;base64,c3ludGhldGlj');
  } else {
    assert.strictEqual(container.textContent, 'Gagal memuat');
    assert.strictEqual(createdImages.length, 0);
  }
}

async function main() {
  await runScenario('success');
  await runScenario('failure');
  console.log('JST-025 dashboard image render unit check passed.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
