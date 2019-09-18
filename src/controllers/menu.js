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
      if (e.target.tagName !== `A` || e.target.tagName === this._active) {
        return;
      }

      this._activeItem.classList.remove(`trip-tabs__btn--active`);
      e.target.classList.add(`trip-tabs__btn--active`);
      this._activeItem = e.target;

      switch (e.target.id) {
        case ID.EVENTS:
          this._trip.show();
          this._statistics.hide();
          break;

        case ID.STATISTICS:
          this._trip.hide();
          this._statistics.show();
          break;
      }
    });

  }
}

export default MenuController;
