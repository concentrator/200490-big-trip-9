
class ModelEvent {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.price = data[`base_price`] || 0;
    this.dateStart = data[`date_from`] || null;
    this.dateEnd = data[`date_to`] || null;
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.destination = data[`destination`];
    this.offers = data[`offers`];
  }

  static parseEvent(data) {
    return new ModelEvent(data);
  }

  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }

  static toRAW(data) {
    const event = {
      'id': data.id,
      'type': data.type,
      'base_price': data.price,
      'date_from': data.dateStart,
      'date_to': data.dateEnd,
      'is_favorite': data.isFavorite,
      'destination': data.destination,
      'offers': data.offers,
    };
    if (!data.hasOwnProperty(`id`)) {
      delete event.id;
    }
    return event;
  }
}

export default ModelEvent;

