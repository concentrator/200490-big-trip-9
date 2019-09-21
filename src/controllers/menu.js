import {render, Position} from '../utils';
import Menu from '../components/menu';

const ID = {
  EVENTS: `btn-table`,
  STATISTICS: `btn-stats`
};

class MenuController {
  constructor(container, items, tripController, statisticsController) {
    this._container = container;
    this._items = items;
    this._menu = new Menu(items);
    this._activeItem = null;
    this._trip = tripController;
    this._statistics = statisticsController;
  }

  init() {

    render(this._container, this._menu.getElement(), Position.AFTERFIRST);

    this._activeItem = this._menu.getElement().querySelector(`.trip-tabs__btn--active`);

    this._menu.getElement().addEventListener(`click`, (e) => {
      e.preventDefault();
      if (e.target.tagName !== `A` || e.target === this._active) {
        return;
      }

      this._toggleActiveItem(e.target);

      switch (e.target.id) {
        case ID.EVENTS:
          this._showTripScreen();
          break;

        case ID.STATISTICS:
          if (this._addEventBtn.disabled) {
            this._trip.cancelCreateEvent();
          }
          this._showStatisticsScreen();
          break;
      }
    });

    this._addEventBtn = document.querySelector(`.trip-main__event-add-btn`);
    this._addEventBtn.addEventListener(`click`, (e) => {
      e.preventDefault();
      if (this._activeItem.id === ID.STATISTICS) {
        this._showTripScreen();
        this._toggleActiveItem(this._menu.getElement().querySelector(`#${ID.EVENTS}`));
      }
      this._trip.createEvent(this._onModeChange.bind(this));
    });
  }

  _onModeChange() {
    this._addEventBtn.disabled = this._trip.isCreatingEvent;
  }

  _showTripScreen() {
    this._trip.show();
    this._statistics.hide();
  }

  _showStatisticsScreen() {
    this._trip.hide();
    this._statistics.show();
  }

  _toggleActiveItem(item) {
    this._activeItem.classList.remove(`trip-tabs__btn--active`);
    item.classList.add(`trip-tabs__btn--active`);
    this._activeItem = item;
  }
}

export default MenuController;
