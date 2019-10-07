import MenuController from './controllers/menu';
import FilterController from './controllers/filter';
import TripController from './controllers/trip';
import StatisticsController from './controllers/statistics';
import ModelEvent from './model-event';
import API from './api';

const AUTHORIZATION = `Basic eo1359sfiek29889a=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;


const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});


const onDataChange = (action, event, cb) => {
  switch (action) {
    case `update`:
      api.updateEvent({
        id: event.id,
        data: ModelEvent.toRAW(event)
      }).then(() => api.getEvents().then((events) => {
        tripController.show(events);

      })).catch(() => cb());
      break;

    case `delete`:
      api.deleteEvent({
        id: event.id,
      }).then(() => api.getEvents().then((events) => {
        tripController.show(events);
      })).catch(() => cb());
      break;
  }
};

const onFilterModeChange = (mode) => {
  tripController.setFilterMode(mode);
};

const main = document.querySelector(`.page-main .page-body__container`);
const board = document.querySelector(`.trip-events`);
const controlsContainer = document.querySelector(`.trip-controls`);

const tripController = new TripController(board, api, onDataChange);

const statisticsController = new StatisticsController(main);
const filterController = new FilterController(controlsContainer, onFilterModeChange);

const menuController = new MenuController(controlsContainer, tripController, statisticsController, filterController);


filterController.init();
menuController.init();


api.getOffers().then((offers) => {
  tripController.setOffers(offers);

  api.getDestinations().then((destionations) => {
    tripController.setDestinations(destionations);

    api.getEvents().then((events) => {
      tripController.show(events);
      statisticsController.setEvents(events);
    });
  });
});
