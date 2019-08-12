export const createTripDayTemplate = ({number, date}) => {
  const dateOptions = {month: `short`, day: `numeric`};
  const dateObj = new Date(date);
  const dateFormatted = dateObj.toLocaleDateString(`en-US`, dateOptions).toUpperCase();
  return `
  <li class="trip-days__item day">
    <div class="day__info">
      <span class="day__counter">${number}</span>
      <time class="day__date" datetime="${date}">${dateFormatted}</time>
    </div>
  </li>`;
};

