const ONE_HOUR_SEC = 60 * 60;
const ONE_DAY_SEC = 24 * 60 * 60;

export const render = (container, place, createTemplate, params = ``) => {
  container.insertAdjacentHTML(place, createTemplate(params));
};

export const createElement = (elementType, classList) => {
  const wrapper = document.createElement(elementType);
  wrapper.className = classList;
  return wrapper;
};

export const createForm = (classList, action = `#`, method = `get`) => {
  const form = createElement(`form`, classList);
  form.action = action;
  form.method = method;
  return form;
};

export const createButton = (type, classList, title) => {
  const button = createElement(`button`, classList);
  button.type = type;
  button.innerText = title;
  return button;
};

export const renderItems = (container, place, createTemplate, defaultParams, data) => {

  data.forEach((item) => {
    let params = {};
    const defaultClone = Object.assign({}, defaultParams);
    if (typeof item === `object`) {
      params = Object.assign(defaultClone, item);
    }
    render(container, place, createTemplate, params);
  });
};

export const makeFirstLetterUppercase = (str) => {
  const result = `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  return result;
};

export const getPreposition = (type) => {
  return ([`sightseeing`, `restaurant`, `check-in`].some((it) => it === type)) ? `in` : `to`;
};

export const convertDateToTime = (date) => {
  const dateOptions = {hour: `2-digit`, minute: `2-digit`, hour12: false};
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString(`en-US`, dateOptions);
};

export const formatDateShort = (date) => {
  const dateOptions = {month: `short`, day: `numeric`};
  return new Date(date).toLocaleDateString(`en-US`, dateOptions);
};

export const getDateTimeDelta = (dateStart, dateEnd) => {
  let delta = dateEnd - dateStart;
  delta = parseInt((delta) / 1000, 10);

  let days = Math.floor(delta / ONE_DAY_SEC);
  let hours = Math.floor((delta - days * ONE_DAY_SEC) / ONE_HOUR_SEC);
  let minutes = Math.round((delta - days * ONE_DAY_SEC - hours * ONE_HOUR_SEC) / 60);

  days = `0${days}D`.slice(-3);
  hours = `0${hours}H`.slice(-3);
  minutes = `0${minutes}M`.slice(-3);

  let duration = ``;

  if (delta >= ONE_DAY_SEC) {
    duration = `${days} ${hours} ${minutes}`;
  } else if (delta < ONE_DAY_SEC && delta >= ONE_HOUR_SEC) {
    duration = `${hours} ${minutes}`;
  } else {
    duration = `${minutes}`;
  }

  return duration;
};
