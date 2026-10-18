const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const lookup = require('./lookup');

const SV_LANGUAGES = ['systemverilog', 'systemverilogheader', 'verilog', 'verilogheader'];
const SV_FOLDERS = ['sv', 'uvm'];
const BUNDLED = path.join(__dirname, 'library');
const WORD = /[`$]?[A-Za-z_][A-Za-z0-9_$]*/;

function config() {
  return vscode.workspace.getConfiguration('grimoire');
}

function folders(languageId) {
  const roots = [...(config().get('libraryPaths') || []), BUNDLED];
  const isSv = SV_LANGUAGES.includes(languageId);
  const dirs = [];
  for (const root of roots) {
    let names;
    try {
      names = fs.readdirSync(root, { withFileTypes: true });
    } catch (err) {
      continue;
    }
    for (const e of names) {
      if (e.isDirectory() && (isSv || !SV_FOLDERS.includes(e.name))) {
        dirs.push(path.join(root, e.name));
      }
    }
  }
  return dirs;
}

function provideHover(document, position) {
  const range = document.getWordRangeAtPosition(position, WORD);
  if (!range) {
    return undefined;
  }
  const file = lookup.resolve(folders(document.languageId), document.getText(range));
  if (!file) {
    return undefined;
  }
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (err) {
    return undefined;
  }
  return new vscode.Hover(new vscode.MarkdownString(text), range);
}

function activate(context) {
  context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file' }, { provideHover }));
}

function deactivate() {}

module.exports = { activate, deactivate };
