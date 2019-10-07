import AbstractComponent from './abstract-component';
import {makeFirstLetterUppercase} from '../utils';


class Filter extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
  }

  _getTemplate() {
    return `
    <form class="trip-filters" action="#" method="get">
    ${this._items.map((item) => `
      <div class="trip-filters__filter">
        <input id="filter-${item.id}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${item.id}"${item.isChecked ? ` checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${item.id}">${makeFirstLetterUppercase(item.id)}</label>
      </div>`).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }
}

export default Filter;
