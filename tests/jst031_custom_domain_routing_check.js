const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');

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

// 1. CNAME & 404 existence
const cname = fs.readFileSync(path.join(root, 'CNAME'), 'utf8').trim();
assert.strictEqual(cname, 'jastipin.my.id', 'CNAME must contain jastipin.my.id');

const custom404 = fs.readFileSync(path.join(root, '404.html'), 'utf8');
assert.ok(custom404.includes('window.location.replace'), '404.html must have redirect script');
const script404 = custom404.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script404, { filename: '404.html' });

// 2. 404 routing logic test
function test404Routing(pathname) {
  let redirected = null;
  const context = {
    window: {
      location: {
        pathname,
        search: '?token=PRIVATE',
        hash: '#PRIVATE',
        replace: target => { redirected = target; }
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(script404, context);
  return redirected;
}

assert.strictEqual(test404Routing('/dashboard'), '/dashboard.html', '/dashboard routes to /dashboard.html');
assert.strictEqual(test404Routing('/dashboard/'), '/dashboard.html', '/dashboard/ routes to /dashboard.html');
assert.strictEqual(test404Routing('/login'), '/login.html', '/login routes to /login.html');
assert.strictEqual(test404Routing('/login/'), '/login.html', '/login/ routes to /login.html');
assert.strictEqual(test404Routing('/unknown-page'), '/login', 'Unknown route redirects to /login');

// 3. Mirror verification & byte consistency
const loginSets = ['login.html', '01_Login_Signup/Login.html', '04_Backend_GAS/Login.html'].map(f => fs.readFileSync(path.join(root, f), 'utf8'));
assert.strictEqual(loginSets[0], loginSets[1], 'Login mirrors must match');
assert.strictEqual(loginSets[0], loginSets[2], 'Login mirrors must match');
assert.ok(loginSets[0].includes("window.location.hostname==='jastipin.my.id'?`/${route}`:`${route}.html`"), 'Login uses clean custom-domain routes with GAS fallback');

const dashSets = ['dashboard.html', '02_Dashboard_Jastiper/Dashboard.html', '04_Backend_GAS/Dashboard.html'].map(f => fs.readFileSync(path.join(root, f), 'utf8'));
assert.strictEqual(dashSets[0], dashSets[1], 'Dashboard mirrors must match');
assert.strictEqual(dashSets[0], dashSets[2], 'Dashboard mirrors must match');
assert.ok(dashSets[0].includes("window.location.hostname==='jastipin.my.id'?`/${route}`:`${route}.html`"), 'Dashboard uses clean custom-domain routes with GAS fallback');

// 3b. Test navigatePage in vm sandbox
function testNavigate(sourceHtml, page, hostname) {
  let navigated = null;
  const context = {
    window: {
      location: {
        hostname,
        replace: target => { navigated = target; }
      }
    }
  };
  const fnSource = functionBlock(sourceHtml, 'function navigatePage(');
  vm.createContext(context);
  vm.runInContext(fnSource, context);
  context.navigatePage(page);
  return navigated;
}

assert.strictEqual(testNavigate(loginSets[0], 'dashboard', 'jastipin.my.id'), '/dashboard', 'Custom domain navigates to /dashboard');
assert.strictEqual(testNavigate(loginSets[0], 'login', 'jastipin.my.id'), '/login', 'Custom domain navigates to /login');
assert.strictEqual(testNavigate(loginSets[0], 'dashboard', 'script.google.com'), 'dashboard.html', 'GAS fallback keeps dashboard.html');
assert.strictEqual(testNavigate(loginSets[0], 'login', 'script.google.com'), 'login.html', 'GAS fallback keeps login.html');
assert.strictEqual(testNavigate(dashSets[0], 'dashboard', 'jastipin.my.id'), '/dashboard', 'Custom domain navigates to /dashboard');
assert.strictEqual(testNavigate(dashSets[0], 'login', 'jastipin.my.id'), '/login', 'Custom domain navigates to /login');

const buyerSets = ['index.html', '03_Konfirmasi_Pembelian/Konfirmasi.html', '04_Backend_GAS/Konfirmasi.html'].map(f => fs.readFileSync(path.join(root, f), 'utf8'));
assert.strictEqual(buyerSets[0], buyerSets[1], 'Buyer mirrors must match');
assert.strictEqual(buyerSets[0], buyerSets[2], 'Buyer mirrors must match');

// 4. Index root redirect logic test
function testRootRedirect(pathname, search) {
  let redirected = null;
  const context = {
    window: {
      location: {
        pathname,
        search,
        replace: target => { redirected = target; }
      }
    }
  };
  const scriptMatch = buyerSets[0].match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.createContext(context);
  vm.runInContext(scriptMatch, context);
  return redirected;
}

assert.strictEqual(testRootRedirect('/', ''), '/login', 'Empty root redirects to /login');
assert.strictEqual(testRootRedirect('/', '?shop=TEST-SHOP'), null, 'Root with buyer shop query stays on buyer page');
assert.strictEqual(testRootRedirect('/', '?id=ORD-1&token=TOK-1'), null, 'Root with buyer edit query stays on buyer page');
assert.ok(buyerSets[0].includes("if(location.pathname === '/' && !location.search) return;"), 'Empty root must stop buyer boot before API call');

console.log('JST-031 custom domain and clean routing check passed.');
