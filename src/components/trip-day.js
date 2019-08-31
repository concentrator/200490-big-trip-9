import {createElement} from '../utils';
import {formatDateShort} from '../utils';


class TripDay {
  constructor(number, date) {
    this._number = number;
    this._date = date;
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
    <li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${this._number}</span>
        <time class="day__date" datetime="${new Date(this._date).toISOString()}">${formatDateShort(this._date)}</time>
      </div>
    <li>`;
  }
}

export default TripDay;
