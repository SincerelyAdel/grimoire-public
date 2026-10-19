const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const uvm = require('../extension/uvm');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grimoire-uvm-'));
const make = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'uvm_pkg.sv'), '');
  return dir;
};
const home = path.join(tmp, 'uvm-1.2');
const homeSrc = make(path.join(home, 'src'));
const custom = make(path.join(tmp, 'custom'));
const bundled = path.join(tmp, 'bundled');
const bundledSrc = make(path.join(bundled, 'src'));

// source accepts the UVM folder or its src folder
assert.strictEqual(uvm.source(home), homeSrc);
assert.strictEqual(uvm.source(custom), custom);
assert.strictEqual(uvm.source(path.join(tmp, 'nothing')), undefined);

// choose: setting, then UVM_HOME, then bundled; bad entries are reported and skipped
assert.deepStrictEqual(uvm.choose(custom, home, bundled), { dir: custom, from: 'setting', skipped: [] });
assert.deepStrictEqual(uvm.choose('', home, bundled), { dir: homeSrc, from: 'UVM_HOME', skipped: [] });
assert.deepStrictEqual(uvm.choose('', undefined, bundled), { dir: bundledSrc, from: 'bundled', skipped: [] });
const bad = uvm.choose(path.join(tmp, 'nothing'), undefined, bundled);
assert.strictEqual(bad.dir, bundledSrc);
assert.strictEqual(bad.skipped.length, 1);

// usesUvm and mentionsUvm
assert.ok(uvm.usesUvm('import uvm_pkg::*;'));
assert.ok(uvm.usesUvm('`include "uvm_macros.svh"'));
assert.ok(!uvm.usesUvm('module counter; endmodule'));
assert.ok(uvm.mentionsUvm({ flags: '+incdir+/opt/uvm-1.2/src' }));
assert.ok(uvm.mentionsUvm({ index: [{ dirs: ['/opt/UVM/src'] }] }));
assert.ok(!uvm.mentionsUvm({ flags: '-DSIM' }));
assert.ok(!uvm.mentionsUvm(undefined));

// wire: a fresh config indexes the workspace and UVM
assert.deepStrictEqual(uvm.wire(undefined, 'C:\\uvm\\src', undefined, true), {
  flags: '+incdir+C:/uvm/src',
  index: [{ dirs: ['.'] }, { dirs: ['C:/uvm/src'] }],
});
// wire keeps the user's own flags and index entries, and replaces only what it wrote before
const mine = { flags: '-DSIM +incdir+C:/old/src', index: [{ dirs: ['rtl'], excludeDirs: ['build'] }, { dirs: ['C:/old/src'] }] };
assert.deepStrictEqual(uvm.wire(mine, 'C:/new/src', 'C:\\old\\src', false), {
  flags: '-DSIM +incdir+C:/new/src',
  index: [{ dirs: ['rtl'], excludeDirs: ['build'] }, { dirs: ['C:/new/src'] }],
});
// wiring twice changes nothing
const once = uvm.wire(undefined, 'C:/uvm/src', undefined, true);
assert.deepStrictEqual(uvm.wire(once, 'C:/uvm/src', 'C:/uvm/src', true), once);

fs.rmSync(tmp, { recursive: true });
console.log('uvm tests passed');
