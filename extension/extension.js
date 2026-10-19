const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const lookup = require('./lookup');
const uvm = require('./uvm');

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
  if (!config().get('enabled')) {
    return undefined;
  }
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

// ---- UVM for slang: point slang at a UVM library so UVM code compiles without errors ----

const BUNDLED_UVM = path.join(__dirname, 'uvm-core');

async function workspaceUsesUvm(folder) {
  const pattern = new vscode.RelativePattern(folder, '**/*.{sv,svh}');
  const files = await vscode.workspace.findFiles(pattern, '**/{node_modules,.git}/**', 500);
  for (const file of files) {
    try {
      if (uvm.usesUvm(fs.readFileSync(file.fsPath, 'utf8'))) {
        return true;
      }
    } catch (err) {
      // unreadable file: skip it
    }
  }
  return false;
}

// Write .slang/local/server.json so slang finds UVM. Returns true when the file changed.
async function wireFolder(folder, state, chosenByUser) {
  const root = folder.uri.fsPath;
  const slangDir = path.join(root, '.slang');
  const localDir = path.join(slangDir, 'local');
  const localFile = path.join(localDir, 'server.json');
  const key = `uvmDir:${root}`;
  const previous = state.get(key);
  // Leave projects alone that do not use UVM, or that already set slang up for UVM themselves.
  if (!previous && !chosenByUser) {
    const own = [path.join(slangDir, 'server.json'), localFile].some((f) => uvm.mentionsUvm(uvm.readJson(f)));
    if (own || !(await workspaceUsesUvm(folder))) {
      return false;
    }
  }
  const pick = uvm.choose(config().get('uvmPath'), process.env.UVM_HOME, BUNDLED_UVM);
  for (const problem of pick.skipped) {
    vscode.window.showWarningMessage(`Grimoire: ${problem}; using ${pick.from === 'bundled' ? 'the bundled UVM' : pick.from} instead.`);
  }
  if (!pick.dir) {
    return false;
  }
  const base = uvm.readJson(path.join(slangDir, 'server.json'));
  const before = uvm.readJson(localFile);
  const keepWorkspace = !(base && base.index) && !(before && before.index && before.index.length);
  const after = uvm.wire(before, pick.dir, previous, keepWorkspace);
  await state.update(key, pick.dir);
  if (JSON.stringify(after) === JSON.stringify(before)) {
    return false;
  }
  fs.mkdirSync(localDir, { recursive: true });
  const ignore = path.join(localDir, '.gitignore');
  if (!fs.existsSync(ignore)) {
    fs.writeFileSync(ignore, '# Machine-specific slang settings, written by Grimoire\n*\n');
  }
  fs.writeFileSync(localFile, JSON.stringify(after, null, 2) + '\n');
  return true;
}

async function wireSlang(state, chosenByUser = false) {
  if (!config().get('enabled')) {
    return;
  }
  if (chosenByUser && !(vscode.workspace.workspaceFolders || []).length) {
    vscode.window.showWarningMessage('Grimoire: open a folder first. Slang reads its UVM settings from the workspace folder.');
    return;
  }
  let changed = false;
  for (const folder of vscode.workspace.workspaceFolders || []) {
    try {
      changed = (await wireFolder(folder, state, chosenByUser)) || changed;
    } catch (err) {
      vscode.window.showWarningMessage(`Grimoire: could not configure slang for UVM: ${err.message}`);
    }
  }
  if (changed) {
    vscode.commands.executeCommand('slang.restartLanguageServer').then(undefined, () => {});
  }
  if (chosenByUser) {
    const pick = uvm.choose(config().get('uvmPath'), process.env.UVM_HOME, BUNDLED_UVM);
    const from = pick.from === 'bundled' ? 'the UVM bundled with Grimoire' : pick.from === 'UVM_HOME' ? 'UVM_HOME' : 'your chosen folder';
    vscode.window.showInformationMessage(`Grimoire: slang uses ${from}, ${pick.dir}.`);
  }
}

async function setUvmPath(state) {
  const current = uvm.choose(config().get('uvmPath'), process.env.UVM_HOME, BUNDLED_UVM);
  const auto = process.env.UVM_HOME ? `UVM_HOME (${process.env.UVM_HOME}), else the bundled UVM` : 'the bundled UVM, since UVM_HOME is not set';
  const choice = await vscode.window.showQuickPick(
    [
      { label: 'Choose a folder…', detail: 'A UVM installation, or its src folder' },
      { label: 'Automatic', detail: `Use ${auto}` },
    ],
    { placeHolder: `Slang currently uses ${current.dir || 'no UVM library'}` }
  );
  if (!choice) {
    return;
  }
  let value = '';
  if (choice.label !== 'Automatic') {
    const picked = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, openLabel: 'Use this UVM' });
    if (!picked) {
      return;
    }
    value = picked[0].fsPath;
    if (!uvm.source(value)) {
      vscode.window.showErrorMessage(`Grimoire: ${value} has no uvm_pkg.sv, in the folder itself or in src.`);
      return;
    }
  }
  if (value === (config().get('uvmPath') || '')) {
    await wireSlang(state, true); // unchanged setting: no configuration event, so apply it here
  } else {
    await config().update('uvmPath', value, vscode.ConfigurationTarget.Global); // the listener rewires slang
  }
}

async function setEnabled(on) {
  await config().update('enabled', on, vscode.ConfigurationTarget.Global);
  vscode.window.showInformationMessage(on ? 'Grimoire is enabled.' : 'Grimoire is disabled. Run "Grimoire: Enable" to turn it back on.');
}

// VS Code lists hovers that match equally well newest first, and slang registers its hover each time its
// language server starts. Registering again after every start keeps Grimoire's page above slang's.
function keepHoverOnTop(context) {
  let registration;
  const register = () => {
    if (registration) {
      registration.dispose();
    }
    registration = vscode.languages.registerHoverProvider({ scheme: 'file' }, { provideHover });
  };
  register();
  const slang = vscode.extensions.getExtension('hudson-river-trading.vscode-slang');
  let watched;
  let listener;
  const watch = () => {
    const client = slang && slang.isActive && slang.exports && slang.exports.client;
    if (!client || client === watched || typeof client.onDidChangeState !== 'function') {
      return;
    }
    watched = client;
    if (listener) {
      listener.dispose();
    }
    const RUNNING = 2; // vscode-languageclient State.Running
    listener = client.onDidChangeState((e) => {
      if (e.newState === RUNNING) {
        setTimeout(register, 500);
      }
    });
    if (client.state === RUNNING) {
      register();
    }
  };
  watch();
  const timer = setInterval(watch, 3000); // slang makes a new client on every restart
  context.subscriptions.push({
    dispose() {
      clearInterval(timer);
      if (listener) {
        listener.dispose();
      }
      if (registration) {
        registration.dispose();
      }
    },
  });
}

function activate(context) {
  const state = context.workspaceState;
  keepHoverOnTop(context);
  const syncContext = () => vscode.commands.executeCommand('setContext', 'grimoire.enabled', config().get('enabled'));
  syncContext();
  context.subscriptions.push(
    vscode.commands.registerCommand('grimoire.enable', () => setEnabled(true)),
    vscode.commands.registerCommand('grimoire.disable', () => setEnabled(false)),
    vscode.commands.registerCommand('grimoire.setUvmPath', () => setUvmPath(state)),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('grimoire.enabled')) {
        syncContext();
        wireSlang(state);
      } else if (e.affectsConfiguration('grimoire.uvmPath')) {
        wireSlang(state, true);
      }
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(() => wireSlang(state))
  );
  wireSlang(state);
}

function deactivate() {}

module.exports = { activate, deactivate };
