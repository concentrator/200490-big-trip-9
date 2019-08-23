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
    if (typeof item === `object`) {
      params = {...defaultParams, ...item};
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
  const start = new Date(dateStart);
  const end = new Date(dateEnd);
  let delta = new Date(end - start);
  delta = parseInt((delta) / 1000, 10);
  const hours = Math.floor(delta / 3600);
  const minutes = (!hours) ? Math.round(delta / 60) : Math.round((delta - hours * 3600) / 60);
  return {hours, minutes};
};
