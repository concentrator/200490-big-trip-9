import {render} from './utils';
import {Position} from './utils';

import Menu from './components/menu';
import Filter from './components/filter';
import TripController from './controllers/trip';

import data from './data';


const renderMenu = (menuItems, container) => {
  const menu = new Menu(menuItems);
  render(container, menu.getElement(), Position.AFTERFIRST);
};

const renderFilter = (filterItems, container) => {
  const filter = new Filter(filterItems);
  render(container, filter.getElement(), Position.BEFOREEND);
};


const tripControls = document.querySelector(`.trip-controls`);

renderMenu(data.MenuItems, tripControls);
renderFilter(data.FilterItems, tripControls);


const board = document.querySelector(`.trip-events`);

const trip = new TripController(board, data.events);

trip.init();
