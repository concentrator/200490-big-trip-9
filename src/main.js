import {render, Position} from './utils';

import Filter from './components/filter';

import MenuController from './controllers/menu';
import TripController from './controllers/trip';
import StatisticsController from './controllers/statistics';

import data from './data';


const main = document.querySelector(`.page-main .page-body__container`);
const board = document.querySelector(`.trip-events`);
const tripControls = document.querySelector(`.trip-controls`);


const filter = new Filter(data.FilterItems);

const tripController = new TripController(board);

tripController.setOffers(data.offerList);
tripController.setDestinations(data.destionationList);

const statisticsController = new StatisticsController(main);

const menuController = new MenuController(tripControls, data.MenuItems, tripController, statisticsController);

render(tripControls, filter.getElement(), Position.BEFOREEND);

menuController.init();
tripController.show(data.events);
statisticsController.init();
