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

const loadImgMatch = scriptText.match(/function loadImg\(img\)\{[\s\S]*?\n  \}/);
assert.ok(loadImgMatch, 'loadImg helper exists');

function runScenario(outcome) {
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
    google: {
      script: {
        run: {
          withSuccessHandler(handler) {
            rpc.success = handler;
            return this;
          },
          withFailureHandler(handler) {
            rpc.failure = handler;
            return this;
          },
          getJastiperImageData(token, url) {
            rpc.token = token;
            rpc.url = url;
          }
        }
      }
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
  sandbox.loadImg(originalImage);

  assert.strictEqual(container.textContent, 'Memuat…');
  assert.strictEqual(rpc.token, 'synthetic-session-token');
  assert.strictEqual(rpc.url, 'synthetic-drive-url');

  if (outcome === 'success') {
    assert.doesNotThrow(() => rpc.success('data:image/png;base64,c3ludGhldGlj'));
    assert.strictEqual(createdImages.length, 1);
    assert.strictEqual(container.child, createdImages[0]);
    assert.strictEqual(container.child.src, 'data:image/png;base64,c3ludGhldGlj');
  } else {
    assert.doesNotThrow(() => rpc.failure(new Error('synthetic failure')));
    assert.strictEqual(container.textContent, 'Gagal memuat');
    assert.strictEqual(createdImages.length, 0);
  }
}

runScenario('success');
runScenario('failure');

console.log('JST-025 dashboard image render unit check passed.');
