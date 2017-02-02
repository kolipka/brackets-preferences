/* global brackets */
import createComponent from 'redom';
import createPref from './preferenceItem.js';

const PreferencesManager = brackets.getModule('preferences/PreferencesManager');

function _validate(name, pref) {
  const value = PreferencesManager.get(name);
  if (pref.type === 'number' && value !== '') {
    /* eslint-disable radix */
    // Allow automated hex detection and so on.
    return !Number.isNaN(Number.parseInt(value));
    /* eslint-enable radix */
  }
  return true;
}

export default createComponent({
  create(prefs, strings) {
    this.model = {
      data: {},
      prefs,
      strings,
      _filter() { return true; }
    };
    const d = this.model.data;
    Object.keys(prefs).forEach((name) => d[name] = null);
  },
  view() {
    return (
      <div ref="panel" class="main-panel-container">
        <legend ref="title"></legend>
      </div>
    );
  },
  render(container) {
    if (this._node) {
      container.appendChild(this._node);
      return this._node;
    }
    const strings = this.model.strings;
    const { node, r } = this.view(this.model);
    const prefs = this.model.prefs;
    const d = this.model.data;
    this.refs = r;

    // Render all options
    Object.getOwnPropertyNames(d).forEach((name) => {
      const pref = prefs[name];
      if (_validate(name, pref)) {
        const prefNode = createPref(name, pref, strings);
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
  setFilter(filter, name) {
    this.model._filter = filter;
    this.refs.title.innerHTML = name;
  },
  refresh() {
    const d = this.model.data;
    const f = this.model._filter;
    Object.getOwnPropertyNames(d).forEach((name) => {
      const prefNode = d[name];
      prefNode.display(f(name, prefNode));
    });
  },
  detach() {
    this.refs.panel.parentElement.removeChild(this.refs.panel);
  },
  display(show) {
    this.refs.panel.classList.toggle('hide', !show);
  }
}, {
  _onChange() {
  }
});
