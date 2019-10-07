import cloneDeep from 'lodash.clonedeep';

import {render, unrender, Position} from '../utils';

import TripInfo from '../components/trip-info';
import Sort from '../components/sort';
import Message, {MessageType} from '../components/message';

import DayListController from './day-list';

export const SortMode = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export const FilterMode = {
  DEFAULT: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

class TripController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._events = [];
    this._offerList = [];
    this._destinationList = [];
    this._isCreatingEvent = false;
    this._sortMode = SortMode.DEFAULT;
    this._filterMode = FilterMode.DEFAULT;
    this._tripInfo = new TripInfo({});
    this._sort = new Sort();
    this._onDataChange = this._onDataChange.bind(this);
    this._onModeChange = this._onModeChange.bind(this);
    this._dayListController = new DayListController(this._container, this._onDataChange, this._onModeChange);
    this._init();
  }

  setFilterMode(mode) {
    this._filterMode = mode;
    this._setEvents();
  }

  _init() {
    const mainHeader = document.querySelector(`.trip-main`);
    this._tripInfoContainer = mainHeader.querySelector(`.trip-info`);
    this._renderSort();
    render(this._container, this._dayListController.getDayListElement(), Position.BEFOREEND);
  }

  get isCreatingEvent() {
    return this._isCreatingEvent;
  }

  _filterEvents() {
    if (this._filterMode === FilterMode.DEFAULT) {
      return;
    }
    if (this._filterMode === FilterMode.FUTURE) {
      this._eventsProcessed = this._eventsProcessed.filter((event) => {
        return event.dateStart > Date.now();
      });
    }

    if (this._filterMode === FilterMode.PAST) {
      this._eventsProcessed = this._eventsProcessed.filter((event) => {
        return event.dateStart <= Date.now();
      });
    }
  }

  _onModeChange() {
    if (this._dayListController.isCreatingEvent) {
      if (this._isNoEvents()) {
        this._removeMessage();
      }
      this._isCreatingEvent = true;
    } else {
      if (this._isNoEvents()) {
        this._showMessage(MessageType.NO_EVENTS);
      }
      this._isCreatingEvent = false;
    }
    this._onButtonModeChange();
  }

  setOffers(offerList) {
    this._offerList = offerList;
    this._dayListController.setOffers(offerList);
  }

  setDestinations(destinationList) {
    this._destinationList = destinationList;
    this._dayListController.setDestinations(destinationList);
  }

  show(events = this._events) {
    if (events !== this._events) {
      this._setEvents(events);
    }
    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  createEvent(onButtonModeChange) {
    this._dayListController.createEvent();
    if (!this._onButtonModeChange) {
      this._onButtonModeChange = onButtonModeChange;
    }
    this._onModeChange();
  }

  cancelCreateEvent() {
    this._dayListController.cancelCreateEvent();
  }

  _setEvents(events = this._events) {
    this._events = events;
    this._eventsProcessed = cloneDeep(this._events);
    // this._eventsProcessed = this._events.slice().map((event) => cloneDeep(event));
    this._calculateTrip();
    this._sortEvents();
    this._filterEvents();
    this._renderTrip();
  }

  _isNoEvents() {
    if (this._eventsProcessed.length === 0) {
      return true;
    }
    return false;
  }

  _calculateTrip() {
    this._setEventsDuration();
    this._destinations = this._getDestinations();
    this._startDate = this._getStartDate();
    this._endDate = this._getEndDate();
    this._dayListController.setDates(this._startDate, this._endDate);
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
  }

  _onSortInputChange(e) {

    const sortMode = e.target.id.split(`-`)[1];

    if (e.target.nodeName !== `INPUT` || sortMode === this._sortMode) {
      return;
    }

    this._sortMode = sortMode;
    this._sortEvents();
    this._dayListController.setEvents(this._eventsProcessed, sortMode);
  }

  _renderTripInfo(container) {
    render(container, this._tripInfo.getElement(), Position.AFTERBEGIN);
    this._tripInfoContainer.querySelector(`.trip-info__cost-value`).textContent = this._info.cost;
  }

  _renderSort() {
    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    this._sort.getElement()
      .addEventListener(`change`, (e) => this._onSortInputChange(e));
  }

  _showMessage(type) {
    this._message = new Message(type);
    render(this._container, this._message.getElement(), Position.BEFOREEND);
  }

  _removeMessage() {
    if (this._message) {
      unrender(this._message.getElement());
      this._message.removeElement();
      this._message = null;
    }
  }

  // _onDataChange(newData, oldData) {
  //   const index = this._events.indexOf(oldData);

  //   if (newData === null) {
  //     this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
  //   } else if (oldData === null) {
  //     this._events = [newData, ...this._events];
  //   } else {
  //     this._events[index] = newData;
  //   }

  //   this._setEvents();

  //   this._onDataChangeMain(this._events);
  //   // return true;
  // }

  _onDataChange(action, data) {
    // const index = this._events.indexOf(oldData);

    // if (newData === null) {
    //   this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
    // } else if (oldData === null) {
    //   this._events = [newData, ...this._events];
    // } else {
    //   this._events[index] = newData;
    // }

    // this._setEvents();

    this._onDataChangeMain(action, data);
    // return true;
  }

  _renderTrip() {

    if (!this._isNoEvents()) {

      this._removeMessage();

      if (this._tripInfo) {
        unrender(this._tripInfo.getElement());
        this._tripInfo.removeElement();
      }
      this._tripInfo = new TripInfo(this._info);
      this._renderTripInfo(this._tripInfoContainer);

      if (!this._container.contains(this._sort.getElement())) {
        render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
      }

      if (!this._container.contains(this._dayListController.getDayListElement())) {
        render(this._container, this._dayListController.getDayListElement(), Position.BEFOREEND);
      }

    } else {
      unrender(this._sort.getElement());
      unrender(this._dayListController.getDayListElement());
      this._showMessage(MessageType.NO_EVENTS);
    }

    this._dayListController.setEvents(this._eventsProcessed, this._sortMode);
  }
}

export default TripController;
