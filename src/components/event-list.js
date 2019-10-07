import AbstractComponent from './abstract-component';

class EventList extends AbstractComponent {
  constructor() {
    super();
  }

  _getTemplate() {
    return `<ul class="trip-events__list"></ul>`;
  }
}

export default EventList;
