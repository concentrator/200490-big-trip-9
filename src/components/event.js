import {convertDateToTime} from '../utils';
import {getDateTimeDelta} from '../utils';
import {makeFirstLetterUppercase} from '../utils';
import {getPreposition} from '../utils';

const getEventTitle = (destination, type) => {
  return `${makeFirstLetterUppercase(type)} ${getPreposition(type)} ${destination}`;
};

const makeEventOffersList = (offers) => {
  return `
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offers.filter((it) => it.isSelected).map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>`).join(``)}
  </ul>`;
};

export const makeEvent = ({destination, type, dateStart, dateEnd, price, offers}) => {
  const offersList = offers.length ? makeEventOffersList(offers) : ``;
  const duration = getDateTimeDelta(dateStart, dateEnd);
  return `
  <li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${getEventTitle(destination, type)}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${new Date(dateStart).toISOString()}">${convertDateToTime(dateStart)}</time>
          &mdash;
          <time class="event__end-time" datetime="${new Date(dateEnd).toISOString()}">${convertDateToTime(dateEnd)}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      ${offersList}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
