import {createForm} from '../utils';
import {renderItems} from '../utils';
import {makeFirstLetterUppercase} from '../utils';

const SORT_FORM_CLASS = `trip-events__trip-sort trip-sort`;

const sortItemParams = {
  id: ``,
  isSortable: true,
  isChecked: false
};

const createSortItemTemplate = ({id, isSortable, isChecked}) => {
  const label = makeFirstLetterUppercase(id);
  if (!isSortable) {
    return `<span class="trip-sort__item trip-sort__item--${id}">${label}</span>`;
  } else {
    return `
    <div class="trip-sort__item trip-sort__item--${id}">
      <input id="sort-${id}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${id}"${isChecked ? ` checked` : ``}>
      <label class="trip-sort__btn" for="sort-${id}">
        ${label}
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>`;
  }
};

export const renderSort = (params) => {
  const form = createForm(SORT_FORM_CLASS);
  renderItems(form, `beforeend`, createSortItemTemplate, sortItemParams, params);
  return form;
};
