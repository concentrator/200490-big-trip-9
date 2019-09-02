import AbstractComponent from './abstract-component';


class TripDayList extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}

export default TripDayList;
