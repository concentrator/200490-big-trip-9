import {render} from './utils';
import {createTripInfoTemplate} from './components/trip-info';
import {renderMenu} from './components/menu';
import {renderFilter} from './components/filter';
import {renderSort} from './components/sort';
import {renderTripDayList} from './components/trip';
import data from './data';

const tripInfo = document.querySelector(`.trip-info`);
render(tripInfo, `afterbegin`, createTripInfoTemplate);

const tripControls = document.querySelector(`.trip-controls`);
const tripTabs = renderMenu(data.MenuItems);
tripControls.insertBefore(tripTabs, tripControls.firstElementChild.nextElementSibling);
const tripFilters = renderFilter(data.FilterItems);
tripControls.appendChild(tripFilters);

const tripEvents = document.querySelector(`.trip-events`);
const tripSort = renderSort(data.SortItems);
tripEvents.appendChild(tripSort);

const tripDays = renderTripDayList(data.TripDays);

tripEvents.appendChild(tripDays);
