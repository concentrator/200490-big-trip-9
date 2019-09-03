import AbstractComponent from './abstract-component';


class Menu extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
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
