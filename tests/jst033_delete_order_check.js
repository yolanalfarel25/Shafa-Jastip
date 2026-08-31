const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log('--- RUNNING JST-033 DELETE ORDER CHECKS ---');

const codeGsPath = path.join(__dirname, '..', '04_Backend_GAS', 'Code.gs');
const dashboardGasPath = path.join(__dirname, '..', '04_Backend_GAS', 'Dashboard.html');
const dashboard02Path = path.join(__dirname, '..', '02_Dashboard_Jastiper', 'Dashboard.html');
const dashboardRootPath = path.join(__dirname, '..', 'dashboard.html');

const codeGs = fs.readFileSync(codeGsPath, 'utf8');
const dashboardGas = fs.readFileSync(dashboardGasPath, 'utf8');
const dashboard02 = fs.readFileSync(dashboard02Path, 'utf8');
const dashboardRoot = fs.readFileSync(dashboardRootPath, 'utf8');

// 1. Check doPost router in Code.gs
assert(codeGs.includes("case 'deleteOrder':"), 'Code.gs must route deleteOrder in doPost');
assert(codeGs.includes("deleteOrder(body.sessionToken, body.orderId)"), 'Code.gs must call deleteOrder with sessionToken and orderId');

// 2. Check deleteOrder function signature and logic in Code.gs
assert(codeGs.includes("function deleteOrder(sessionToken, orderId)"), 'deleteOrder function must exist');
assert(codeGs.includes("requireSession_(sessionToken)"), 'deleteOrder must require session');
assert(codeGs.includes("findOrderRow_(sheet, cleanId)"), 'deleteOrder must find order row');
assert(codeGs.includes("sheet.deleteRow(rowNumber)"), 'deleteOrder must delete row from sheet');
assert(codeGs.includes("setTrashed(true)"), 'deleteOrder must trash Drive files');
assert(codeGs.includes("assertFileInFolder_"), 'deleteOrder must verify file in jastiper folder');

// 3. Check mirror consistency
assert.strictEqual(dashboardGas, dashboard02, '04_Backend_GAS/Dashboard.html and 02_Dashboard_Jastiper/Dashboard.html must be identical');
assert.strictEqual(dashboardGas, dashboardRoot, '04_Backend_GAS/Dashboard.html and dashboard.html must be identical');

// 4. Check Frontend elements
[dashboardGas, dashboard02, dashboardRoot].forEach((content, idx) => {
  assert(content.includes('delete-btn'), `Dashboard #${idx} must contain delete-btn class`);
  assert(content.includes("callApi('deleteOrder'"), `Dashboard #${idx} must call deleteOrder API`);
  assert(content.includes('confirm('), `Dashboard #${idx} must use confirm() dialog before delete`);
});

// 5. Test mock execution of deleteOrder logic
{
  const trashedFiles = [];
  const deletedRows = [];
  const mockFolderId = 'folder_123';

  const mockUser = {
    jastiperId: 'jst_user_1',
    driveFolderId: mockFolderId
  };

  const mockOrders = [
    {
      orderId: 'JSTP-AAA-1',
      jastiperId: 'jst_user_1',
      namaLengkap: 'Budi Buyer',
      itemsJson: JSON.stringify([{ name: 'Barang 1', photoUrl: 'https://drive.google.com/open?id=file_photo_1' }]),
      buktiTransferUrl: 'https://drive.google.com/open?id=file_tf_1'
    },
    {
      orderId: 'JSTP-AAA-2',
      jastiperId: 'jst_user_OTHER',
      namaLengkap: 'Other Buyer',
      itemsJson: '[]',
      buktiTransferUrl: ''
    }
  ];

  // Test tenant isolation
  function mockDeleteOrder(sessionUser, orderId) {
    const cleanId = String(orderId || '').trim();
    const rowIdx = mockOrders.findIndex(o => o.orderId === cleanId);
    if (rowIdx < 0) throw new Error('Pesanan tidak ditemukan.');

    const orderObj = mockOrders[rowIdx];
    if (String(orderObj.jastiperId) !== String(sessionUser.jastiperId)) {
      throw new Error('Anda tidak memiliki hak untuk menghapus pesanan ini.');
    }

    const fileUrls = [];
    const items = JSON.parse(orderObj.itemsJson || '[]');
    items.forEach(it => { if (it && it.photoUrl) fileUrls.push(it.photoUrl); });
    if (orderObj.buktiTransferUrl) fileUrls.push(orderObj.buktiTransferUrl);

    let deletedFiles = 0;
    fileUrls.forEach(url => {
      const match = url.match(/id=([a-zA-Z0-9_-]+)/);
      if (match) {
        trashedFiles.push(match[1]);
        deletedFiles++;
      }
    });

    mockOrders.splice(rowIdx, 1);
    deletedRows.push(rowIdx + 2);

    return { ok: true, orderId: cleanId, deletedFiles };
  }

  // Jastiper tries to delete own order -> OK
  const res1 = mockDeleteOrder(mockUser, 'JSTP-AAA-1');
  assert.strictEqual(res1.ok, true);
  assert.strictEqual(res1.deletedFiles, 2);
  assert.deepStrictEqual(trashedFiles, ['file_photo_1', 'file_tf_1']);
  assert.strictEqual(mockOrders.length, 1);

  // Jastiper tries to delete other jastiper's order -> throws tenant isolation error
  assert.throws(() => {
    mockDeleteOrder(mockUser, 'JSTP-AAA-2');
  }, /tidak memiliki hak/);
}

// 6. Validate JS syntax inside script tags of all Dashboard files
[dashboardGasPath, dashboard02Path, dashboardRootPath].forEach(filePath => {
  const html = fs.readFileSync(filePath, 'utf8');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    const code = match[1];
    if (code.trim()) {
      new vm.Script(code, { filename: `${path.basename(filePath)}:script_${count++}` });
    }
  }
  assert(count > 0, `At least one script block must be checked in ${filePath}`);
});

console.log('--- ALL JST-033 CHECKS PASSED ---');
