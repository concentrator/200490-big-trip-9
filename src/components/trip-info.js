import {formatDateShort} from '../utils';

export const createTripInfoTemplate = ({destinations, dateStart, dateEnd}) => {
  return `
  <div class="trip-info__main">
    <h1 class="trip-info__title">
      ${destinations[0]} &mdash; ${destinations.length < 4 ? destinations[1] : `...`} &mdash; ${destinations[destinations.length - 1]}
    </h1>
    <p class="trip-info__dates">${formatDateShort(dateStart)}&nbsp;&mdash;&nbsp;${formatDateShort(dateEnd)}</p>
  </div>`;
};

export const renderTripCost = (cost) => {
  document.querySelector(`.trip-info__cost-value`).textContent = cost;
};
