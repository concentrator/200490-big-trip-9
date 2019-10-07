import {render, Position} from '../utils';
import Statistics from '../components/statistics';

import {EVENT_TYPES} from '../data';

class StatisticsController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._stats = {};
    this._statistics = new Statistics();
    this._init();
  }

  show() {
    this._statistics.getElement().classList.remove(`visually-hidden`);
    this._setEventsDuration();
    this._getStats();
    this._statistics.setStats(this._stats);
  }

  hide() {
    this._statistics.getElement().classList.add(`visually-hidden`);
  }

  setEvents(events) {
    this._events = events;
  }

  _init() {
    render(this._container, this._statistics.getElement(), Position.BEFOREEND);
    this.hide();
  }

  update(events) {
    this._events = events;
  }

  _setEventsDuration() {
    this._events.forEach((event) => {
      event.duration = (event.dateEnd - event.dateStart > 0) ? event.dateEnd - event.dateStart : 0;
    });
  }

  _getStats() {
    const types = new Set(this._events.map((event) => event.type));
    this._stats.money = {};
    this._stats.transport = {};
    this._stats.time = {};
    types.forEach((type) => {
      this._stats.money[type] = this._events.reduce((money, event) => {
        if (event.type === type) {
          money += event.price;

          if (EVENT_TYPES.Transfer.includes(type)) {
            if (!this._stats.transport.hasOwnProperty(type)) {
              this._stats.transport[type] = 0;
            }
            this._stats.transport[type]++;
          }

          if (!this._stats.time.hasOwnProperty(type)) {
            this._stats.time[type] = 0;
          }
          this._stats.time[type] += event.duration;
        }
        return money;
      }, 0);

    });
  }
}

export default StatisticsController;
