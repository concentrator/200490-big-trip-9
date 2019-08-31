import {createElement} from '../utils';
import {makeFirstLetterUppercase} from '../utils';

class Sort {
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
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">

    ${this._items.map(
      (item) => {
        if (!item.isSortable) {
          return `<span class="trip-sort__item trip-sort__item--${item.id}">
            ${makeFirstLetterUppercase(item.id)}</span>`;
        }
        return `
        <div class="trip-sort__item trip-sort__item--${item.id}">
          <input id="sort-${item.id}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${item.id}"${item.isChecked ? ` checked` : ``}>
          <label class="trip-sort__btn" for="sort-${item.id}">
            ${makeFirstLetterUppercase(item.id)}
            <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
              <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
            </svg>
          </label>
        </div>`;
      }).join(``)}

    </form>`;
  }
}

export default Sort;
