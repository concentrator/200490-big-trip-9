import ModelEvent from './model-event';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(ModelEvent.parseEvents);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON);
  }

  createEvent({event}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  updateEvent({id, event}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(event),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  deleteEvent({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {

        throw err;
      });
  }
}

export default API;
