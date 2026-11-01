const fs = require('fs');
const path = require('path');

const SV_FILE = /\.(sv|svh|v|vh)$/i;
const SKIP = new Set(['.git', '.slang', 'node_modules']);
const BUILD = new Set(['output', 'out', 'build', 'work', 'sim_build', 'xcelium.d', 'INCA_libs', 'csrc', 'simv.daidir']);
const VENDOR_MARK = /^(license|licence|copying)(\.|$)/i;
const MAX_DEPTH = 8;

function entries(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return [];
  }
}

function hasSv(dir, depth = 0) {
  if (depth > MAX_DEPTH) {
    return false;
  }
  return entries(dir).some((e) =>
    e.isDirectory() ? !SKIP.has(e.name) && hasSv(path.join(dir, e.name), depth + 1) : SV_FILE.test(e.name)
  );
}

function vendorReason(dir) {
  const names = entries(dir).map((e) => e.name);
  if (names.includes('.git')) {
    return 'its own git repository';
  }
  const mark = names.find((n) => VENDOR_MARK.test(n));
  return mark ? `has ${mark}` : undefined;
}

function candidateExcludes(root) {
  const found = [];
  const walk = (dir, depth) => {
    for (const e of entries(dir)) {
      if (!e.isDirectory() || SKIP.has(e.name)) {
        continue;
      }
      const full = path.join(dir, e.name);
      if (!hasSv(full)) {
        continue;
      }
      const rel = './' + path.relative(root, full).split(path.sep).join('/');
      const reason = BUILD.has(e.name) ? 'build output' : vendorReason(full);
      if (reason || depth === 0) {
        found.push({ dir: rel, reason, picked: Boolean(reason) });
      }
      if (!reason && depth < MAX_DEPTH) {
        walk(full, depth + 1);
      }
    }
  };
  walk(root, 0);
  return found.sort((a, b) => a.dir.localeCompare(b.dir));
}

function buildConfig(excludes) {
  return { index: [{ dirs: ['.'], excludeDirs: [...excludes] }] };
}

module.exports = { buildConfig, candidateExcludes };
