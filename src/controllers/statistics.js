import {render, Position} from '../utils';
import Statistics from '../components/statistics';


class StatisticsController {
  constructor(container) {
    this._container = container;
    this._statistics = new Statistics();
  }

  show() {
    this._statistics.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._statistics.getElement().classList.add(`visually-hidden`);
  }

  init() {
    render(this._container, this._statistics.getElement(), Position.BEFOREEND);
    this.hide();
  }
}

export default StatisticsController;
