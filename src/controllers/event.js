import {render} from '../utils';
import {Position} from '../utils';

import {makeFirstLetterUppercase} from '../utils';


import EventView from '../components/event-view';
import EventEdit from '../components/event-edit';


class EventController {
  constructor(container, data, offerList, destinationList, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._offerList = offerList;
    this._destinationList = destinationList;
    this._data.offerList = this._getOffersByType(data.type);
    this._data.destinationList = this._destinationList;
    this._data.duration = this._getDuration(data);
    this._eventView = new EventView(data);
    this._eventEdit = null;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.init();
  }


  init() {

    this._eventView.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        this._eventEdit = new EventEdit(this._data);
        this._subscribeOnEvents();
        this._onChangeView();
        this._replaceViewWithEdit();
      });

    render(this._container, this._eventView.getElement(), Position.BEFOREEND);
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

  _getPreposition(type) {
    return ([`sightseeing`, `restaurant`, `check-in`].some((it) => it === type)) ? `in` : `to`;
  }

  _subscribeOnEvents() {
    this._eventEdit.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, (e) => {
      e.preventDefault();
      this._replaceEditWithView();
    });

    const typeIcon = this._eventEdit.getElement().querySelector(`.event__type-icon`);
    const placeholder = this._eventEdit.getElement().querySelector(`.event__type-output`);
    const typeInputs = this._eventEdit.getElement().querySelectorAll(`.event__type-input`);
    typeInputs.forEach((input) => {
      input.addEventListener(`change`, (e) => {
        const newType = e.target.value;
        const currentType = typeIcon.src.substring(typeIcon.src.lastIndexOf(`/`) + 1).split(`.`)[0];
        typeIcon.src = typeIcon.src.replace(currentType, newType);
        placeholder.textContent =
          `${makeFirstLetterUppercase(newType)} ${this._getPreposition(newType)}`;

        this._eventEdit.renderOffers(this._getOffersByType(newType));
      });
    });

    const destinationInput = this._eventEdit.getElement().querySelector(`.event__input--destination`);
    destinationInput.addEventListener(`change`, (e) => {
      const list = e.target.list;
      let destination = e.target.value;
      if (Array.from(list.options).some((it) => it.value === destination) &&
        this._destinationList.some((it) => it.name === destination)) {

        this._eventEdit.renderDestination(this._getDestination(destination));
      }
    });

    const eventEditForm = this._eventEdit.getElement().querySelector(`.event--edit`);
    eventEditForm.addEventListener(`submit`, (e) => {
      e.preventDefault();
      const formData = new FormData(eventEditForm);

      const getOffers = () => {
        const inputs = eventEditForm.querySelectorAll(`.event__offer-checkbox`);
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
        const arr = formData.get(`event-${param}-time`).split(` `);
        const YMD = arr[0].split(`.`);
        [YMD[0], YMD[1], YMD[2]] = [YMD[2], YMD[1], YMD[0]];
        return Date.parse(`${YMD.join(`-`)}T${arr[1]}:00`) || null;
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

      this._onDataChange(entry, this._data);
    });
  }

  _getOffersByType(type) {
    return this._offerList.filter((offer) => offer.type === type)[0].offers;
  }

  _getDuration(event) {
    return (event.dateEnd - event.dateStart > 0) ? event.dateEnd - event.dateStart : 0;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._replaceEditWithView();
    }
  }

  _replaceEditWithView() {
    this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
    this._eventEdit = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceViewWithEdit() {
    this._container.replaceChild(this._eventEdit.getElement(), this._eventView.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._eventEdit && this._container.contains(this._eventEdit.getElement())) {
      this._replaceEditWithView();
    }
  }
}

export default EventController;
