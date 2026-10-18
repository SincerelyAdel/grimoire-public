const fs = require('fs');
const path = require('path');

const ALIASES = 'aliases.json';
const PARAMS = /\bparams\s+([A-Z][A-Z0-9_]*)\s*\{([^}]*)/g;
const cache = new Map();

function toRegExp(glob) {
  const body = glob
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp('^' + body + '$');
}

function aliases(dir) {
  const file = path.join(dir, ALIASES);
  let stamp;
  try {
    stamp = fs.statSync(file).mtimeMs;
  } catch (err) {
    return [];
  }
  const cached = cache.get(file);
  if (cached && cached.stamp === stamp) {
    return cached.rules;
  }
  let rules = [];
  try {
    rules = Object.entries(JSON.parse(fs.readFileSync(file, 'utf8'))).map(([glob, page]) => ({
      pattern: toRegExp(glob),
      page,
    }));
  } catch (err) {
    rules = [];
  }
  cache.set(file, { stamp, rules });
  return rules;
}

function candidates(word) {
  return /^[`$]/.test(word) ? [word, word.slice(1)] : [word];
}

function resolve(dirs, word) {
  if (!/^[`$]?[\w$]+(\.\w+)?$/.test(word)) {
    return undefined;
  }
  const names = candidates(word);
  for (const name of names) {
    for (const dir of dirs) {
      const file = path.join(dir, name + '.md');
      if (fs.existsSync(file)) {
        return file;
      }
    }
  }
  for (const name of names) {
    for (const dir of dirs) {
      for (const rule of aliases(dir)) {
        if (!rule.pattern.test(name)) {
          continue;
        }
        const file = path.join(dir, rule.page + '.md');
        if (fs.existsSync(file)) {
          return file;
        }
      }
    }
  }
  return undefined;
}

function paramsOwner(line, column) {
  for (const match of line.matchAll(PARAMS)) {
    const start = match.index + match[0].length - match[2].length;
    if (column >= start && column <= start + match[2].length) {
      return match[1];
    }
  }
  return undefined;
}

module.exports = { resolve, toRegExp, paramsOwner };
