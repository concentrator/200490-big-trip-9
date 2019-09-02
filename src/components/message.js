import {createElement} from '../utils';

const MESSAGE = {
  'no-points': `Click New Event to create your first point`
};


class Message {
  constructor(type) {
    this._type = type;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `<p class="trip-events__msg">${MESSAGE[this._type]}</p>`;
  }
}

export default Message;
