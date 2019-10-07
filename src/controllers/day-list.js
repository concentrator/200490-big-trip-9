import {ONE_DAY_MS} from '../utils';
import {SortMode} from './trip';

import EventController, {Mode} from './event';

import TripDayList from '../components/trip-day-list';
import EventList from '../components/event-list';
import TripDay from '../components/trip-day';

import ModelEvent from '../model-event';

class DayListController {
  constructor(container, api, onDataChange, onModeChange) {
    this._container = container;
    this._api = api;
    this._onDataChangeMain = onDataChange;
    this._onModeChange = onModeChange;
    this._creatingEvent = null;
    this._subscriptions = [];
    this._events = [];

    this._tripDayList = new TripDayList();

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  getDayListElement() {
    return this._tripDayList.getElement();
  }

  setOffers(offerList) {
    this._offerList = offerList;
  }

  setDestinations(destinationList) {
    this._destinationList = destinationList;
  }

  setDates(dateStart, dateEnd) {
    this._startDate = dateStart;
    this._endDate = dateEnd;
    this._daysList = this._getDaysList();
  }

  setEvents(events, sortMode) {
    this._events = events;
    this._eventsByDays = this._splitEventsByDays();
    this._subscriptions = [];
    this._tripDayList.getElement().innerHTML = ``;

    if (sortMode === SortMode.DEFAULT) {
      this._renderEventList();
    } else {
      this._renderEventListSorted();
    }
  }

  get isCreatingEvent() {
    if (this._creatingEvent) {
      return true;
    }
    return false;
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    this._onChangeView();

    const defaultEvent = {
      type: `taxi`,
      destination: this._destinationList[0],
      dateStart: Date.now(),
      dateEnd: Date.now(),
      price: 0,
      offers: [],
      isFavorite: false
    };

    this._api.createEvent({event: ModelEvent.toRAW(defaultEvent)})
      .then((event) => {
        defaultEvent.id = event.id;

        this._creatingEvent =
        new EventController(this._container, defaultEvent, Mode.ADDING, this._offerList, this._destinationList, this._onDataChange, this._onChangeView);

        this._subscriptions.unshift(this._creatingEvent.setDefaultView.bind(this._creatingEvent));
        this._onModeChange();
      });


  }

  cancelCreateEvent() {
    this._onChangeView();
  }

  _getDaysList() {
    let days = [];

    if (this._startDate && this._endDate) {
      const daysCount = 1 + Math.floor((this._endDate - this._startDate) / ONE_DAY_MS);
      days = new Array(daysCount).fill(0);
      days.forEach((d, i) => {
        days[i] = (i === 0) ? this._startDate : days[i - 1] + ONE_DAY_MS;
      });
    }
    return days;
  }

  _splitEventsByDays() {
    // Список событий должен быть отсортирован по возрастанию даты,
    // иначе цикл будет работать неправильно
    let eventsList = this._events.slice();

    // Список дней также должен быть по возрастанию (создается так по умолчанию)
    const eventsByDays = this._daysList.map((day) => {
      let dayEvents = [];
      for (let event of eventsList) {
        if (new Date(event.dateStart).setHours(0, 0, 0, 0) === day) {
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

  _renderEvent(container, event) {

    const eventController =
      new EventController(container, event, Mode.DEFAULT, this._offerList, this._destinationList, this._onDataChange, this._onChangeView);

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

  _onDataChange(action, data, cb, favorite) {
    this._onDataChangeMain(action, data, cb, favorite);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());

    if (this._creatingEvent) {
      this._creatingEvent = null;
      this._subscriptions.shift();
      this._onModeChange();
    }
  }
}


export default DayListController;
