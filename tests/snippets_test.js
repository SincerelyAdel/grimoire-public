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
assert.deepStrictEqual(transaction.needs, []);
const uvmNeeds = ['`include "uvm_macros.svh"', 'import uvm_pkg::*;'];
assert.deepStrictEqual(snippets.missing('module m; endmodule', uvmNeeds), uvmNeeds);
assert.deepStrictEqual(snippets.missing('package p;\n  import  uvm_pkg::* ;\n', uvmNeeds), ['`include "uvm_macros.svh"']);
assert.deepStrictEqual(snippets.missing('`include "uvm_macros.svh"\nimport uvm_pkg::*;', uvmNeeds), []);
assert.ok(transaction.body.includes('return \\$sformatf('));
assert.ok(transaction.body.startsWith('class ${1:example}_transaction extends uvm_sequence_item;'));

const shown = snippets.preview(transaction.body);
assert.ok(shown.startsWith('class example_transaction extends uvm_sequence_item;'));
assert.ok(shown.includes('`uvm_object_utils_begin(example_transaction)'));
assert.ok(shown.includes('function new(string name = "example_transaction");'));
assert.ok(shown.includes('return $sformatf('));
assert.ok(shown.endsWith('endclass'));
assert.ok(!/\$\{|\\\$/.test(shown));

const sequence = loaded.find((s) => s.name === 'wr_sequence_uvm');
assert.ok(sequence, 'wr_sequence_uvm is loaded');
assert.strictEqual(sequence.page, 'uvm_sequence');
assert.deepStrictEqual(sequence.notes.map((n) => snippets.preview(n, sequence.body)), [
  'the example_transaction snippet, with a delay field',
]);
const sequenceShown = snippets.preview(sequence.body);
assert.ok(sequenceShown.startsWith('class example_wr_seq extends uvm_sequence #(example_transaction);'));
assert.ok(sequenceShown.includes('constraint max_delay_c { max_delay inside {[0:3]}; }'));
assert.ok(sequenceShown.includes('if (!item.randomize() with { delay <= local::max_delay; })'));
assert.ok(sequenceShown.includes('return $sformatf("num_items=%0d max_delay=%0d", num_items, max_delay);'));
assert.ok(!/\$\{|\\\$/.test(sequenceShown));

const lookup = require('../extension/lookup');
const expected = ['env_uvm', 'if_uvm', 'pkg_uvm', 'rd_agent_uvm', 'rd_driver_uvm', 'rd_monitor_uvm', 'rd_sequence_uvm',
  'scoreboard_uvm', 'sequencer_uvm', 'transaction_uvm', 'wr_agent_uvm', 'wr_driver_uvm', 'wr_monitor_uvm', 'wr_sequence_uvm'];
assert.deepStrictEqual(loaded.map((s) => s.name).sort(), expected);
for (const snippet of loaded) {
  assert.ok(lookup.resolve(dirs, snippet.page), `${snippet.name}: page ${snippet.page} exists`);
  assert.ok(snippet.body.includes('${1:example}'), `${snippet.name}: example placeholder`);
  const text = snippets.preview(snippet.body);
  assert.ok(!/\$\{|\\\$/.test(text), `${snippet.name}: preview has no snippet syntax left`);
  assert.ok(!/fifo/.test(text), `${snippet.name}: no fifo left over`);
  for (const note of snippet.notes) {
    assert.ok(!/\$\{/.test(snippets.preview(note, snippet.body)), `${snippet.name}: note placeholders filled`);
  }
}
assert.ok(snippets.preview(loaded.find((s) => s.name === 'wr_agent_uvm').body).startsWith('class example_wr_agent extends uvm_agent;'));
assert.ok(snippets.preview(loaded.find((s) => s.name === 'env_uvm').body).includes('example_rd_agent   rd_agent;'));
assert.ok(snippets.preview(loaded.find((s) => s.name === 'scoreboard_uvm').body).includes('    logic [7:0] model [$];'));
const shownOf = (name) => snippets.preview(loaded.find((s) => s.name === name).body);
assert.ok(shownOf('rd_driver_uvm').startsWith('class example_rd_driver extends uvm_driver #(example_transaction);'));
assert.ok(!shownOf('rd_driver_uvm').includes('rd_data'));
assert.ok(shownOf('wr_driver_uvm').includes('vif.wr_drv_cb.wr_data <= req.data;'));
assert.ok(shownOf('rd_monitor_uvm').includes('item.accepted = !vif.rd_mon_cb.empty;'));
assert.ok(shownOf('wr_monitor_uvm').includes('item.accepted = !vif.wr_mon_cb.full;'));
assert.ok(shownOf('rd_agent_uvm').includes('example_rd_monitor mon;'));
assert.ok(shownOf('rd_sequence_uvm').includes('"read item randomization failed"'));
assert.ok(shownOf('wr_sequence_uvm').includes('"write item randomization failed"'));

assert.deepStrictEqual(snippets.parse('page: p\r\n---\r\n$display(${1:x});\r\n\r\n'), {
  page: 'p',
  needs: [],
  notes: [],
  body: '\\$display(${1:x});',
});
assert.deepStrictEqual(snippets.parse('no header'), { page: undefined, needs: [], notes: [], body: 'no header' });
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
