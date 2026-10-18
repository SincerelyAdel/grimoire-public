const fs = require('fs');
const path = require('path');

const SUPERLINT = 'superlint';

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (ch !== '\r') {
      cell += ch;
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function readSuperlint(rows) {
  const out = [];
  let header = null;
  for (const r of rows) {
    if (r.includes('Tag') && r.includes('Source Location')) {
      header = r;
    } else if (header && r.length === header.length) {
      const row = Object.fromEntries(header.map((name, i) => [name, r[i] || '']));
      row.source = SUPERLINT;
      out.push(row);
    } else if (r.some((c) => c !== '')) {
      header = null;
    }
  }
  return out;
}

function readReport(file) {
  const text = fs.readFileSync(file, 'utf8');
  const rows = parseCsv(text);
  if (/^Title:.*Superlint/.test(text)) {
    return readSuperlint(rows);
  }
  const header = rows.shift() || [];
  return rows
    .filter((r) => r.some((c) => c !== ''))
    .map((r) => Object.fromEntries(header.map((name, i) => [name, r[i] || ''])));
}

function indexModules(files) {
  const index = new Map();
  for (const file of files) {
    let lines;
    try {
      lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    } catch (err) {
      continue;
    }
    let open = null;
    lines.forEach((text, n) => {
      const m = /^\s*(?:macro)?module\s+(?:automatic\s+|static\s+)?([A-Za-z_][\w$]*)/.exec(text);
      if (m) {
        open = { file, name: m[1], line: n, end: lines.length - 1, lines };
        if (!index.has(m[1])) {
          index.set(m[1], []);
        }
        index.get(m[1]).push(open);
      } else if (open && /^\s*endmodule\b/.test(text)) {
        open.end = n;
        open = null;
      }
    });
  }
  return index;
}

function tokens(p) {
  return new Set(p.split(/[\\/.]+/).filter(Boolean));
}

function readCompileLog(reportPath) {
  const compiled = new Map();
  const dir = path.dirname(reportPath);
  for (const log of [path.join(dir, '..', 'jg.log'), path.join(dir, 'jg.log')]) {
    let text;
    try {
      text = fs.readFileSync(log, 'utf8');
    } catch (err) {
      continue;
    }
    const re = /^\[INFO \(VERI-1018\)\] (.+)\(\d+\): compiling module '([^']+)'/gm;
    let m;
    while ((m = re.exec(text))) {
      compiled.set(m[2].split(':')[0], m[1]);
    }
    break;
  }
  return compiled;
}

function pickModule(candidates, reportPath, logged) {
  if (!candidates || !candidates.length) {
    return null;
  }
  if (logged) {
    const suffix = path.sep + logged.split(/[\\/]+/).filter((p) => p !== '..' && p !== '.' && p !== '').join(path.sep);
    const matched = candidates.filter((c) => c.file.endsWith(suffix));
    if (matched.length) {
      candidates = matched;
    }
  }
  const want = tokens(reportPath);
  let best = candidates[0];
  let bestScore = -1;
  for (const c of candidates) {
    let score = 0;
    for (const t of tokens(c.file)) {
      if (want.has(t)) {
        score++;
      }
    }
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  return best;
}

function leafOf(row) {
  const unit = row['Destination Unit'] || row['Source Unit'] || row['Occurrence'] || '';
  const first = unit.trim().split(/\s+/)[0] || '';
  return first.split('-').pop().split('.').pop().replace(/\[.*$/, '');
}

function findWord(text, word, from) {
  const re = new RegExp('(?<![\\w$.`])' + word.replace(/[$]/g, '\\$') + '(?![\\w$])', 'g');
  re.lastIndex = from || 0;
  const m = re.exec(text);
  return m ? m.index : -1;
}

function pickFile(name, files, reportPath) {
  if (path.isAbsolute(name) && fs.existsSync(name)) {
    return name;
  }
  const suffix = path.sep + name.split(/[\\/]+/).filter((p) => p !== '..' && p !== '.' && p !== '').join(path.sep);
  const want = tokens(reportPath);
  let best = null;
  let bestScore = -1;
  for (const file of files) {
    if (!file.endsWith(suffix)) {
      continue;
    }
    let score = 0;
    for (const t of tokens(file)) {
      if (want.has(t)) {
        score++;
      }
    }
    if (score > bestScore) {
      best = file;
      bestScore = score;
    }
  }
  return best;
}

function locateLine(row, files, reportPath) {
  const m = /^\s*(.+?)\s*:\s*(\d+)\s*$/.exec(row['Source Location'] || '');
  if (!m) {
    return null;
  }
  const file = pickFile(m[1], files, reportPath);
  if (!file) {
    return null;
  }
  let lines;
  try {
    lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  } catch (err) {
    return null;
  }
  const line = Math.min(Math.max(Number(m[2]) - 1, 0), lines.length - 1);
  const code = lines[line].replace(/\/\/.*$/, '');
  for (const quoted of (row['Message'] || '').match(/'[^']+'/g) || []) {
    const leaf = quoted.slice(1, -1).split('.').pop().replace(/\[.*$/, '');
    if (!/^[A-Za-z_][\w$]*$/.test(leaf)) {
      continue;
    }
    const col = findWord(code, leaf, 0);
    if (col >= 0) {
      return { file, line, start: col, end: col + leaf.length };
    }
  }
  const start = code.length - code.trimStart().length;
  return { file, line, start, end: Math.max(code.trimEnd().length, start + 1) };
}

function locate(row, index, reportPath, compiled, files) {
  if (row.source === SUPERLINT) {
    return locateLine(row, files || [], reportPath);
  }
  const logged = compiled && compiled.get(row['Module']);
  const mod = pickModule(index.get(row['Module']), reportPath, logged);
  if (!mod) {
    return null;
  }
  const leaf = leafOf(row);
  const header = mod.lines[mod.line];
  const fallback = {
    file: mod.file,
    line: mod.line,
    start: header.indexOf(mod.name),
    end: header.indexOf(mod.name) + mod.name.length,
  };
  if (!/^[A-Za-z_][\w$]*$/.test(leaf)) {
    return fallback;
  }
  let first = null;
  for (let n = mod.line; n <= mod.end; n++) {
    const code = mod.lines[n].replace(/\/\/.*$/, '');
    const col = findWord(code, leaf, n === mod.line ? fallback.end : 0);
    if (col < 0) {
      continue;
    }
    const hit = { file: mod.file, line: n, start: col, end: col + leaf.length };
    if (/^\s*(\[[^\]]*\]\s*)*(<=|=(?!=))/.test(code.slice(hit.end))) {
      return hit;
    }
    first = first || hit;
  }
  return first || fallback;
}

function describe(row) {
  if (row.source === SUPERLINT) {
    return row['Message'].trim();
  }
  let text = `${row['Check']}: ${row['Occurrence']}`;
  if (row['Severity'] === 'Fatal') {
    text = `Fatal: ${text}`;
  }
  if (row['Instance'] && row['Instance'] !== row['Module']) {
    text += ` (instance ${row['Instance']})`;
  }
  if (row['Failure Reason']) {
    text += ` — ${row['Failure Reason']}`;
  }
  return text;
}

module.exports = { parseCsv, readReport, readCompileLog, indexModules, locate, describe, leafOf };
