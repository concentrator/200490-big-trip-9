import AbstractComponent from './abstract-component';
import {convertDateToTime, getformattedDuration} from '../utils';
import {makeFirstLetterUppercase} from '../utils';


class EventView extends AbstractComponent {
  constructor({destination, type, dateStart, dateEnd, duration, price, offers}) {
    super();
    this._destination = destination.name;
    this._type = type;
    this._dateStart = dateStart;
    this._dateEnd = dateEnd;
    this._price = price;
    this._offers = offers;
    this._title = this._getTitle();
    this._duration = duration;
  }

  _getPreposition() {
    return ([`sightseeing`, `restaurant`, `check-in`].some((it) => it === this._type)) ? `in` : `to`;
  }

  _getTitle() {
    return `${makeFirstLetterUppercase(this._type)} ${this._getPreposition()} ${this._destination}`;
  }

  getTemplate() {
    return `
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${this._title}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${new Date(this._dateStart).toISOString()}">${convertDateToTime(this._dateStart)}</time>
            &mdash;
            <time class="event__end-time" datetime="${new Date(this._dateEnd).toISOString()}">${convertDateToTime(this._dateEnd)}</time>
          </p>
          <p class="event__duration">${getformattedDuration(this._duration)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${this._price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${this._offers.map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </li>`).join(``)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
  }
}

export default EventView;
