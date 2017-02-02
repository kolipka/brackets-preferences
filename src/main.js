/* global brackets */
import dialog from './components/dialog.js';
import { systemPrefs, getAllSysPrefs } from './systemPrefs.js';

const CommandManager = brackets.getModule('command/CommandManager');
const Menus = brackets.getModule('command/Menus');
const Dialogs = brackets.getModule('widgets/Dialogs');
const PreferencesManager = brackets.getModule('preferences/PreferencesManager');
const KeyBindingManager = brackets.getModule('command/KeyBindingManager');
const strings = require('strings');

const CMD_ID = 'preferences-ui-show';
const KEY_BINDING = 'Ctrl-,';

function _getFilterFor(prefs) {
  return function (name) {
    return prefs.indexOf(name) !== -1;
  };
}

function _changedFilter(label, item) {
  return item.isChanged();
}


function _makePrefs(prefs) {
  const sys = getAllSysPrefs();
  const othersIdx = systemPrefs.map((it) => it.label).indexOf(strings.OTHERS);
  const others = systemPrefs[othersIdx].prefs;
  const ext = {};

  Object.keys(prefs).forEach((pref) => {
    // Check is system pref
    if (sys.indexOf(pref) !== -1) {
      return;
    }

    // TODO: improve plugin detection. Now it is:
    // if there is no dot in name, probably it is not extension :)
    const idx = pref.lastIndexOf('.');
    if (idx === -1) {
      // add to others
      others.push(pref);
      return;
    }

    // add to extensions
    const name = pref.substr(0, idx);
    if (!ext.hasOwnProperty(name)) {
      ext[name] = [];
    }
    ext[name].push(pref);
  });

  return {
    prefs, ext
  };
}

function _showDialog() {
  // TODO: this is garbage. Check is there another way to add dialog
  // NOT using template or jQuery
  const dlgContainer = Dialogs.showModalDialogUsingTemplate('<div class="modal preferences-dialog" />', false);
  const allPrefs = PreferencesManager.getAllPreferences();
  const keys = _makePrefs(allPrefs);
  const dlg = dialog({ strings, prefs: allPrefs });

  dlg.render(dlgContainer.getElement()[0]);

  dlg.addLabel(strings.SYSTEM);
  systemPrefs.forEach(({ label, prefs }) => {
    dlg.addFilter(label, _getFilterFor(prefs));
  });

  dlg.addFilter(strings.CHANGED, _changedFilter);

  dlg.addLabel(strings.EXTENSIONS);
  Object.keys(keys.ext).sort().forEach((ext) => {
    dlg.addFilter(ext, _getFilterFor(keys.ext[ext]));
  });

  dlg.done((btn) => {
    if (btn === 'ok') {
      dlg.save();
    }
    dlgContainer.close();
    dlg.destroy();
  });
}

function _setupMenu() {
  const menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);

  CommandManager.register(strings.TITLE, CMD_ID, _showDialog);
  menu.addMenuDivider();
  menu.addMenuItem(CMD_ID);
}

function _setupKeys() {
  KeyBindingManager.removeBinding(KEY_BINDING);
  KeyBindingManager.addBinding(CMD_ID, KEY_BINDING);
}

_setupMenu();
_setupKeys();
