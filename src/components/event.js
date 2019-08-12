import {convertDateToTime} from '../utils';
import {getDateTimeDelta} from '../utils';

const EVENT_ICON_MAP = {
  taxi: `img/icons/taxi.png`,
  bus: ``,
  train: ``,
  ship: ``,
  transport: ``,
  drive: `img/icons/drive.png`,
  flight: `img/icons/flight.png`,
  check: ``,
  sightseeing: ``,
  restaurant: ``
};

const createEventOfferTemplate = ({title, price}) => {
  return `
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </li>`;
};

const createEventOffersList = (offers) => {
  let list = ``;
  offers.forEach((item) => {
    list += createEventOfferTemplate(item);
  });
  return `<h4 class="visually-hidden">Offers:</h4>\n<ul class="event__selected-offers">${list}\n</ul>`;
};

// const eventParams = {
//   type: ``,
//   title: ``,
//   startTime: ``,
//   endTime: ``,
//   price: 0,
//   offers: []
// };

export const createEventTemplate = ({type, title, startTime, endTime, price, offers}) => {
  const offersList = offers.length ? createEventOffersList(offers) : ``;
  const duration = getDateTimeDelta(startTime, endTime);
  return `
  <li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${EVENT_ICON_MAP[type]}" alt="Event type icon">
      </div>
      <h3 class="event__title">${title}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startTime}">${convertDateToTime(startTime)}</time>
          &mdash;
          <time class="event__end-time" datetime="${endTime}">${convertDateToTime(endTime)}</time>
        </p>
        <p class="event__duration">${duration.hours}H ${duration.minutes}M</p>
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
