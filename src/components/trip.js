import {render} from '../utils';
import {createElement} from '../utils';
import {makeTripDay} from './trip-day';
import {makeEvent} from './event';
import {makeEventEdit} from './event-edit';

const tripDaysContainer = createElement(`ul`, `trip-days`);

const getMinMaxDates = (events) => {
  const startDates = events.map((event) => new Date(new Date(event.dateStart).toDateString()));
  const endDates = events.map((event) => new Date(new Date(event.dateEnd).toDateString()));
  return {
    min: Math.min.call(null, ...startDates),
    max: Math.max.call(null, ...endDates)
  };
};

const getTripCost = (events) => {
  const offersCost = events.filter((event) => event.offers.length).map((event) => {
    return event.offers.map((offer) => offer.isSelected ? offer.price : 0).reduce((total, current) => total + current);
  }).reduce((total, current) => total + current);

  return offersCost + events.map((event) => event.price).reduce((total, current) => total + current);
};

export const makeTrip = (events) => {

  const date = getMinMaxDates(events);
  const daysCount = 1 + Math.ceil((date.max - date.min) / (24 * 60 * 60 * 1000));
  const days = new Array(daysCount).fill(0);

  days.forEach((d, i) => {
    days[i] = (i === 0) ? date.min : days[i - 1] + 24 * 60 * 60 * 1000;
  });

  let eventsList = events.slice();

  days.sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  eventsList.sort((a, b) => {
    return a.dateStart - b.dateStart;
  });

  const destinations = eventsList.map((event) => event.destination);
  const tripCost = getTripCost(eventsList);

  const tripDays = days.map((day) => {
    let dayEvents = [];
    for (let event of eventsList) {
      if (new Date(event.dateStart).toDateString() === new Date(day).toDateString()) {
        dayEvents.push(event);
      } else {
        eventsList = eventsList.slice(dayEvents.length);
        break;
      }
    }
    return {
      number: days.indexOf(day) + 1,
      date: day,
      events: dayEvents
    };

  });

  return {
    info: {
      dateStart: date.min,
      dateEnd: date.max,
      destinations,
      cost: tripCost
    },
    days: tripDays
  };
};

export const renderTripDayList = (tripDays, init = false) => {
  tripDays.forEach((day, dayIndex) => {
    if (day.events.length) {
      const eventsContainer = createElement(`ul`, `trip-events__list`);
      const tripDayItem = createElement(`li`, `trip-days__item day`);
      render(tripDayItem, `beforeend`, makeTripDay, day);
      day.events.forEach((event, eventIndex) => {
        if (init && dayIndex === 0 && eventIndex === 0) {
          render(eventsContainer, `beforeend`, makeEventEdit, event);
        } else {
          render(eventsContainer, `beforeend`, makeEvent, event);
        }
      });
      tripDayItem.appendChild(eventsContainer);
      tripDaysContainer.appendChild(tripDayItem);
    }
  });

  return tripDaysContainer;
};
