import AbstractComponent from './abstract-component';
import {convertDateToTime} from '../utils';
import {makeFirstLetterUppercase} from '../utils';

const ONE_HOUR_SEC = 60 * 60;
const ONE_DAY_SEC = 24 * 60 * 60;


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

  _getformattedDuration() {
    let delta = parseInt((this._duration) / 1000, 10);

    let days = Math.floor(delta / ONE_DAY_SEC);
    let hours = Math.floor((delta - days * ONE_DAY_SEC) / ONE_HOUR_SEC);
    let minutes = Math.round((delta - days * ONE_DAY_SEC - hours * ONE_HOUR_SEC) / 60);

    days = days < 10 ? `0${days}D` : `${days}D`;
    hours = `0${hours}H`.slice(-3);
    minutes = `0${minutes}M`.slice(-3);

    let duration = ``;

    if (delta >= ONE_DAY_SEC) {
      duration = `${days} ${hours} ${minutes}`;
    } else if (delta < ONE_DAY_SEC && delta >= ONE_HOUR_SEC) {
      duration = `${hours} ${minutes}`;
    } else {
      duration = `${minutes}`;
    }

    return duration;
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
          <p class="event__duration">${this._getformattedDuration()}</p>
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
