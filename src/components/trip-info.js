import AbstractComponent from './abstract-component';
import {formatDateShort} from '../utils';


class TripInfo extends AbstractComponent {
  constructor({destinations, dateStart, dateEnd}) {
    super();
    this._destinations = destinations || [];
    this._dateStart = dateStart;
    this._dateEnd = dateEnd;
  }

  _getTitle() {
    if (!this._destinations.length) {
      return ``;
    } else if (this._destinations.length === 1) {
      return `${this._destinations[0]}`;
    } else if (this._destinations.length === 2) {
      return `${this._destinations[0]} &mdash; ${this._destinations[1]}`;
    } else if (this._destinations.length === 3) {
      return `${this._destinations[0]} &mdash; ${this._destinations[1]} &mdash; ${this._destinations[2]}`;
    }
    return `${this._destinations[0]} &mdash; ... &mdash; ${this._destinations[this._destinations.length - 1]}`;
  }

  _getTemplate() {
    return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">
        ${this._getTitle()}
      </h1>
      <p class="trip-info__dates">${formatDateShort(this._dateStart)}&nbsp;&mdash;&nbsp;${formatDateShort(this._dateEnd)}</p>
    </div>`;
  }
}

export default TripInfo;
