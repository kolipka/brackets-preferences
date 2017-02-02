import createComponent from 'redom';

export default createComponent({
  create(label) {
    this.model = {
      label
    };
  },
  view(label) {
    return <li title={label}><a ref="btn" href="#">{label}</a></li>;
  },
  render(container) {
    const { node, r } = this.view(this.model.label);
    this.refs = r;

    r.btn.addEventListener('click', this._onClick);
    container.appendChild(node);
    this.container = container;
    return node;
  },
  _destroy() {
    this.r.btn.removeEventListener('click', this._onClick);
  },
  activate(state) {
    this.refs.btn.parentElement.classList.toggle('active', state);
  }
}, {
  _onClick() {
    this.trigger('click', this.model.label);
  }
});
