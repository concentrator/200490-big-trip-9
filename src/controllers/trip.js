import {render} from '../utils';
import {unrender} from '../utils';
import {Position} from '../utils';

import EventController from './event';

import EventList from '../components/event-list';
import TripDay from '../components/trip-day';
import TripDayList from '../components/trip-day-list';
import TripInfo from '../components/trip-info';
import Sort from '../components/sort';
import Message from '../components/message';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;


class TripController {
  constructor(container, events, offerList, destinationList) {
    this._events = events.length ? this._sortEvents(events) : [];
    this._offerList = offerList;
    this._destinationList = destinationList;
    this._container = container;
    this._sort = new Sort();
    this._tripDayList = new TripDayList();

    this._calculateTrip();

    this._tripInfo = new TripInfo(this._info);

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];
  }

  _calculateTrip() {
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
    return this._events.map((event) => event.destination.name);
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

  _renderEvent(container, event) {
    const eventController =
      new EventController(container, event, this._offerList, this._destinationList, this._onDataChange, this._onChangeView);

    this._subscriptions.push(eventController.setDefaultView.bind(eventController));
  }

  _renderEventList() {
    this._eventsByDays.forEach((day, number) => {
      if (day.events.length) {
        const tripDayElement = new TripDay(number, day.date).getElement();

        const eventsContainer = new EventList().getElement();

        day.events.forEach((event) => {
          this._renderEvent(eventsContainer, event);
        });

        tripDayElement.appendChild(eventsContainer);
        this._tripDayList.getElement().appendChild(tripDayElement);
      }
    });
  }

  _renderEventListSorted() {
    const tripDayElement = new TripDay().getElement();

    const eventsContainer = new EventList().getElement();

    this._events.forEach((event) => {
      this._renderEvent(eventsContainer, event);
    });

    tripDayElement.appendChild(eventsContainer);
    this._tripDayList.getElement().appendChild(tripDayElement);
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
        this._renderEventList();
        break;

      case `time`:
        this._sort.getElement().querySelector(`.trip-sort__item--day`).textContent = ``;
        this._events.sort((a, b) => b.duration - a.duration);
        this._renderEventListSorted();
        break;

      case `price`:
        this._sort.getElement().querySelector(`.trip-sort__item--day`).textContent = ``;
        this._events.sort((a, b) => b.price - a.price);
        this._renderEventListSorted();
        break;
    }
  }

  _onDataChange(newData, oldData) {
    this._events[this._events.findIndex((it) => it === oldData)] = newData;

    this._renderTrip();

    return true;
  }

  _renderTripInfo(container) {
    render(container, this._tripInfo.getElement(), Position.AFTERBEGIN);
    this._tripInfoContainer.querySelector(`.trip-info__cost-value`).textContent = this._info.cost;
  }

  _renderSort() {
    render(this._container, this._sort.getElement(), Position.BEFOREEND);
    this._sort.getElement()
      .addEventListener(`click`, (e) => this._onSortElementClick(e));
  }

  _renderTrip() {
    this._calculateTrip();
    unrender(this._tripInfo.getElement());
    this._tripInfo.removeElement();
    this._tripInfo = new TripInfo(this._info);
    this._renderTripInfo(this._tripInfoContainer);
    this._tripDayList.getElement().innerHTML = ``;
    this._renderEventList();
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  init() {
    const tripMain = document.querySelector(`.trip-main`);
    this._tripInfoContainer = tripMain.querySelector(`.trip-info`);

    if (this._events.length) {

      this._renderTripInfo(this._tripInfoContainer);
      this._renderSort();
      this._renderEventList();

      this._container.appendChild(this._tripDayList.getElement());

    } else {
      const message = new Message(`no-points`);
      render(this._container, message.getElement(), Position.BEFOREEND);
    }
  }
}

export default TripController;
