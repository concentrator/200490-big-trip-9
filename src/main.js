import MenuController from './controllers/menu';
import FilterController from './controllers/filter';
import TripController from './controllers/trip';
import StatisticsController from './controllers/statistics';
import ModelEvent from './model-event';
import API from './api';

const AUTHORIZATION = `Basic eo1359sfiek29889a=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;


const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const onDataChange = (action, event) => {
  switch (action) {
    case `update`:
      api.updateEvent({
        id: event.id,
        data: ModelEvent.toRAW(event)
      }).then(() => api.getEvents().then((events) => {
        tripController.show(events);
      }));

      break;
  }
};

const onFilterModeChange = (mode) => {
  tripController.setFilterMode(mode);
};

const main = document.querySelector(`.page-main .page-body__container`);
const board = document.querySelector(`.trip-events`);
const controlsContainer = document.querySelector(`.trip-controls`);

const tripController = new TripController(board, onDataChange);

const statisticsController = new StatisticsController(main);
const filterController = new FilterController(controlsContainer, onFilterModeChange);

const menuController = new MenuController(controlsContainer, tripController, statisticsController, filterController);


filterController.init();
menuController.init();

let offerList = null;
let destionationList = null;

api.getOffers().then((offers) => {
  offerList = offers;
  tripController.setOffers(offerList);
});

api.getDestinations().then((destionations) => {
  destionationList = destionations;
  tripController.setDestinations(destionationList);
});

api.getEvents().then((events) => {
  tripController.show(events);
  statisticsController.setEvents(events);
});

