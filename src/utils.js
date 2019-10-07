export const Position = {
  AFTERBEGIN: `afterbegin`,
  AFTERFIRST: `afterfirst`,
  BEFOREEND: `beforeend`,
  BEFORELAST: `beforelast`,
};

const ONE_HOUR_SEC = 60 * 60;
const ONE_DAY_SEC = 24 * 60 * 60;
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const SHAKE_ANIMATION = `
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
.shake {
  animation: shake 0.6s;
}`;

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

export const getformattedDuration = (eventDuration) => {
  let delta = parseInt((eventDuration) / 1000, 10);

  let days = Math.floor(delta / ONE_DAY_SEC);
  let hours = Math.floor((delta - days * ONE_DAY_SEC) / ONE_HOUR_SEC);
  let minutes = Math.round((delta - days * ONE_DAY_SEC - hours * ONE_HOUR_SEC) / 60);

  days = days < 10 ? `0${days}D` : `${days}D`;
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

export const isObjectEmpty = (obj) => {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};

const addStyleElement = (css) => {
  const head = document.head;
  const style = document.createElement(`style`);

  head.appendChild(style);
  style.type = `text/css`;
  style.appendChild(document.createTextNode(css));
};

addStyleElement(SHAKE_ANIMATION);
