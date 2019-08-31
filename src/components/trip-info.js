import {createElement} from '../utils';
import {formatDateShort} from '../utils';


class TripInfo {
  constructor({destinations, dateStart, dateEnd}) {
    this._destinations = destinations;
    this._dateStart = dateStart;
    this._dateEnd = dateEnd;
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
    <div class="trip-info__main">
      <h1 class="trip-info__title">
        ${this._destinations[0]} &mdash; ${this._destinations.length < 4 ? this._destinations[1] : `...`} &mdash; ${this._destinations[this._destinations.length - 1]}
      </h1>
      <p class="trip-info__dates">${formatDateShort(this._dateStart)}&nbsp;&mdash;&nbsp;${formatDateShort(this._dateEnd)}</p>
    </div>`;
  }
}

export default TripInfo;
