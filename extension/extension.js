const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const report = require('./report');
const lookup = require('./lookup');

const SV_LANGUAGES = ['systemverilog', 'systemverilogheader', 'verilog', 'verilogheader'];
const SV_FOLDERS = ['sv', 'uvm'];
const TCL_FOLDERS = ['params'];
const BUNDLED = path.join(__dirname, 'library');
const TCL_FILES = /\.(tcl|def|sdc)$/i;
const GENERIC = 'superlint.';
const SOURCE = 'jasper';
const SOURCES = [SOURCE, 'superlint'];
const WORD = /[`$]?[A-Za-z_][A-Za-z0-9_$]*/;
const SEVERITY = {
  Fatal: vscode.DiagnosticSeverity.Error,
  Error: vscode.DiagnosticSeverity.Error,
  Warning: vscode.DiagnosticSeverity.Warning,
  Info: vscode.DiagnosticSeverity.Information,
  Note: vscode.DiagnosticSeverity.Information,
};

function config() {
  return vscode.workspace.getConfiguration('grimoire');
}

function folders(languageId, fileName = '') {
  const roots = [...(config().get('libraryPaths') || []), BUNDLED];
  const isSv = SV_LANGUAGES.includes(languageId);
  const isTcl = languageId === 'tcl' || TCL_FILES.test(fileName);
  const dirs = [];
  for (const root of roots) {
    let names;
    try {
      names = fs.readdirSync(root, { withFileTypes: true });
    } catch (err) {
      continue;
    }
    for (const e of names) {
      if (!e.isDirectory()) {
        continue;
      }
      if ((!isSv && SV_FOLDERS.includes(e.name)) || (!isTcl && TCL_FOLDERS.includes(e.name))) {
        continue;
      }
      dirs.push(path.join(root, e.name));
    }
  }
  return dirs;
}

function docFile(word, document) {
  return lookup.resolve(folders(document.languageId, document.fileName), word);
}

function readDoc(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (err) {
    return undefined;
  }
}

function provideHover(document, position) {
  const words = [];
  for (const d of vscode.languages.getDiagnostics(document.uri)) {
    if (SOURCES.includes(d.source) && d.range.contains(position) && d.code) {
      words.push(String(d.code.value || d.code));
    }
  }
  const range = document.getWordRangeAtPosition(position, WORD);
  if (range) {
    const owner = lookup.paramsOwner(document.lineAt(position.line).text, range.start.character);
    words.push(owner ? `${owner}.${document.getText(range)}` : document.getText(range));
  }
  const docs = [];
  for (const word of new Set(words)) {
    const file = docFile(word, document);
    const text = file && readDoc(file);
    if (text) {
      docs.push(new vscode.MarkdownString(text));
    }
  }
  return docs.length ? new vscode.Hover(docs) : undefined;
}

function provideCompletionItems(document, position) {
  const line = document.lineAt(position.line).text;
  const owner = lookup.paramsOwner(line, position.character);
  const prefix = owner ? owner + '.' : undefined;
  const items = [];
  for (const dir of folders(document.languageId, document.fileName)) {
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.md')) {
        continue;
      }
      const page = name.slice(0, -3);
      const own = prefix && (page.startsWith(prefix) || page.startsWith(GENERIC));
      if (prefix ? !own : page.includes('.')) {
        continue;
      }
      const text = readDoc(path.join(dir, name)) || '';
      const label = prefix ? page.slice(page.indexOf('.') + 1) : page;
      const item = new vscode.CompletionItem(label, prefix ? vscode.CompletionItemKind.Property : vscode.CompletionItemKind.EnumMember);
      const short = /\*\*Short Message:?\*\*:?\s*\*?([^*\n]+)/.exec(text);
      const title = /^\*\*`[^`]+`\*\* — (.+)/.exec(text);
      item.detail = short ? short[1].trim() : title ? title[1].trim() : path.basename(dir);
      item.documentation = new vscode.MarkdownString(text);
      items.push(item);
    }
  }
  return items;
}

async function refresh(collection, log) {
  collection.clear();
  const glob = config().get('reportGlob');
  if (!glob) {
    return;
  }
  const reports = await vscode.workspace.findFiles(glob);
  if (!reports.length) {
    return;
  }
  const sources = await vscode.workspace.findFiles('**/*.{sv,svh,v,vh,vhd,vhdl}');
  const files = sources.map((u) => u.fsPath);
  const index = report.indexModules(files);
  const byFile = new Map();
  const seen = new Set();
  let total = 0;
  let unplaced = 0;
  for (const uri of reports) {
    let rows;
    try {
      rows = report.readReport(uri.fsPath);
    } catch (err) {
      log.appendLine(`cannot read ${uri.fsPath}: ${err.message}`);
      continue;
    }
    const compiled = report.readCompileLog(uri.fsPath);
    for (const row of rows) {
      total++;
      const at = report.locate(row, index, uri.fsPath, compiled, files);
      if (!at) {
        unplaced++;
        log.appendLine(`no source for ${row['Module'] || row['Source Location']}: ${row['Tag']} ${row['Occurrence'] || ''}`);
        continue;
      }
      const message = report.describe(row);
      const key = [at.file, at.line, at.start, row['Tag'], message].join('|');
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(at.line, at.start, at.line, at.end),
        message,
        SEVERITY[row['Severity']] === undefined ? vscode.DiagnosticSeverity.Warning : SEVERITY[row['Severity']]
      );
      diagnostic.source = row.source || SOURCE;
      const doc = lookup.resolve(folders('systemverilog'), row['Tag']);
      diagnostic.code = doc ? { value: row['Tag'], target: vscode.Uri.file(doc) } : row['Tag'];
      if (!byFile.has(at.file)) {
        byFile.set(at.file, []);
      }
      byFile.get(at.file).push(diagnostic);
    }
  }
  for (const [file, diagnostics] of byFile) {
    collection.set(vscode.Uri.file(file), diagnostics);
  }
  log.appendLine(`${reports.length} report(s), ${total} violation(s), ${unplaced} without a source location`);
}

function activate(context) {
  const collection = vscode.languages.createDiagnosticCollection(SOURCE);
  const log = vscode.window.createOutputChannel('Grimoire');
  let timer;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => refresh(collection, log).catch((err) => log.appendLine(String(err))), 300);
  };
  let watcher;
  const watch = () => {
    if (watcher) {
      watcher.dispose();
    }
    const glob = config().get('reportGlob');
    if (!glob) {
      return;
    }
    watcher = vscode.workspace.createFileSystemWatcher(glob);
    watcher.onDidCreate(schedule);
    watcher.onDidChange(schedule);
    watcher.onDidDelete(schedule);
  };
  watch();
  schedule();
  context.subscriptions.push(
    collection,
    log,
    { dispose: () => watcher && watcher.dispose() },
    vscode.languages.registerHoverProvider({ scheme: 'file' }, { provideHover }),
    vscode.languages.registerCompletionItemProvider(
      [{ scheme: 'file', pattern: '**/*.{tcl,def}' }],
      { provideCompletionItems }
    ),
    vscode.commands.registerCommand('grimoire.reloadReports', schedule),
    vscode.workspace.onDidChangeWorkspaceFolders(schedule),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('grimoire')) {
        watch();
        schedule();
      }
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
