import {formatDateShort} from '../utils';

export const makeTripDay = ({number, date}) => {

  return `
    <div class="day__info">
      <span class="day__counter">${number}</span>
      <time class="day__date" datetime="${new Date(date).toISOString()}">${formatDateShort(date)}</time>
    </div>`;
};
