import {render} from '../utils';
import {Position} from '../utils';

import Event from '../components/event';
import EventEdit from '../components/event-edit';
import EventList from '../components/event-list';
import TripDay from '../components/trip-day';
import TripDayList from '../components/trip-day-list';
import TripInfo from '../components/trip-info';
import Sort from '../components/sort';
import Message from '../components/message';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;


class TripController {
  constructor(container, events) {
    this._events = events.length ? this._sortEvents(events) : [];
    this._container = container;
    this._sort = new Sort();
    this._tripDayList = new TripDayList();

    this._destinations = this._getDestinations();
    this._startDate = this._getStartDate();
    this._endDate = this._getEndDate();
    this._daysList = this._getDaysList();
    this._eventsByDays = this._splitEventsByDays();
    this._totalCost = this._getTotalCost();
    this._info = this._getInfo();
  }

  _sortEvents(events) {
    return events.slice().sort((a, b) => {
      return a.dateStart - b.dateStart;
    });
  }

  _getDestinations() {
    return this._events.map((event) => event.destination);
  }

  _getStartDate() {
    const dates = this._events.map((event) => Date.parse(new Date(event.dateStart).toDateString()));
    if (dates.length) {
      return Math.min(...dates);
    }
    return null;
  }

  _getEndDate() {
    const dates = this._events.map((event) => Date.parse(new Date(event.dateEnd).toDateString()));
    if (dates.length) {
      return Math.max(...dates);
    }
    return null;
  }

  _getDaysList() {
    let days = [];
    if (this._startDate && this._endDate) {
      const daysCount = 1 + Math.ceil((this._endDate - this._startDate) / (ONE_DAY_MS));
      days = new Array(daysCount).fill(0);
      days.forEach((d, i) => {
        days[i] = (i === 0) ? this._startDate : days[i - 1] + ONE_DAY_MS;
      });

      days.sort((a, b) => {
        return a - b;
      });
    }
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

  _listEventsInOneDay() {
    const eventsByDays = [
      0,
      {
        date: 0,
        events: this._events
      }
    ];
    return new Map([eventsByDays]);
  }

  _clearDayColumn() {
    const daySort = this._sort.getElement().querySelector(`.trip-sort__item--day`);
    daySort.innerHTML = ``;
    const dayInfo = this._tripDayList.getElement().querySelector(`.day__info`);
    dayInfo.innerHTML = ``;
  }

  _getTotalCost() {
    return this._events.map((event) => {
      return event.price + event.offers.map((offer) => offer.isSelected ? offer.price : 0).reduce((total, current) => total + current, 0);
    }).reduce((total, current) => total + current, 0);
  }

  _getInfo() {
    return {
      destinations: this._destinations,
      dateStart: this._startDate,
      dateEnd: this._endDate,
      cost: this._totalCost
    };
  }

  _renderTripInfo(container) {
    const tripInfo = new TripInfo(this._info);
    render(container, tripInfo.getElement(), Position.AFTERBEGIN);
  }

  _renderEvent(container, event) {
    const eventComponent = new Event(event);
    const eventEditComponent = new EventEdit(event);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        container.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    eventEditComponent.getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, (e) => {
        e.preventDefault();
        container.replaceChild(event.getElement(), eventEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(container, eventComponent.getElement(), Position.BEFOREEND);
  }

  _renderEventList(container) {
    this._eventsByDays.forEach((day, number) => {
      if (day.events.length) {
        const tripDayElement = new TripDay(number, day.date).getElement();

        const eventsContainer = new EventList().getElement();

        day.events.forEach((event) => {
          this._renderEvent(eventsContainer, event);
        });

        tripDayElement.appendChild(eventsContainer);
        container.appendChild(tripDayElement);
      }
    });
  }

  _onSortElementClick(e) {

    if (!e.target.classList.contains(`trip-sort__btn`)) {
      return;
    }

    this._tripDayList.getElement().innerHTML = ``;

    switch (e.target.htmlFor.split(`-`)[1]) {
      case `event`:
        this._sort.getElement().querySelector(`.trip-sort__item--day`).textContent = `Day`;
        this._events.sort((a, b) => a.dateStart - b.dateStart);
        this._eventsByDays = this._splitEventsByDays();
        this._renderEventList(this._tripDayList.getElement());
        break;

      case `time`:
        this._events.sort((a, b) => b.duration - a.duration);
        this._eventsByDays = this._listEventsInOneDay();
        this._renderEventList(this._tripDayList.getElement());
        this._clearDayColumn();
        break;

      case `price`:
        this._events.sort((a, b) => b.price - a.price);
        this._eventsByDays = this._listEventsInOneDay();
        this._renderEventList(this._tripDayList.getElement());
        this._clearDayColumn();
        break;
    }
  }

  init() {
    const tripMain = document.querySelector(`.trip-main`);
    const tripInfoContainer = tripMain.querySelector(`.trip-info`);

    if (this._events.length) {

      this._renderTripInfo(tripInfoContainer);

      tripInfoContainer.querySelector(`.trip-info__cost-value`).textContent = this._info.cost;

      render(this._container, this._sort.getElement(), Position.BEFOREEND);

      this._sort.getElement()
        .addEventListener(`click`, (e) => this._onSortElementClick(e));

      this._renderEventList(this._tripDayList.getElement());

      this._container.appendChild(this._tripDayList.getElement());

    } else {
      const message = new Message(`no-points`);
      render(this._container, message.getElement(), Position.BEFOREEND);
    }
  }
}

export default TripController;
