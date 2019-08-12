import {createForm} from '../utils';
import {createButton} from '../utils';
import {renderItems} from '../utils';
import {makeFirstLetterUppercase} from '../utils';

const FILTERS_FORM_CLASS = `trip-filters`;

const filterItemParams = {
  id: ``,
  isChecked: false
};

const createFilterItemTemplate = ({id, isChecked}) => {
  const label = makeFirstLetterUppercase(id);
  return `
  <div class="trip-filters__filter">
    <input id="filter-${id}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${id}"${isChecked ? ` checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${id}">${label}</label>
  </div>`;
};

export const renderFilter = (params) => {
  const form = createForm(FILTERS_FORM_CLASS);
  renderItems(form, `beforeend`, createFilterItemTemplate, filterItemParams, params);
  const submit = createButton(`submit`, `visually-hidden`, `Accept filter`);
  form.appendChild(submit);
  return form;
};

