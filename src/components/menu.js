import {createElement} from '../utils';
import {renderItems} from '../utils';

const NAV_WRAPPER_CLASS = `trip-controls__trip-tabs trip-tabs`;

const navWrapper = createElement(`nav`, NAV_WRAPPER_CLASS);

const menuParams = {
  title: ``,
  url: `#`,
  isActive: false
};

const createMenuItemTemplate = ({title, url, isActive}) => {
  return `
  <a class="trip-tabs__btn${isActive ? ` trip-tabs__btn--active` : ``}" href="${url}">${title}</a>`;
};

export const renderMenu = (params) => {
  renderItems(navWrapper, `beforeend`, createMenuItemTemplate, menuParams, params);
  return navWrapper;
};

