const fs = require('fs');
const path = require('path');

const slash = (p) => p.replace(/\\/g, '/').replace(/\/+$/, '');

// The folder holding uvm_pkg.sv: the folder itself or its src subfolder.
function source(dir) {
  if (!dir) {
    return undefined;
  }
  for (const d of [path.join(dir, 'src'), dir]) {
    if (fs.existsSync(path.join(d, 'uvm_pkg.sv'))) {
      return d;
    }
  }
  return undefined;
}

// Where slang should find UVM: the uvmPath setting, then UVM_HOME, then the copy bundled with Grimoire.
function choose(setting, uvmHome, bundled) {
  const skipped = [];
  for (const [from, dir] of [['setting', setting], ['UVM_HOME', uvmHome]]) {
    if (!dir) {
      continue;
    }
    const src = source(dir);
    if (src) {
      return { dir: src, from, skipped };
    }
    skipped.push(`${from} (${dir}) has no uvm_pkg.sv`);
  }
  return { dir: source(bundled), from: 'bundled', skipped };
}

// True when slang's own configuration already points at a UVM library.
function mentionsUvm(config) {
  const flags = (config && config.flags) || '';
  const dirs = ((config && config.index) || []).flatMap((e) => e.dirs || []);
  return /\+incdir\+\S*uvm/i.test(flags) || dirs.some((d) => /uvm/i.test(d));
}

// Add the UVM include path and index folder to a slang config, replacing the ones Grimoire wrote before.
// keepWorkspace: also index the workspace itself, for configs that would otherwise index only UVM.
function wire(config, dir, previous, keepWorkspace) {
  const out = { ...(config || {}) };
  const old = previous && slash(previous);
  const flag = `+incdir+${slash(dir)}`;
  const flags = (out.flags || '').split(/\s+/).filter((t) => t && (!old || t !== `+incdir+${old}`));
  if (!flags.includes(flag)) {
    flags.push(flag);
  }
  out.flags = flags.join(' ');
  const index = (Array.isArray(out.index) ? out.index : [])
    .map((e) => ({ ...e, dirs: (e.dirs || []).filter((d) => !old || slash(d) !== old) }))
    .filter((e) => e.dirs.length);
  if (keepWorkspace && !index.some((e) => e.dirs.includes('.'))) {
    index.unshift({ dirs: ['.'] });
  }
  if (!index.some((e) => e.dirs.some((d) => slash(d) === slash(dir)))) {
    index.push({ dirs: [slash(dir)] });
  }
  out.index = index;
  return out;
}

const UVM_USE = /\buvm_pkg\b|uvm_macros\.svh/;

function usesUvm(text) {
  return UVM_USE.test(text);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return undefined;
  }
}

module.exports = { choose, mentionsUvm, readJson, source, usesUvm, wire };
