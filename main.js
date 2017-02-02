/* global define, brackets */

define(function (require, exports, module) {
  const ExtensionUtils = brackets.getModule('utils/ExtensionUtils');

  // styling
  ExtensionUtils.loadStyleSheet(module, 'styles/main.less');


  require(window._babelPolyfill ? [] : ['./dist/polyfill'], function () {
    window._babelPolyfill = true; // Make sure it will not be loaded again by other module

    // Main bundle
    require('./dist/bundle');
  });
});
