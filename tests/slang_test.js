const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const slang = require('../extension/slang');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grimoire-slang-'));
const put = (rel, text = '') => {
  const file = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
};
put('design/core/rtl/core.sv');
put('design/cpu/vendor/ip/LICENSE');
put('design/cpu/vendor/ip/rtl/alu.sv');
put('design/sub/.git/HEAD');
put('design/sub/top.v');
put('output/bld/gen.sv');
put('docs/readme.md');
put('node_modules/pkg/x.sv');
put('.git/objects/y.sv');

assert.deepStrictEqual(slang.candidateExcludes(tmp), [
  { dir: './design', reason: undefined, picked: false },
  { dir: './design/cpu/vendor/ip', reason: 'has LICENSE', picked: true },
  { dir: './design/sub', reason: 'its own git repository', picked: true },
  { dir: './output', reason: 'build output', picked: true },
]);

const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'grimoire-slang-empty-'));
assert.deepStrictEqual(slang.candidateExcludes(empty), []);

assert.deepStrictEqual(slang.buildConfig(['./output']), { index: [{ dirs: ['.'], excludeDirs: ['./output'] }] });
assert.deepStrictEqual(slang.buildConfig([]), { index: [{ dirs: ['.'], excludeDirs: [] }] });

fs.rmSync(tmp, { recursive: true });
fs.rmSync(empty, { recursive: true });
console.log('slang tests passed');
