import AbstractComponent from './abstract-component';

class EventList extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<ul class="trip-events__list"></ul>`;
  }
}

export default EventList;
