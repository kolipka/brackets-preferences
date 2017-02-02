import createComponent from 'redom';
import menuItem from './menuItem.js';
import preferencesPanel from './preferencesPanel.js';

const ESCAPE_KEY = 27;

export default createComponent({
  create({ strings, prefs }) {
    this.model = {
      prefs,
      strings,
      filters: {},
      current: null,
      search: null,
      btnCallback: null
    };
  },
  labelView(label) {
    return <li class="nav-header">{label}</li>;
  },
  view(s) {
    return (
      <div>
        <div class="modal-header">
          <h1 class="dialog-title">{s.TITLE}</h1>
          <div class="form-search">
            <div class="input-append">
              <input ref="search" type="text" class="span2 search-query"
                title={s.SEARCH_TITLE} placeholder={s.SEARCH} />
              <button ref="clear" class="btn">X</button>
            </div>
          </div>
        </div>
        <div class="modal-body container">
          <div class="side-panel">
            <div class="side-panel-container">
              <ul ref="items" class="nav nav-list"></ul>
            </div>
          </div>
          <div ref="main" class="main-panel">
          </div>
        </div>
        <div class="modal-footer">
          <button class="dialog-button btn" ref="btnCancel">{s.CANCEL}</button>
          <button class="dialog-button btn" ref="btnOk">{s.SAVE}</button>
        </div>
      </div>
    );
  },
  render(container) {
    const { node, r } = this.view(this.model.strings);
    this.refs = r;
    this.container = container;

    const panel = preferencesPanel(this.model.prefs, this.model.strings);
    panel.render(this.refs.main);
    this.model.panel = panel;

    r.search.addEventListener('keyup', this._onChange);
    r.clear.addEventListener('click', this._onClear);

    r.btnCancel.addEventListener('click', () => { this.model.btnCallback('cancel'); });
    r.btnOk.addEventListener('click', () => { this.model.btnCallback('ok'); });
    document.addEventListener('keyup', this._keyHandler);
    container.appendChild(node);
    return node;
  },
  addFilter(label, predicate) {
    const menu = menuItem(label);
    this.model.filters[label] = { predicate, menu };
    menu.render(this.refs.items);
    menu.on('click', this._route);

    // Select first route
    if (this.model.current === null) {
      this._route(label);
    }
  },
  addLabel(label) {
    const { node } = this.labelView(label);
    this.refs.items.appendChild(node);
  },
  save() {
    const props = this.model.panel.model.data;
    Object.getOwnPropertyNames(props).forEach((name) => {
      const propNode = props[name];
      if (propNode.isChanged()) {
        propNode.save();
      }
    });
  },
  done(callback) {
    this.model.btnCallback = callback;
  },
  _destroy() {
    document.removeEventListener('keyup', this._keyHandler);
  }
}, {
  _route(name) {
    const r = this.model.filters;
    const c = this.model.current;

    // clear old route
    if (r.hasOwnProperty(c)) {
      const { menu } = r[c];
      menu.activate(false);
    }

    // Set new route
    if (r.hasOwnProperty(name)) {
      const { predicate, menu } = r[name];
      menu.activate(true);
      this.model.panel.setFilter(predicate, name);
      this.model.panel.refresh();
      this.model.current = name;
    }
  },
  _searchFilter(label/* item */) {
    const phrase = this.model.search;
    return label.match(phrase);
  },
  _onChange(e) {
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
  _onClear() {
    this.refs.search.value = '';
    this.model.search = null;
    this._route(this.model.current);
  },
  _keyHandler(e) {
    if (e.which === ESCAPE_KEY) {
      this.model.btnCallback('cancel');
    }
  }
});
