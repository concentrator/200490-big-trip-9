import cloneDeep from 'lodash.clonedeep';

import {render, unrender, Position} from '../utils';

import TripInfo from '../components/trip-info';
import Sort from '../components/sort';
import Message from '../components/message';
import DayListController from './day-list';

export const SortMode = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`
};

class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._offerList = [];
    this._destinationList = [];
    this._sortMode = SortMode.DEFAULT;

    this._tripInfo = new TripInfo({});
    this._sort = new Sort();

    this._onDataChange = this._onDataChange.bind(this);

    this._dayListController = new DayListController(this._container, this._onDataChange);

    this._init();
  }

  _init() {
    const tripMain = document.querySelector(`.trip-main`);
    this._tripInfoContainer = tripMain.querySelector(`.trip-info`);
    this._renderSort();
  }

  setOffers(offerList) {
    this._offerList = offerList;
    this._dayListController.setOffers(offerList);
  }

  setDestinations(destinationList) {
    this._destinationList = destinationList;
    this._dayListController.setDestinations(destinationList);
  }

  show(events) {
    if (events !== this._events) {
      this._setEvents(events);
    }
    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  createEvent() {
    this._dayListController.createEvent();
  }

  _setEvents(events) {
    this._events = events;
    this._eventsProcessed = this._events.slice().map((event) => cloneDeep(event));
    this._calculateTrip();
    this._sortEvents();
    this._renderTrip();
  }

  _calculateTrip() {
    this._setEventsDuration();
    this._destinations = this._getDestinations();
    this._startDate = this._getStartDate();
    this._endDate = this._getEndDate();
    this._dayListController.setDates(this._startDate, this._endDate);
    // this._daysList = this._getDaysList();
    // this._eventsByDays = this._splitEventsByDays();
    this._totalCost = this._getTotalCost();
    this._info = this._getInfo();
  }

  _getDestinations() {
    return this._events.map((event) => event.destination.name);
  }

  _setEventsDuration() {
    this._eventsProcessed.forEach((event) => {
      event.duration = (event.dateEnd - event.dateStart > 0) ? event.dateEnd - event.dateStart : 0;
    });
  }

  // _getEventDuration(event) {
  //   return (event.dateEnd - event.dateStart > 0) ? event.dateEnd - event.dateStart : 0;
  // }

  _getStartDate() {
    const dates = this._events.map((event) => new Date(event.dateStart).setHours(0, 0, 0, 0));
    if (dates.length) {
      return Math.min(...dates);
    }
    return null;
  }

  _getEndDate() {
    const dates = this._events.map((event) => new Date(event.dateEnd).setHours(0, 0, 0, 0));
    if (dates.length) {
      return Math.max(...dates);
    }
    return null;
  }

  _getTotalCost() {
    return this._events.map((event) => {
      return event.price + event.offers.map((offer) => offer.price).reduce((total, current) => total + current, 0);
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

  _sortEventsByDefault() {
    this._eventsProcessed.sort((a, b) => a.dateStart - b.dateStart);
  }

  _sortEventsByDuration() {
    this._eventsProcessed.sort((a, b) => b.duration - a.duration);
  }

  _sortEventsByPrice() {
    this._eventsProcessed.sort((a, b) => b.price - a.price);
  }

  _sortEvents() {
    switch (this._sortMode) {
      case SortMode.DEFAULT:
        this._sortEventsByDefault();
        break;
      case SortMode.TIME:
        this._sortEventsByDuration();
        break;
      case SortMode.PRICE:
        this._sortEventsByPrice();
        break;
    }
  }

  _onSortInputChange(e) {

    const mode = e.target.id.split(`-`)[1];

    if (e.target.nodeName !== `INPUT` || mode === this._sortMode) {
      return;
    }

    this._sortMode = mode;
    switch (mode) {
      case SortMode.DEFAULT:
        this._sort.showDay();
        this._sortEventsByDefault();
        break;

      case SortMode.TIME:
        this._sort.hideDay();
        this._sortEventsByDuration();
        break;

      case SortMode.PRICE:
        this._sort.hideDay();
        this._sortEventsByPrice();
        break;
    }
    this._dayListController.setEvents(this._eventsProcessed, mode);
  }

  _onDataChange(events) {
    this._setEvents(events);
    // return true;
  }

  _renderTripInfo(container) {
    render(container, this._tripInfo.getElement(), Position.AFTERBEGIN);
    this._tripInfoContainer.querySelector(`.trip-info__cost-value`).textContent = this._info.cost;
  }

  _renderSort() {
    render(this._container, this._sort.getElement(), Position.BEFOREEND);
    this._sort.getElement()
      .addEventListener(`change`, (e) => this._onSortInputChange(e));
  }

  _renderTrip() {

    if (this._eventsProcessed.length) {

      if (this._message) {
        unrender(this._message.getElement());
        this._message.removeElement();
        this._message = null;
      }

      // this._calculateTrip();

      if (this._tripInfo) {
        unrender(this._tripInfo.getElement());
        this._tripInfo.removeElement();
      }
      this._tripInfo = new TripInfo(this._info);
      this._renderTripInfo(this._tripInfoContainer);

      // console.log(this._tripDayList)
      // if (this._tripDayList) {

      // }

      this._dayListController.setEvents(this._eventsProcessed, this._sortMode);
      // if (this._sortMode === SortMode.DEFAULT) {
      //   this._renderEventList();
      // } else {
      //   this._renderEventListSorted();
      // }

      if (!this._container.contains(this._dayListController.getDayListElement())) {
        this._container.appendChild(this._dayListController.getDayListElement());
      }

    } else {
      this._message = new Message(`no-points`);
      render(this._container, this._message.getElement(), Position.BEFOREEND);
    }

    // this._calculateTrip();
    // unrender(this._tripInfo.getElement());
    // this._tripInfo.removeElement();
    // this._tripInfo = new TripInfo(this._info);
    // this._renderTripInfo(this._tripInfoContainer);
    // this._tripDayList.getElement().innerHTML = ``;
    // this._subscriptions = [];
    // if (!this._eventsSorted) {
    //   this._renderEventList();
    // } else {
    //   this._renderEventListSorted();
    // }
  }
}

export default TripController;
