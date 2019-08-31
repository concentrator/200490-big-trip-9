import {createElement} from '../utils';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;


class Trip {
  constructor(events) {
    this._events = this._sortEvents(events);
    this._destinations = this._getDestinations();
    this._startDate = this._getStartDate();
    this._endDate = this._getEndDate();
    this._daysList = this._getDaysList();
    this._eventsByDays = this._splitEventsByDays();
    this._totalCost = this._getTotalCost();
    this._element = null;
  }

  _sortEvents(events) {
    return events.sort((a, b) => {
      return a.dateStart - b.dateStart;
    });
  }

  _getDestinations() {
    return this._events.map((event) => event.destination);
  }

  _getStartDate() {
    const dates = this._events.map((event) => Date.parse(new Date(event.dateStart).toDateString()));
    return Math.min(...dates);
  }

  _getEndDate() {
    const dates = this._events.map((event) => Date.parse(new Date(event.dateEnd).toDateString()));
    return Math.max(...dates);
  }

  _getDaysList() {
    const daysCount = 1 + Math.ceil((this._endDate - this._startDate) / (ONE_DAY_MS));
    const days = new Array(daysCount).fill(0);
    days.forEach((d, i) => {
      days[i] = (i === 0) ? this._startDate : days[i - 1] + ONE_DAY_MS;
    });

    days.sort((a, b) => {
      return a - b;
    });

    return days;
  }

  _splitEventsByDays() {
    let eventsList = this._events.slice();

    const eventsByDays = this._daysList.map((day) => {

      let dayEvents = [];
      for (let event of eventsList) {
        if (new Date(event.dateStart).toDateString() === new Date(day).toDateString()) {
          dayEvents.push(event);
        } else {
          eventsList = eventsList.slice(dayEvents.length);
          break;
        }
      }

      return [
        this._daysList.indexOf(day) + 1,
        {
          date: day,
          events: dayEvents
        }
      ];
    });

    return new Map(eventsByDays);
  }

  _getTotalCost() {
    const offersCostTotal = this._events.map((event) => {
      let eventOffersCost = 0;
      if (event.offers.length) {
        eventOffersCost = event.offers.map((offer) => offer.isSelected ? offer.price : 0).reduce((total, current) => total + current);
      }
      return eventOffersCost;
    }).reduce((total, current) => total + current);

    const eventsCostTotal = this._events.map((event) => event.price).reduce((total, current) => total + current);

    return offersCostTotal + eventsCostTotal;
  }

  get info() {
    return {
      destinations: this._destinations,
      dateStart: this._startDate,
      dateEnd: this._endDate,
      cost: this._totalCost
    };
  }

  get eventsByDays() {
    return this._eventsByDays;
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
    return `<ul class="trip-days"></ul>`;
  }
}

export default Trip;
