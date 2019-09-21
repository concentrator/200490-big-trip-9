export const Position = {
  AFTERBEGIN: `afterbegin`,
  AFTERFIRST: `afterfirst`,
  BEFOREEND: `beforeend`,
  BEFORELAST: `beforelast`,
};

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.AFTERFIRST:
      container.insertBefore(element, container.firstElementChild.nextElementSibling);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
    case Position.BEFORELAST:
      container.insertBefore(element, container.lastElementChild);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const makeFirstLetterUppercase = (str) => {
  const result = `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  return result;
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

export const isObjectEmpty = (obj) => {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};
