import AbstractComponent from './abstract-component';

const MESSAGE = {
  'no-points': `Click New Event to create your first point`
};


class Message extends AbstractComponent {
  constructor(type) {
    super();
    this._type = type;
  }

  getTemplate() {
    return `<p class="trip-events__msg">${MESSAGE[this._type]}</p>`;
  }
}

export default Message;
