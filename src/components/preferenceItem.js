/* global brackets */
import createComponent from 'redom';

// const ESCAPE_KEY = 27;
const PreferencesManager = brackets.getModule('preferences/PreferencesManager');

function _viewInput(m) {
  return (
    <div class="pref-line">
      <label title={m.description}>{m.label}</label>
      <input ref="input" type={m.type}
             placeholder={m.default}
             title={'default: ' + m.default}
             value={m.value}
             class="input-block-level"/>
    </div>
  );
}
const _stringProto = {
  view: _viewInput
};

const _numberProto = {
  view: _viewInput,
  save() {
  /* eslint-disable radix */
    const value = Number.parseInt(this.refs.input.value);
  /* eslint-enable radix */
    if (Number.isNaN(value)) {
      /* eslint-disable no-console */
      console.error('Exception while parsing:', this.model.prefName);
      /* eslint-enable no-console */
    }
    PreferencesManager.set(this.model.prefName, value);
  }
};

const _arrayProto = {
  view(m) {
    const node = (
      <div class="pref-line">
        <label title={m.description}>{m.label}</label>
        <textarea ref="input" rows="6"
          title={'default: ' + m.default}
          class="input-block-level"/>
      </div>
    );
    node.r.input.value = JSON.stringify(m.value, null, 2);
    return node;
  },
  isChanged() {
    return JSON.stringify(this.model.viewData.value, null, 2) !== this.refs.input.value;
  },
  save() {
    try {
      PreferencesManager.set(this.model.prefName, JSON.parse(this.refs.input.value));
    } catch (e) {
      /* eslint-disable no-console */
      console.error('Exception while parsing:', this.model.prefName);
      /* eslint-enable no-console */
    }
  }
};

const _boolProto = {
  view(m) {
    const node = (
      <div class="pref-line">
        <label title={m.description}>
          <input ref="input" type="checkbox" title={'default: ' + !!m.default} />
          {m.label}
        </label>
      </div>
    );
    node.r.input.checked = m.value === true;
    return node;
  },
  isChanged() {
    return !!this.model.viewData.value !== this.refs.input.checked;
  },
  save() {
    PreferencesManager.set(this.model.prefName, this.refs.input.checked);
  }
};

function getLabelFromStrings(name, strings) {
  const key = 'PROP_' + name.toUpperCase();
  if (strings.hasOwnProperty(key)) {
    return strings[key];
  }
  return name;
}

export default createComponent({
  create(prefName, prefDescription, strings) {
    const value = PreferencesManager.get(prefName) || '';
    const type = prefDescription.type || 'string';
    this.model = {
      strings,
      prefName,
      prefDescription,
      viewData: {
        default: prefDescription.initial || '',
        description: prefDescription.description || '',
        type,
        value,
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
  render(container) {
    const { node, r } = this.view(this.model.viewData, this.model.strings);
    this.refs = r;
    r.node = node;
    r.input.addEventListener('change', this._onChange);

    container.appendChild(node);
    return node;
  },
  _isDefault() {
    return this.model.viewData.default === this.refs.input.value;
  },
  isChanged() {
    return this.model.viewData.value.toString() !== this.refs.input.value;
  },
  save() {
    PreferencesManager.set(this.model.prefName, this.refs.input.value);
  },
  display(show) {
    this.refs.node.classList.toggle('hide', !show);
  },
  detach() {
  }
}, {
  _onChange(e) {
    this._value = e.target.value;
    this.refs.node.classList.toggle('preference-changed', this.isChanged());
  }
});
