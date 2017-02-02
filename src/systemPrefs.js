const strings = require('strings');

// This is array defining look of system preferences
export const systemPrefs = [{
  label: strings.EDITOR,
  prefs: [
    'closeBrackets', 'closeOthers.above', 'closeOthers.below',
    'closeOthers.others', 'closeTags', 'healthData.healthDataTracking', 'dragDropText',
    'highlightMatches', 'insertHintOnTab', 'maxCodeHints', 'scrollPastEnd', 'showCodeHints',
    'showCursorWhenSelecting', 'showLineNumbers', 'smartIndent', 'softTabs',
    'sortDirectoriesFirst', 'spaceUnits', 'styleActiveLine',
    'tabSize', 'useTabChar', 'uppercaseColors', 'wordWrap', 'debug.showErrorsInStatusBar',
    'findInFiles.nodeSearch', 'findInFiles.instantSearch', 'fonts.fontSize', 'fonts.fontFamily',
    'themes.themeScrollbars', 'themes.theme'
  ]
}, {
  label: strings.LINTING,
  prefs: [
    'jscodehints.noHintsOnDot', 'jslint.options',
    'language.fileExtensions', 'language.fileNames', 'linting.enabled', 'linting.prefer',
    'linting.usePreferredOnly', 'linting.asyncTimeout', 'linting.collapsed'
  ]
}, {
  label: strings.CODE_FOLDING,
  prefs: [
    'code-folding.alwaysUseIndentFold', 'code-folding.enabled', 'code-folding.hideUntilMouseover',
    'code-folding.maxFoldLevel', 'code-folding.minFoldSize', 'code-folding.saveFoldStates',
    'code-folding.makeSelectionsFoldable'
  ]
}, {
  label: strings.CODE_HINT,
  prefs: [
    'codehint.AttrHints', 'codehint.CssPropHints', 'codehint.JSHints',
    'codehint.SpecialCharHints', 'codehint.SVGHints',
    'codehint.TagHints', 'codehint.UrlCodeHints', 'codehint.PrefHints',
    'jscodehints.detectedExclusions', 'jscodehints.typedetails', 'jscodehints.inferenceTimeout'
  ]
}, {
  label: strings.NETWORK,
  prefs: ['proxy', 'staticserver.port']
}, {
  label: strings.OTHERS,
  prefs: ['pane.mergePanesWhenLastFileClosed', 'pane.showPaneHeaderButtons',
    'preferencesView.openPrefsInSplitView', 'preferencesView.openUserPrefsInSecondPane',
    'quickview.extensionlessImagePreview', 'quickview.enabled', 'livedev.multibrowser']
}];

export function getAllSysPrefs() {
  let allPrefs = [];
  systemPrefs.forEach(({ prefs }) => {
    allPrefs = allPrefs.concat(prefs);
  });
  return allPrefs;
}
