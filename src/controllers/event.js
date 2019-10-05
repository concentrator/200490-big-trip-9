import {render, unrender, Position} from '../utils';

import EventView from '../components/event-view';
import EventEdit from '../components/event-edit';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

class EventController {
  constructor(container, data, mode, offerList, destinationList, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._mode = mode;
    this._offerList = offerList;
    this._destinationList = destinationList;
    this._data.offerList = data.type ? this._getOffersByType(data.type) : [];
    this._data.destinationList = this._destinationList;
    // this._data.duration = this._getDuration(data);
    this._eventView = new EventView(this._data);
    this._eventEdit = null;
    this._currentView = this._eventView;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.init();
  }


  init() {

    let renderPosition = Position.BEFOREEND;

    if (this._mode === Mode.ADDING) {
      renderPosition = Position.BEFORELAST;
      this._currentView = new EventEdit(this._data, this._mode);
      this._eventEdit = this._currentView;
      this._subscribeOnEvents();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    }

    render(this._container, this._currentView.getElement(), renderPosition);

    if (this._mode === Mode.DEFAULT) {
      this._eventView.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        this._eventEdit = new EventEdit(this._data, this._mode);
        this._subscribeOnEvents();
        this._onChangeView();
        this._replaceViewWithEdit();
      });
    }
  }

  setDefaultView() {
    if (this._currentView !== null && this._currentView === this._eventEdit) {
      this._removeEventAdding();
    }
    if (this._eventEdit && this._container.contains(this._eventEdit.getElement())) {
      this._replaceEditWithView();
    }
  }

  _removeEventAdding() {
    unrender(this._eventEdit.getElement());
    this._eventEdit.removeElement();
    this._eventEdit = null;
    this._currentView = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._onChangeView();
  }

  _getDestination(name) {
    let destination;
    for (let item of this._destinationList) {
      if (item.name === name) {
        destination = item;
        break;
      }
    }
    return destination;
  }

  _onFormSubmit(e) {
    const formData = new FormData(e.target);

    const getOffers = () => {
      const inputs = e.target.querySelectorAll(`.event__offer-checkbox`);
      const selected = Array.from(inputs).map((input) => {
        return formData.get(input.name) === `on` ? true : false;
      });

      const offers = [];

      this._getOffersByType(formData.get(`event-type`)).forEach((offer, index) => {
        if (selected[index]) {
          offers.push(offer);
        }
      });
      return offers;
    };

    const getDate = (param) => {
      return Date.parse(formData.get(`event-${param}-time`)) || null;
    };

    const entry = {
      type: formData.get(`event-type`),
      destination: this._getDestination(formData.get(`event-destination`)),
      dateStart: getDate(`start`),
      dateEnd: getDate(`end`),
      price: parseInt(formData.get(`event-price`), 10),
      offers: getOffers(),
      isFavorite: formData.get(`event-favorite`) === `on` ? true : false
    };

    if (!entry.destination) {
      // Добавляет красную рамку если было введено некорректное значение и не дает сохранить форму
      this._eventEdit.setDestinationInputInvalid();
      return;
    }
    if (this._mode === Mode.ADDING) {
      this._removeEventAdding();
      this._onDataChange(entry, null);
    } else {
      this._onDataChange(entry, this._data);
    }
  }

  _subscribeOnEvents() {
    if (this._mode === Mode.DEFAULT) {
      this._eventEdit.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        this._replaceEditWithView();
      });
    }

    const typeInputs = this._eventEdit.getElement().querySelectorAll(`.event__type-input`);
    typeInputs.forEach((input) => {
      input.addEventListener(`change`, (e) => {
        const newType = e.target.value;
        this._eventEdit.setTypeIconSrc(newType);
        this._eventEdit.setPlaceholder(newType);
        this._eventEdit.renderOffers(this._getOffersByType(newType));
      });
    });

    const destinationInput = this._eventEdit.getElement().querySelector(`.event__input--destination`);
    destinationInput.addEventListener(`change`, (e) => {

      // Удаляет красную рамку если до этого было введено некорректное значение
      e.target.removeAttribute(`style`);

      const list = e.target.list;
      let destination = e.target.value;

      if (Array.from(list.options).some((it) => it.value === destination) &&
        this._destinationList.some((it) => it.name === destination)) {

        this._eventEdit.renderDestination(this._getDestination(destination));
      }
    });

    const eventEditForm = this._mode === Mode.DEFAULT ? this._eventEdit.getElement().querySelector(`.event--edit`) : this._eventEdit.getElement();
    eventEditForm.addEventListener(`submit`, (e) => {
      e.preventDefault();
      this._onFormSubmit(e);
    });

    this._eventEdit.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        if (this._mode === Mode.DEFAULT) {
          this._onDataChange(null, this._data);
        }
        if (this._mode === Mode.ADDING) {
          this._removeEventAdding();
        }
      });
  }

  _getOffersByType(type) {
    return this._offerList.filter((offer) => offer.type === type)[0].offers;
  }

  // _getDuration(event) {
  //   return (event.dateEnd - event.dateStart > 0) ? event.dateEnd - event.dateStart : 0;
  // }

  _onEscKeyDown(evt) {
    if (evt.target.classList.contains(`event__input--time`)) {
      return;
    }
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (this._mode === Mode.DEFAULT) {
        this._replaceEditWithView();
      } else {
        this._removeEventAdding();
      }
    }
  }

  _replaceEditWithView() {
    this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
    this._eventEdit.destroyCalendar();
    this._eventEdit = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceViewWithEdit() {
    this._container.replaceChild(this._eventEdit.getElement(), this._eventView.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }
}

export default EventController;
