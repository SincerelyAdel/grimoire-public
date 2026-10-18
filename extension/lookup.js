const fs = require('fs');
const path = require('path');

const ALIASES = 'aliases.json';
const cache = new Map();
const listings = new Map();

function has(dir, file) {
  let stamp;
  try {
    stamp = fs.statSync(dir).mtimeMs;
  } catch (err) {
    return false;
  }
  let cached = listings.get(dir);
  if (!cached || cached.stamp !== stamp) {
    cached = { stamp, names: new Set(fs.readdirSync(dir)) };
    listings.set(dir, cached);
  }
  return cached.names.has(file);
}

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
  if (!/^[`$]?[\w$]+$/.test(word)) {
    return undefined;
  }
  const names = candidates(word);
  for (const name of names) {
    for (const dir of dirs) {
      if (has(dir, name + '.md')) {
        return path.join(dir, name + '.md');
      }
    }
  }
  for (const name of names) {
    for (const dir of dirs) {
      for (const rule of aliases(dir)) {
        if (!rule.pattern.test(name)) {
          continue;
        }
        if (has(dir, rule.page + '.md')) {
          return path.join(dir, rule.page + '.md');
        }
      }
    }
  }
  return undefined;
}

module.exports = { resolve, toRegExp };
