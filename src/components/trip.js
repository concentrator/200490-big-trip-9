import {render} from '../utils';
import {createElement} from '../utils';
import {createTripDayTemplate} from './trip-day';
import {createEventTemplate} from './event';
import {createEventEditTemplate} from './event-edit';

const tripDaysList = createElement(`ul`, `trip-days`);

const eventsList = createElement(`ul`, `trip-events__list`);

render(eventsList, `beforeend`, createEventEditTemplate);

export const renderTripDayList = (data) => {
  data.forEach((day) => {
    render(tripDaysList, `beforeend`, createTripDayTemplate, day);
    const tripDay = tripDaysList.querySelector(`.trip-days__item`);
    day.events.forEach((event) => {
      render(eventsList, `beforeend`, createEventTemplate, event);
    });
    tripDay.appendChild(eventsList);
  });
  return tripDaysList;
};
