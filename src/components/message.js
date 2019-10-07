import AbstractComponent from './abstract-component';

export const MessageType = {
  NO_EVENTS: `no-points`
};

const MESSAGE = {
  [MessageType.NO_EVENTS]: `Click New Event to create your first point`
};

class Message extends AbstractComponent {
  constructor(type) {
    super();
    this._type = type;
  }

  _getTemplate() {
    return `<p class="trip-events__msg">${MESSAGE[this._type]}</p>`;
  }
}

export default Message;
