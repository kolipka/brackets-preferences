define("dist/bundle", ["strings"], function(__WEBPACK_EXTERNAL_MODULE_7__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _dialog = __webpack_require__(1);
	
	var _dialog2 = _interopRequireDefault(_dialog);
	
	var _systemPrefs = __webpack_require__(6);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* global brackets */
	
	
	var CommandManager = brackets.getModule('command/CommandManager');
	var Menus = brackets.getModule('command/Menus');
	var Dialogs = brackets.getModule('widgets/Dialogs');
	var PreferencesManager = brackets.getModule('preferences/PreferencesManager');
	var KeyBindingManager = brackets.getModule('command/KeyBindingManager');
	var strings = __webpack_require__(7);
	
	var CMD_ID = 'preferences-ui-show';
	var KEY_BINDING = 'Ctrl-,';
	
	function _getFilterFor(prefs) {
	  return function (name) {
	    return prefs.indexOf(name) !== -1;
	  };
	}
	
	function _changedFilter(label, item) {
	  return item.isChanged();
	}
	
	function _makePrefs(prefs) {
	  var sys = (0, _systemPrefs.getAllSysPrefs)();
	  var othersIdx = _systemPrefs.systemPrefs.map(function (it) {
	    return it.label;
	  }).indexOf(strings.OTHERS);
	  var others = _systemPrefs.systemPrefs[othersIdx].prefs;
	  var ext = {};
	
	  Object.keys(prefs).forEach(function (pref) {
	    // Check is system pref
	    if (sys.indexOf(pref) !== -1) {
	      return;
	    }
	
	    // TODO: improve plugin detection. Now it is:
	    // if there is no dot in name, probably it is not extension :)
	    var idx = pref.lastIndexOf('.');
	    if (idx === -1) {
	      // add to others
	      others.push(pref);
	      return;
	    }
	
	    // add to extensions
	    var name = pref.substr(0, idx);
	    if (!ext.hasOwnProperty(name)) {
	      ext[name] = [];
	    }
	    ext[name].push(pref);
	  });
	
	  return {
	    prefs: prefs, ext: ext
	  };
	}
	
	function _showDialog() {
	  // TODO: this is garbage. Check is there another way to add dialog
	  // NOT using template or jQuery
	  var dlgContainer = Dialogs.showModalDialogUsingTemplate('<div class="modal preferences-dialog" />', false);
	  var allPrefs = PreferencesManager.getAllPreferences();
	  var keys = _makePrefs(allPrefs);
	  var dlg = (0, _dialog2.default)({ strings: strings, prefs: allPrefs });
	
	  dlg.render(dlgContainer.getElement()[0]);
	
	  dlg.addLabel(strings.SYSTEM);
	  _systemPrefs.systemPrefs.forEach(function (_ref) {
	    var label = _ref.label;
	    var prefs = _ref.prefs;
	
	    dlg.addFilter(label, _getFilterFor(prefs));
	  });
	
	  dlg.addFilter(strings.CHANGED, _changedFilter);
	
	  dlg.addLabel(strings.EXTENSIONS);
	  Object.keys(keys.ext).sort().forEach(function (ext) {
	    dlg.addFilter(ext, _getFilterFor(keys.ext[ext]));
	  });
	
	  dlg.done(function (btn) {
	    if (btn === 'ok') {
	      dlg.save();
	    }
	    dlgContainer.close();
	    dlg.destroy();
	  });
	}
	
	function _setupMenu() {
	  var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
	
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _redom = __webpack_require__(2);
	
	var _redom2 = _interopRequireDefault(_redom);
	
	var _menuItem = __webpack_require__(3);
	
	var _menuItem2 = _interopRequireDefault(_menuItem);
	
	var _preferencesPanel = __webpack_require__(4);
	
	var _preferencesPanel2 = _interopRequireDefault(_preferencesPanel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ESCAPE_KEY = 27;
	
	exports.default = (0, _redom2.default)({
	  create: function create(_ref) {
	    var strings = _ref.strings;
	    var prefs = _ref.prefs;
	
	    this.model = {
	      prefs: prefs,
	      strings: strings,
	      filters: {},
	      current: null,
	      search: null,
	      btnCallback: null
	    };
	  },
	  labelView: function labelView(label) {
	    return this._h('li', { class: "nav-header" }, [label]);
	  },
	  view: function view(s) {
	    return this._h('div', null, [this._h('div', { class: "modal-header" }, [this._h('h1', { class: "dialog-title" }, [s.TITLE]), this._h('div', { class: "form-search" }, [this._h('div', { class: "input-append" }, [this._h('input', { ref: "search", type: "text", class: "span2 search-query",
	      title: s.SEARCH_TITLE, placeholder: s.SEARCH }), this._h('button', { ref: "clear", class: "btn" }, ["X"])])])]), this._h('div', { class: "modal-body container" }, [this._h('div', { class: "side-panel" }, [this._h('div', { class: "side-panel-container" }, [this._h('ul', { ref: "items", class: "nav nav-list" })])]), this._h('div', { ref: "main", class: "main-panel" })]), this._h('div', { class: "modal-footer" }, [this._h('button', { class: "dialog-button btn", ref: "btnCancel" }, [s.CANCEL]), this._h('button', { class: "dialog-button btn", ref: "btnOk" }, [s.SAVE])])]);
	  },
	  render: function render(container) {
	    var _this = this;
	
	    var _view = this.view(this.model.strings);
	
	    var node = _view.node;
	    var r = _view.r;
	
	    this.refs = r;
	    this.container = container;
	
	    var panel = (0, _preferencesPanel2.default)(this.model.prefs, this.model.strings);
	    panel.render(this.refs.main);
	    this.model.panel = panel;
	
	    r.search.addEventListener('keyup', this._onChange);
	    r.clear.addEventListener('click', this._onClear);
	
	    r.btnCancel.addEventListener('click', function () {
	      _this.model.btnCallback('cancel');
	    });
	    r.btnOk.addEventListener('click', function () {
	      _this.model.btnCallback('ok');
	    });
	    document.addEventListener('keyup', this._keyHandler);
	    container.appendChild(node);
	    return node;
	  },
	  addFilter: function addFilter(label, predicate) {
	    var menu = (0, _menuItem2.default)(label);
	    this.model.filters[label] = { predicate: predicate, menu: menu };
	    menu.render(this.refs.items);
	    menu.on('click', this._route);
	
	    // Select first route
	    if (this.model.current === null) {
	      this._route(label);
	    }
	  },
	  addLabel: function addLabel(label) {
	    var _labelView = this.labelView(label);
	
	    var node = _labelView.node;
	
	    this.refs.items.appendChild(node);
	  },
	  save: function save() {
	    var props = this.model.panel.model.data;
	    Object.getOwnPropertyNames(props).forEach(function (name) {
	      var propNode = props[name];
	      if (propNode.isChanged()) {
	        propNode.save();
	      }
	    });
	  },
	  done: function done(callback) {
	    this.model.btnCallback = callback;
	  },
	  _destroy: function _destroy() {
	    document.removeEventListener('keyup', this._keyHandler);
	  }
	}, {
	  _route: function _route(name) {
	    var r = this.model.filters;
	    var c = this.model.current;
	
	    // clear old route
	    if (r.hasOwnProperty(c)) {
	      var menu = r[c].menu;
	
	      menu.activate(false);
	    }
	
	    // Set new route
	    if (r.hasOwnProperty(name)) {
	      var _r$name = r[name];
	      var predicate = _r$name.predicate;
	      var _menu = _r$name.menu;
	
	      _menu.activate(true);
	      this.model.panel.setFilter(predicate, name);
	      this.model.panel.refresh();
	      this.model.current = name;
	    }
	  },
	  _searchFilter: function _searchFilter(label /* item */) {
	    var phrase = this.model.search;
	    return label.match(phrase);
	  },
	  _onChange: function _onChange(e) {
	    if (e.which === ESCAPE_KEY) {
	      e.preventDefault();
	      e.stopPropagation();
	      this._onClear();
	      this.refs.search.blur();
	      return;
	    }
	    if (this.model.search === null) {
	      this.model.panel.setFilter(this._searchFilter, this.model.strings.SEARCH_CUSTOM);
	    }
	    this.model.search = this.refs.search.value;
	    this.model.panel.refresh();
	  },
	  _onClear: function _onClear() {
	    this.refs.search.value = '';
	    this.model.search = null;
	    this._route(this.model.current);
	  },
	  _keyHandler: function _keyHandler(e) {
	    if (e.which === ESCAPE_KEY) {
	      this.model.btnCallback('cancel');
	    }
	  }
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports =
	/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ({
	
	/***/ 0:
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = createComponent;
		
		var _emitter = __webpack_require__(56);
		
		var _emitter2 = _interopRequireDefault(_emitter);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		var REF = 'ref'; /*
		                  The dream here is to have simple library that:
		                  1. Uses DOM and utilize DOM state
		                  2. Provide easy way to access references to DOM elements
		                  3. Helps to make some kind of reusable components
		                  485. Help me to learn Javascript
		                 
		                  TODO:
		                  * how to use DOM state in nice manner?
		                  * since it looks ugly and usage sucks answer a question:
		                    - how to make it better?
		                  * ... do it
		                 */
		
		
		function isNode(el) {
		  return el && el.nodeName && el.nodeType;
		}
		
		/*
		 * TODO: child default to []?
		 */
		function h(tag) {
		  var attr = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		  var child = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
		
		  var refs = {};
		  var ret = document.createElement(tag);
		  if (attr !== null) {
		    Object.getOwnPropertyNames(attr).map(function (k) {
		      if (k === REF) {
		        refs[attr[k]] = ret;
		        return;
		      }
		      ret.setAttribute(k, attr[k]);
		    });
		  }
		  if (Array.isArray(child)) {
		    child.map(function (el) {
		      if (typeof el === 'string') {
		        ret.appendChild(document.createTextNode(el));
		      } else if (el.node) {
		        if (isNode(el.node)) {
		          ret.appendChild(el.node);
		        }
		        Object.assign(refs, el.r);
		      }
		    });
		  } else if (child !== null) {
		    throw Error('Unexpected child element' + JSON.stringify(child));
		  }
		
		  return { node: ret, r: refs };
		}
		
		function refText(label, ref) {
		  var node = document.createTextNode(label);
		  var r = {};
		  r[ref] = node;
		  return { node: node, r: r };
		}
		
		/*
		 * Component:
		 * on, off, trigger - from emitter
		 * create, destroy, _h, _t - for proto
		 * own API
		 */
		var proto = {
		  refs: {},
		  _t: refText,
		  _h: h,
		  create: function create() {},
		  destroy: function destroy() {
		    // Remove all event listeners
		    this.removeAll();
		    if (this._destroy) {
		      this._destroy();
		    }
		  }
		};
		
		function createComponent(methods, events) {
		  return function () {
		    var instance = Object.assign((0, _emitter2.default)(), proto, methods);
		    if (events !== undefined && events !== null) {
		      var e = Object.getOwnPropertyNames(events);
		      e.forEach(function (p) {
		        var func = events[p];
		        if (typeof func === 'function') {
		          instance[p] = func.bind(instance);
		        }
		      });
		    }
		    instance.create.apply(instance, arguments);
		    return instance;
		  };
		}
	
	/***/ },
	
	/***/ 56:
	/***/ function(module, exports) {
	
		"use strict";
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = createEmitter;
		/*
		 * This is very simple event emitter.
		 */
		
		function on(event, func) {
		  var _listeners = this._listeners;
		  if (!_listeners.hasOwnProperty(event)) {
		    _listeners[event] = [];
		  }
		  _listeners[event].push(func);
		}
		
		function off(event, func) {
		  var eventListeners = this._listeners[event];
		  if (eventListeners !== undefined) {
		    var idx = eventListeners.indexOf(func);
		    if (idx !== -1) {
		      eventListeners.splice(idx, 1);
		    }
		  }
		}
		
		function trigger(event, data) {
		  var eventListeners = this._listeners[event];
		  if (eventListeners !== undefined) {
		    var len = eventListeners.length;
		    for (var i = 0; i < len; i++) {
		      eventListeners[i](data);
		    }
		  }
		}
		
		function removeAll() {
		  this._listeners = {};
		}
		
		function createEmitter() {
		  return {
		    _listeners: {},
		    on: on, off: off,
		    trigger: trigger,
		    removeAll: removeAll
		  };
		}
	
	/***/ }
	
	/******/ });
	//# sourceMappingURL=redom.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _redom = __webpack_require__(2);
	
	var _redom2 = _interopRequireDefault(_redom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _redom2.default)({
	  create: function create(label) {
	    this.model = {
	      label: label
	    };
	  },
	  view: function view(label) {
	    return this._h('li', { title: label }, [this._h('a', { ref: "btn", href: "#" }, [label])]);
	  },
	  render: function render(container) {
	    var _view = this.view(this.model.label);
	
	    var node = _view.node;
	    var r = _view.r;
	
	    this.refs = r;
	
	    r.btn.addEventListener('click', this._onClick);
	    container.appendChild(node);
	    this.container = container;
	    return node;
	  },
	  _destroy: function _destroy() {
	    this.r.btn.removeEventListener('click', this._onClick);
	  },
	  activate: function activate(state) {
	    this.refs.btn.parentElement.classList.toggle('active', state);
	  }
	}, {
	  _onClick: function _onClick() {
	    this.trigger('click', this.model.label);
	  }
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _redom = __webpack_require__(2);
	
	var _redom2 = _interopRequireDefault(_redom);
	
	var _preferenceItem = __webpack_require__(5);
	
	var _preferenceItem2 = _interopRequireDefault(_preferenceItem);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* global brackets */
	
	
	var PreferencesManager = brackets.getModule('preferences/PreferencesManager');
	
	function _validate(name, pref) {
	  var value = PreferencesManager.get(name);
	  if (pref.type === 'number' && value !== '') {
	    /* eslint-disable radix */
	    // Allow automated hex detection and so on.
	    return !Number.isNaN(Number.parseInt(value));
	    /* eslint-enable radix */
	  }
	  return true;
	}
	
	exports.default = (0, _redom2.default)({
	  create: function create(prefs, strings) {
	    this.model = {
	      data: {},
	      prefs: prefs,
	      strings: strings,
	      _filter: function _filter() {
	        return true;
	      }
	    };
	    var d = this.model.data;
	    Object.keys(prefs).forEach(function (name) {
	      return d[name] = null;
	    });
	  },
	  view: function view() {
	    return this._h('div', { ref: "panel", class: "main-panel-container" }, [this._h('legend', { ref: "title" })]);
	  },
	  render: function render(container) {
	    if (this._node) {
	      container.appendChild(this._node);
	      return this._node;
	    }
	    var strings = this.model.strings;
	
	    var _view = this.view(this.model);
	
	    var node = _view.node;
	    var r = _view.r;
	
	    var prefs = this.model.prefs;
	    var d = this.model.data;
	    this.refs = r;
	
	    // Render all options
	    Object.getOwnPropertyNames(d).forEach(function (name) {
	      var pref = prefs[name];
	      if (_validate(name, pref)) {
	        var prefNode = (0, _preferenceItem2.default)(name, pref, strings);
	        prefNode.render(r.panel);
	        d[name] = prefNode;
	      } else {
	        /* eslint-disable no-console */
	        console.error('Invalid preference description / value:', name);
	        /* eslint-enable no-console */
	        delete d[name];
	      }
	    });
	
	    container.appendChild(node);
	    return node;
	  },
	  setFilter: function setFilter(filter, name) {
	    this.model._filter = filter;
	    this.refs.title.innerHTML = name;
	  },
	  refresh: function refresh() {
	    var d = this.model.data;
	    var f = this.model._filter;
	    Object.getOwnPropertyNames(d).forEach(function (name) {
	      var prefNode = d[name];
	      prefNode.display(f(name, prefNode));
	    });
	  },
	  detach: function detach() {
	    this.refs.panel.parentElement.removeChild(this.refs.panel);
	  },
	  display: function display(show) {
	    this.refs.panel.classList.toggle('hide', !show);
	  }
	}, {
	  _onChange: function _onChange() {}
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _redom = __webpack_require__(2);
	
	var _redom2 = _interopRequireDefault(_redom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// const ESCAPE_KEY = 27;
	var PreferencesManager = brackets.getModule('preferences/PreferencesManager'); /* global brackets */
	
	
	function _viewInput(m) {
	  return this._h('div', { class: "pref-line" }, [this._h('label', { title: m.description }, [m.label]), this._h('input', { ref: "input", type: m.type,
	    placeholder: m.default,
	    title: 'default: ' + m.default,
	    value: m.value,
	    class: "input-block-level" })]);
	}
	var _stringProto = {
	  view: _viewInput
	};
	
	var _numberProto = {
	  view: _viewInput,
	  save: function save() {
	    /* eslint-disable radix */
	    var value = Number.parseInt(this.refs.input.value);
	    /* eslint-enable radix */
	    if (Number.isNaN(value)) {
	      /* eslint-disable no-console */
	      console.error('Exception while parsing:', this.model.prefName);
	      /* eslint-enable no-console */
	    }
	    PreferencesManager.set(this.model.prefName, value);
	  }
	};
	
	var _arrayProto = {
	  view: function view(m) {
	    var node = this._h('div', { class: "pref-line" }, [this._h('label', { title: m.description }, [m.label]), this._h('textarea', { ref: "input", rows: "6",
	      title: 'default: ' + m.default,
	      class: "input-block-level" })]);
	    node.r.input.value = JSON.stringify(m.value, null, 2);
	    return node;
	  },
	  isChanged: function isChanged() {
	    return JSON.stringify(this.model.viewData.value, null, 2) !== this.refs.input.value;
	  },
	  save: function save() {
	    try {
	      PreferencesManager.set(this.model.prefName, JSON.parse(this.refs.input.value));
	    } catch (e) {
	      /* eslint-disable no-console */
	      console.error('Exception while parsing:', this.model.prefName);
	      /* eslint-enable no-console */
	    }
	  }
	};
	
	var _boolProto = {
	  view: function view(m) {
	    var node = this._h('div', { class: "pref-line" }, [this._h('label', { title: m.description }, [this._h('input', { ref: "input", type: "checkbox", title: 'default: ' + !!m.default }), m.label])]);
	    node.r.input.checked = m.value === true;
	    return node;
	  },
	  isChanged: function isChanged() {
	    return !!this.model.viewData.value !== this.refs.input.checked;
	  },
	  save: function save() {
	    PreferencesManager.set(this.model.prefName, this.refs.input.checked);
	  }
	};
	
	function getLabelFromStrings(name, strings) {
	  var key = 'PROP_' + name.toUpperCase();
	  if (strings.hasOwnProperty(key)) {
	    return strings[key];
	  }
	  return name;
	}
	
	exports.default = (0, _redom2.default)({
	  create: function create(prefName, prefDescription, strings) {
	    var value = PreferencesManager.get(prefName) || '';
	    var type = prefDescription.type || 'string';
	    this.model = {
	      strings: strings,
	      prefName: prefName,
	      prefDescription: prefDescription,
	      viewData: {
	        default: prefDescription.initial || '',
	        description: prefDescription.description || '',
	        type: type,
	        value: value,
	        label: getLabelFromStrings(prefName, strings)
	      }
	    };
	
	    // Setup proper handlers
	    switch (type) {
	      case 'boolean':
	        Object.assign(this, _boolProto);
	        break;
	      case 'integer':
	      case 'number':
	        this.model.viewData.type = 'number';
	        Object.assign(this, _numberProto);
	        break;
	      case 'array':
	      case 'object':
	        Object.assign(this, _arrayProto);
	        break;
	      default:
	        this.model.viewData.type = 'text';
	        Object.assign(this, _stringProto);
	    }
	  },
	  render: function render(container) {
	    var _view = this.view(this.model.viewData, this.model.strings);
	
	    var node = _view.node;
	    var r = _view.r;
	
	    this.refs = r;
	    r.node = node;
	    r.input.addEventListener('change', this._onChange);
	
	    container.appendChild(node);
	    return node;
	  },
	  _isDefault: function _isDefault() {
	    return this.model.viewData.default === this.refs.input.value;
	  },
	  isChanged: function isChanged() {
	    return this.model.viewData.value.toString() !== this.refs.input.value;
	  },
	  save: function save() {
	    PreferencesManager.set(this.model.prefName, this.refs.input.value);
	  },
	  display: function display(show) {
	    this.refs.node.classList.toggle('hide', !show);
	  },
	  detach: function detach() {}
	}, {
	  _onChange: function _onChange(e) {
	    this._value = e.target.value;
	    this.refs.node.classList.toggle('preference-changed', this.isChanged());
	  }
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getAllSysPrefs = getAllSysPrefs;
	var strings = __webpack_require__(7);
	
	// This is array defining look of system preferences
	var systemPrefs = exports.systemPrefs = [{
	  label: strings.EDITOR,
	  prefs: ['closeBrackets', 'closeOthers.above', 'closeOthers.below', 'closeOthers.others', 'closeTags', 'healthData.healthDataTracking', 'dragDropText', 'highlightMatches', 'insertHintOnTab', 'maxCodeHints', 'scrollPastEnd', 'showCodeHints', 'showCursorWhenSelecting', 'showLineNumbers', 'smartIndent', 'softTabs', 'sortDirectoriesFirst', 'spaceUnits', 'styleActiveLine', 'tabSize', 'useTabChar', 'uppercaseColors', 'wordWrap', 'debug.showErrorsInStatusBar', 'findInFiles.nodeSearch', 'findInFiles.instantSearch', 'fonts.fontSize', 'fonts.fontFamily', 'themes.themeScrollbars', 'themes.theme']
	}, {
	  label: strings.LINTING,
	  prefs: ['jscodehints.noHintsOnDot', 'jslint.options', 'language.fileExtensions', 'language.fileNames', 'linting.enabled', 'linting.prefer', 'linting.usePreferredOnly', 'linting.asyncTimeout', 'linting.collapsed']
	}, {
	  label: strings.CODE_FOLDING,
	  prefs: ['code-folding.alwaysUseIndentFold', 'code-folding.enabled', 'code-folding.hideUntilMouseover', 'code-folding.maxFoldLevel', 'code-folding.minFoldSize', 'code-folding.saveFoldStates', 'code-folding.makeSelectionsFoldable']
	}, {
	  label: strings.CODE_HINT,
	  prefs: ['codehint.AttrHints', 'codehint.CssPropHints', 'codehint.JSHints', 'codehint.SpecialCharHints', 'codehint.SVGHints', 'codehint.TagHints', 'codehint.UrlCodeHints', 'codehint.PrefHints', 'jscodehints.detectedExclusions', 'jscodehints.typedetails', 'jscodehints.inferenceTimeout']
	}, {
	  label: strings.NETWORK,
	  prefs: ['proxy', 'staticserver.port']
	}, {
	  label: strings.OTHERS,
	  prefs: ['pane.mergePanesWhenLastFileClosed', 'pane.showPaneHeaderButtons', 'preferencesView.openPrefsInSplitView', 'preferencesView.openUserPrefsInSecondPane', 'quickview.extensionlessImagePreview', 'quickview.enabled', 'livedev.multibrowser']
	}];
	
	function getAllSysPrefs() {
	  var allPrefs = [];
	  systemPrefs.forEach(function (_ref) {
	    var prefs = _ref.prefs;
	
	    allPrefs = allPrefs.concat(prefs);
	  });
	  return allPrefs;
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }
/******/ ])});;
//# sourceMappingURL=bundle.js.map