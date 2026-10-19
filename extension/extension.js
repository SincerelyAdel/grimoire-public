const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const lookup = require('./lookup');

const SV_LANGUAGES = ['systemverilog', 'systemverilogheader', 'verilog', 'verilogheader'];
const SV_FOLDERS = ['sv', 'uvm'];
const BUNDLED = path.join(__dirname, 'library');
const WORD = /[`$]?[A-Za-z_][A-Za-z0-9_$]*/;
// Hovers draw --- flush against its neighbours, so give it an empty line on each side.
const SEPARATOR = '\n\n<br>\n\n---\n\n<br>\n\n';

function config() {
  return vscode.workspace.getConfiguration('grimoire');
}

function theme() {
  const kind = vscode.window.activeColorTheme.kind;
  return kind === vscode.ColorThemeKind.Light || kind === vscode.ColorThemeKind.HighContrastLight ? 'light' : 'dark';
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
  const dir = path.dirname(file);
  const md = new vscode.MarkdownString(lookup.sections(lookup.themed(text, dir, theme())).join(SEPARATOR));
  md.baseUri = vscode.Uri.file(dir + path.sep);
  md.supportHtml = true;
  return new vscode.Hover(md, range);
}

function activate(context) {
  context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file' }, { provideHover }));
}

function deactivate() {}

module.exports = { activate, deactivate };
