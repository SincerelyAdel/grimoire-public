const fs = require('fs');
const path = require('path');

const FOLDER = 'snippets';
const EXT = '.snippet';
const cache = new Map();

function escape(body) {
  return body.replace(/(?<!\\)\$(?=[A-Za-z_])/g, '\\$');
}

function parse(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const end = lines.findIndex((line) => /^---\s*$/.test(line));
  const fields = {};
  const needs = [];
  for (const line of end < 0 ? [] : lines.slice(0, end)) {
    const m = /^(\w+)\s*:\s*(.*?)\s*$/.exec(line);
    if (m && m[1] === 'needs') {
      needs.push(m[2]);
    } else if (m) {
      fields[m[1]] = m[2];
    }
  }
  const body = (end < 0 ? lines : lines.slice(end + 1)).join('\n').replace(/\s+$/, '');
  return { page: fields.page, needs, body: escape(body) };
}

const squash = (text) => text.replace(/\s+/g, '');

function missing(text, needs) {
  const have = squash(text);
  return (needs || []).filter((line) => !have.includes(squash(line)));
}

function read(file) {
  let stamp;
  try {
    stamp = fs.statSync(file).mtimeMs;
  } catch (err) {
    return undefined;
  }
  const cached = cache.get(file);
  if (cached && cached.stamp === stamp) {
    return cached.snippet;
  }
  let snippet;
  try {
    snippet = parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    snippet = undefined;
  }
  cache.set(file, { stamp, snippet });
  return snippet;
}

function load(dirs) {
  const found = new Map();
  for (const dir of dirs) {
    const folder = path.join(dir, FOLDER);
    let names;
    try {
      names = fs.readdirSync(folder);
    } catch (err) {
      continue;
    }
    for (const file of names.sort()) {
      const name = file.slice(0, -EXT.length);
      if (!file.endsWith(EXT) || !name || found.has(name)) {
        continue;
      }
      const snippet = read(path.join(folder, file));
      if (snippet && snippet.body) {
        found.set(name, { name, ...snippet });
      }
    }
  }
  return [...found.values()];
}

function preview(body) {
  const defaults = {};
  body.replace(/\$\{(\d+):([^}]*)\}/g, (m, n, d) => {
    if (!(n in defaults)) {
      defaults[n] = d;
    }
  });
  body.replace(/\$\{(\d+)\|([^,|]*)/g, (m, n, d) => {
    if (!(n in defaults)) {
      defaults[n] = d;
    }
  });
  return body
    .replace(/\$\{(\d+):([^}]*)\}/g, (m, n, d) => d)
    .replace(/\$\{(\d+)\|([^|]*)\|\}/g, (m, n, choices) => choices.split(',')[0])
    .replace(/(?<!\\)\$\{(\d+)\}|(?<!\\)\$(\d+)/g, (m, a, b) => defaults[a || b] || '')
    .replace(/\\\$/g, '$')
    .replace(/\s+$/, '');
}

module.exports = { load, missing, parse, preview };
