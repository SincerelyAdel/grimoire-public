const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const snippets = require('../extension/snippets');

const library = path.join(__dirname, '..', 'extension', 'library');
const dirs = ['sv', 'uvm'].map((name) => path.join(library, name));

const loaded = snippets.load(dirs);
const transaction = loaded.find((s) => s.name === 'transaction_uvm');
assert.ok(transaction, 'transaction_uvm is loaded');
assert.strictEqual(transaction.page, 'uvm_sequence_item');
assert.deepStrictEqual(transaction.needs, ['`include "uvm_macros.svh"', 'import uvm_pkg::*;']);
assert.deepStrictEqual(snippets.missing('module m; endmodule', transaction.needs), transaction.needs);
assert.deepStrictEqual(snippets.missing('package p;\n  import  uvm_pkg::* ;\n', transaction.needs), ['`include "uvm_macros.svh"']);
assert.deepStrictEqual(snippets.missing('`include "uvm_macros.svh"\nimport uvm_pkg::*;', transaction.needs), []);
assert.ok(transaction.body.includes('return \\$sformatf('));
assert.ok(transaction.body.startsWith('class ${1:example}_transaction extends uvm_sequence_item;'));

const shown = snippets.preview(transaction.body);
assert.ok(shown.startsWith('class example_transaction extends uvm_sequence_item;'));
assert.ok(shown.includes('`uvm_object_utils_begin(example_transaction)'));
assert.ok(shown.includes('function new(string name = "example_transaction");'));
assert.ok(shown.includes('return $sformatf('));
assert.ok(shown.endsWith('endclass'));
assert.ok(!/\$\{|\\\$/.test(shown));

assert.deepStrictEqual(snippets.parse('page: p\r\n---\r\n$display(${1:x});\r\n\r\n'), {
  page: 'p',
  needs: [],
  body: '\\$display(${1:x});',
});
assert.deepStrictEqual(snippets.parse('no header'), { page: undefined, needs: [], body: 'no header' });
assert.strictEqual(snippets.preview('${1|UVM_LOW,UVM_HIGH|} ${1} \\$time $0'), 'UVM_LOW UVM_LOW $time');

const own = fs.mkdtempSync(path.join(os.tmpdir(), 'grimoire-'));
fs.mkdirSync(path.join(own, 'snippets'));
fs.writeFileSync(path.join(own, 'snippets', 'transaction_uvm.snippet'), 'page: x\n---\nmine\n');
fs.writeFileSync(path.join(own, 'snippets', 'notes.txt'), 'ignored');
const mine = snippets.load([own, ...dirs]);
assert.strictEqual(mine.find((s) => s.name === 'transaction_uvm').body, 'mine');
assert.ok(!mine.some((s) => s.name === 'notes'));
fs.rmSync(own, { recursive: true });

console.log(`${loaded.length} snippet(s) loaded, all snippet checks passed`);
