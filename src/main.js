import {render} from './utils';
import {Position} from './utils';

import TripInfo from './components/trip-info';
import Menu from './components/menu';
import Filter from './components/filter';
import Sort from './components/sort';

import Event from './components/event';
import EventEdit from './components/event-edit';
import EventsList from './components/events-list';
import TripDay from './components/trip-day';
import Trip from './components/trip';

import data from './data';


const tripInfoContainer = document.querySelector(`.trip-info`);
const tripControls = document.querySelector(`.trip-controls`);

const renderTripInfo = (tripinfo, container) => {
  const tripInfo = new TripInfo(tripinfo);
  render(container, tripInfo.getElement(), Position.AFTERBEGIN);
};

const renderMenu = (menuItems, container) => {
  const menu = new Menu(menuItems);
  render(container, menu.getElement(), Position.AFTERFIRST);
};

const renderFilter = (filterItems, container) => {
  const filter = new Filter(filterItems);
  render(container, filter.getElement(), Position.BEFOREEND);
};

const renderSort = (sortItems, container) => {
  const sort = new Sort(sortItems);
  render(container, sort.getElement(), Position.BEFOREEND);
};

const renderEvent = (eventData, container) => {
  const event = new Event(eventData);
  const eventEdit = new EventEdit(eventData);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      container.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  event.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, (e) => {
      e.preventDefault();
      container.replaceChild(eventEdit.getElement(), event.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  eventEdit.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, (e) => {
      e.preventDefault();
      container.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  eventEdit.getElement()
    .querySelector(`.event--edit`)
    .addEventListener(`submit`, (e) => {
      e.preventDefault();
      container.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  render(container, event.getElement(), Position.BEFOREEND);
};

const renderEventsList = (tripDays, container) => {

  tripDays.forEach((day, number) => {
    if (day.events.length) {
      const tripDayItem = new TripDay(number, day.date).getElement();

      const eventsContainer = new EventsList().getElement();

      day.events.forEach((event) => {
        renderEvent(event, eventsContainer);
      });

      tripDayItem.appendChild(eventsContainer);
      container.appendChild(tripDayItem);
    }
  });
};

const board = document.querySelector(`.trip-events`);

const trip = new Trip(data.events);

const tripDaysList = trip.getElement();

renderTripInfo(trip.info, tripInfoContainer);
renderMenu(data.MenuItems, tripControls);
renderFilter(data.FilterItems, tripControls);
renderSort(data.SortItems, board);
renderEventsList(trip.eventsByDays, tripDaysList);


board.appendChild(tripDaysList);

document.querySelector(`.trip-info__cost-value`).textContent = trip.info.cost;

