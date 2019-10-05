import {render, unrender, Position} from '../utils';
import Filter from "../components/filter";
import {FilterMode} from './trip';

const FilterItems = [
  {
    id: `everything`,
    isChecked: true
  },
  {
    id: `future`
  },
  {
    id: `past`
  }
];

class FilterController {
  constructor(container, onChangeMode) {
    this._container = container;
    this._onChangeMode = onChangeMode;
    this._mode = FilterMode.DEFAULT;
    this._filter = new Filter(FilterItems);
  }

  init() {
    render(this._container, this._filter.getElement(), Position.BEFOREEND);

    this._filter.getElement().addEventListener(`change`, (e) => {

      if (e.target.nodeName !== `INPUT`) {
        return;
      }

      this._mode = e.target.value;
      this._onChangeMode(this._mode);
    });
  }

  show() {
    render(this._container, this._filter.getElement(), Position.BEFOREEND);
  }

  hide() {
    unrender(this._filter.getElement());
  }
}

export default FilterController;
