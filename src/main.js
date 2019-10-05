import {render, Position} from './utils';

import Filter from './components/filter';

import MenuController from './controllers/menu';
import TripController from './controllers/trip';
import StatisticsController from './controllers/statistics';

import data from './data';

let eventMocks = data.events;

const onDataChange = (events) => {
  eventMocks = events;
  statisticsController.update(events);
};

const main = document.querySelector(`.page-main .page-body__container`);
const board = document.querySelector(`.trip-events`);
const tripControls = document.querySelector(`.trip-controls`);


const filter = new Filter(data.FilterItems);

const tripController = new TripController(board, onDataChange);

tripController.setOffers(data.offerList);
tripController.setDestinations(data.destionationList);

const statisticsController = new StatisticsController(main, eventMocks);

const menuController = new MenuController(tripControls, data.MenuItems, tripController, statisticsController);

render(tripControls, filter.getElement(), Position.BEFOREEND);

menuController.init();
tripController.show(eventMocks);
statisticsController.init();
