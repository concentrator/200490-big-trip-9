import {createElement} from '../utils';


class Menu {
  constructor(items) {
    this._items = items;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `
    <nav class="trip-controls__trip-tabs trip-tabs">
      ${this._items.map((item) => `
      <a class="trip-tabs__btn${item.isActive ? ` trip-tabs__btn--active` : ``}"
        href="${item.url ? item.url : `#`}">${item.title}</a>`).join(``)}
    </nav>`;
  }
}

export default Menu;
