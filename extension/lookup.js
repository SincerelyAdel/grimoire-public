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

// A page is <name>/<name>.md, or a flat <name>.md in older libraries.
function page(dir, name) {
  const folder = path.join(dir, name);
  if (has(folder, name + '.md')) {
    return path.join(folder, name + '.md');
  }
  if (has(dir, name + '.md')) {
    return path.join(dir, name + '.md');
  }
  return undefined;
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
      const file = page(dir, name);
      if (file) {
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
        const file = page(dir, rule.page);
        if (file) {
          return file;
        }
      }
    }
  }
  return undefined;
}

const IMAGE = /(!\[[^\]]*\]\(|<img\b[^>]*\bsrc=["'])([^)"'\s]+)/g;

// Point each image at its <name>.<theme>.<ext> file when the page's folder has one.
function themed(text, dir, theme) {
  return text.replace(IMAGE, (match, lead, src) => {
    const dot = src.lastIndexOf('.');
    if (/^[a-z]+:/i.test(src) || src.includes('/') || dot <= 0) {
      return match;
    }
    const variant = src.slice(0, dot) + '.' + theme + src.slice(dot);
    return has(dir, variant) ? lead + variant : match;
  });
}

// Split a page at its --- lines, outside code fences, into separate hover sections.
function sections(text) {
  const parts = [[]];
  let fenced = false;
  for (const line of text.split('\n')) {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
    }
    if (!fenced && /^---\s*$/.test(line)) {
      parts.push([]);
    } else {
      parts[parts.length - 1].push(line);
    }
  }
  return parts.map((lines) => lines.join('\n').trim()).filter(Boolean);
}

module.exports = { resolve, sections, themed, toRegExp };
