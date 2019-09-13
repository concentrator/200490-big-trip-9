import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/airbnb.css';

import AbstractComponent from './abstract-component';
import {makeFirstLetterUppercase} from '../utils';
import {unrender} from '../utils';
import data from '../data';


class EventEdit extends AbstractComponent {
  constructor({offerList, destinationList, destination, type, dateStart, dateEnd, price, offers, isFavorite}) {
    super();
    this._type = type;
    this._destination = destination;
    this._dateStart = dateStart;
    this._dateEnd = dateEnd;
    this._price = price;
    this._offers = offers;
    this._offerList = offerList;
    this._destinationList = destinationList;
    this._isFavorite = isFavorite;
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    this._initFlatpickr();
  }

  _initFlatpickr() {
    const startInput = this.getElement().querySelector(`#event-start-time-1`);
    const endInput = this.getElement().querySelector(`#event-end-time-1`);

    this._calendarStart = flatpickr(startInput, {
      "minDate": Date.now(),
      "altFormat": `d.m.Y H:i`,
      "enableTime": true,
      "time_24hr": true,
      "altInput": true,
      "onClose": () => {
        document.activeElement.blur();
      },
      // "allowInput": true,
      "defaultDate": this._dateStart,
      "onChange": (selectedDates) => {
        if (Date.parse(selectedDates[0]) > Date.parse(this._calendarEnd.selectedDates[0])) {
          this._calendarEnd.setDate(selectedDates[0]);
        }
        this._calendarEnd.config.minDate = selectedDates[0];
      },
    });

    this._calendarEnd = flatpickr(endInput, {
      "minDate": startInput.value,
      "altFormat": `d.m.Y H:i`,
      "enableTime": true,
      "time_24hr": true,
      "altInput": true,
      "onClose": () => {
        document.activeElement.blur();
      },
      // "allowInput": true,
      "defaultDate": this._dateEnd,
    });
  }

  destroyCalendar() {
    if (this._calendarStart || this._calendarEnd) {
      this._calendarStart.destroy();
      this._calendarEnd.destroy();
    }
  }

  _formatDate(date) {
    return new Date(date).toLocaleString(`en-GB`, {year: `numeric`, month: `2-digit`, day: `2-digit`, hour: `2-digit`, minute: `2-digit`}).replace(`,`, ``).replace(/\//g, `.`);
  }

  _getPreposition(type) {
    return ([`sightseeing`, `restaurant`, `check-in`].some((it) => it === type)) ? `in` : `to`;
  }

  _getTypeSelectorTemplate(type) {
    return `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${this._type === type ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
        ${makeFirstLetterUppercase(type)}
      </label>
    </div>`;
  }

  _getOffersTemplate(offerList, offers) {
    return `
    <section class="event__section  event__section--offers">

      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offerList.map((offer, index) => `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-${index}" ${offers.some((it) => it === offer) ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${index}">
            <span class="event__offer-title">${offer.name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`).join(`\n`)}
      </div>
    </section>`;
  }

  _getDestinationTemplate(destination) {
    return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join(`\n`)}
        </div>
      </div>
    </section>`;
  }

  renderOffers(offerList, offers = []) {
    if (this.getElement().querySelector(`.event__section--offers`)) {
      unrender(this.getElement().querySelector(`.event__section--offers`));
    }
    if (!offerList.length) {
      return;
    }
    this.getElement().querySelector(`.event__details`).insertAdjacentHTML(`afterbegin`, this._getOffersTemplate(offerList, offers));
  }

  renderDestination(destination) {
    if (this.getElement().querySelector(`.event__section--destination`)) {
      unrender(this.getElement().querySelector(`.event__section--destination`));
    }
    this.getElement().querySelector(`.event__details`).insertAdjacentHTML(`beforeend`, this._getDestinationTemplate(destination));
  }

  getTemplate() {
    return `
    <li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${data.EVENT_TYPES.Transfer.map((type) => this._getTypeSelectorTemplate(type)).join(``)}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${data.EVENT_TYPES.Activity.map((type) => this._getTypeSelectorTemplate(type)).join(``)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${makeFirstLetterUppercase(this._type)} ${this._getPreposition(this._type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._destination.name}" list="destination-list-1" autocomplete="off">
            <datalist id="destination-list-1">
              ${this._destinationList.map((destination) => `
              <option value="${destination.name}"></option>`)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._formatDate(this._dateStart)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._formatDate(this._dateEnd)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          ${this._offerList.length ? this._getOffersTemplate(this._offerList, this._offers) : ``}

          ${this._getDestinationTemplate(this._destination)}

        </section>
      </form>
    </li>`;
  }
}

export default EventEdit;
