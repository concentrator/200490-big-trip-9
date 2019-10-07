import AbstractComponent from './abstract-component';
import {formatDateShort} from '../utils';


class TripDay extends AbstractComponent {
  constructor(number, date) {
    super();
    this._number = number;
    this._date = date;
  }

  _getTemplate() {
    return `
    <li class="trip-days__item day">
      <div class="day__info">
        ${this._number ? `<span class="day__counter">${this._number}</span>` : ``}
        ${this._date ? `<time class="day__date"
          datetime="${new Date(this._date).toISOString()}">${formatDateShort(this._date)}</time>` : ``}
      </div>
    <li>`;
  }
}

export default TripDay;
