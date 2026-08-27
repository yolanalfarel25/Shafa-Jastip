'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, '03_Konfirmasi_Pembelian', 'Konfirmasi.html');
const deploymentPath = path.join(root, '04_Backend_GAS', 'Konfirmasi.html');
const assetPath = path.join(root, 'assets', 'logo-jastip-apps.png');
const expectedHash = '1904387888d5a1a4c5672429d4db3b6167a821b630ee431ddb4ffa148c8e55ab';
const source = fs.readFileSync(sourcePath, 'utf8');
const deployment = fs.readFileSync(deploymentPath, 'utf8');
const asset = fs.readFileSync(assetPath);

assert.strictEqual(source, deployment, 'Template deployment Konfirmasi harus identik dengan source kanonik.');
assert(!source.includes('../assets/logo-jastip-apps.png'), 'Logo Konfirmasi tidak boleh memakai path aset relatif.');

const match = source.match(/<div class="logo"><img src="data:image\/png;base64,([A-Za-z0-9+/]+={0,2})" alt="Logo Jastip Apps"><\/div>/);
assert(match, 'Logo Konfirmasi harus berupa data URI PNG inline.');
assert.strictEqual(match[1].length % 4, 0, 'Payload logo harus berupa base64 valid.');

const embedded = Buffer.from(match[1], 'base64');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
assert.strictEqual(hash(asset), expectedHash, 'Hash aset logo resmi berubah.');
assert.strictEqual(hash(embedded), expectedHash, 'Logo inline tidak cocok dengan aset resmi.');

console.log('JST-021 confirmation logo check passed.');
