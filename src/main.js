import {render} from './utils';
import {createTripInfoTemplate} from './components/trip-info';
import {renderTripCost} from './components/trip-info';
import {renderMenu} from './components/menu';
import {renderFilter} from './components/filter';
import {renderSort} from './components/sort';
import {renderTripDayList} from './components/trip';
import {makeTrip} from './components/trip';
import data from './data';

const tripInfo = document.querySelector(`.trip-info`);

const trip = makeTrip(data.eventList);

render(tripInfo, `afterbegin`, createTripInfoTemplate, trip.info);
renderTripCost(trip.info.cost);

const tripControls = document.querySelector(`.trip-controls`);
const tripTabs = renderMenu(data.MenuItems);
tripControls.insertBefore(tripTabs, tripControls.firstElementChild.nextElementSibling);
const tripFilters = renderFilter(data.FilterItems);
tripControls.appendChild(tripFilters);

const tripEvents = document.querySelector(`.trip-events`);
const tripSort = renderSort(data.SortItems);
tripEvents.appendChild(tripSort);


const tripDays = renderTripDayList(trip.days, 4, true);

tripEvents.appendChild(tripDays);


