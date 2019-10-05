import MenuController from './controllers/menu';
import FilterController from './controllers/filter';
import TripController from './controllers/trip';
import StatisticsController from './controllers/statistics';

import data from './data';

let eventMocks = data.events;

const onDataChange = (events) => {
  eventMocks = events;
  statisticsController.update(events);
};

const onFilterModeChange = (mode) => {
  tripController.setFilterMode(mode);
};

const main = document.querySelector(`.page-main .page-body__container`);
const board = document.querySelector(`.trip-events`);
const controlsContainer = document.querySelector(`.trip-controls`);

const tripController = new TripController(board, onDataChange);

tripController.setOffers(data.offerList);
tripController.setDestinations(data.destionationList);

const statisticsController = new StatisticsController(main, eventMocks);
const filterController = new FilterController(controlsContainer, onFilterModeChange);

const menuController = new MenuController(controlsContainer, tripController, statisticsController, filterController);


filterController.init();
menuController.init();
tripController.show(eventMocks);
statisticsController.init();
