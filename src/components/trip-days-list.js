import AbstractComponent from './abstract-component';


class TripDaysList extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}

export default TripDaysList;
