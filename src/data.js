const MenuItems = [
  {
    title: `Table`,
    isActive: true
  },
  {
    title: `Stats`
  }
];

const FilterItems = [
  {
    id: `everything`,
    isChecked: true
  },
  {
    id: `future`
  },
  {
    id: `past`
  }
];

const SortItems = [
  {
    id: `day`,
    isSortable: false
  },
  {
    id: `event`,
    isChecked: true
  },
  {
    id: `time`
  },
  {
    id: `price`
  },
  {
    id: `offers`,
    isSortable: false
  }
];

const getRandomBoolean = () => Boolean(Math.round(Math.random()));

const shuffleArray = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

const getRandomDescription = () => {
  return shuffleArray([
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ]).slice(0, Math.ceil(Math.random() * 3)).join(` `);
};

const getEvent = () => ({
  type: [
    `taxi`,
    `bus`,
    `train`,
    `ship`,
    `transport`,
    `drive`,
    `flight`,
    `check-in`,
    `sightseeing`,
    `restaurant`
  ][Math.floor(Math.random() * 10)],
  destination: [
    `Simferopol`,
    `Sevastopol`,
    `Yalta`,
    `Simeiz`
  ][Math.floor(Math.random() * 4)],
  dateStart: Math.round(((Date.now() + Math.floor(Math.random() * 7 * 24 * 60) * 60 * 1000) / (60 * 1000)) / 5) * 60 * 1000 * 5,
  get dateEnd() {
    return Math.round(((this.dateStart + 10 * 60 * 1000 + Math.floor(Math.random() * 5 * 60) * 60 * 1000) / (60 * 1000)) / 5) * 60 * 1000 * 5;
  },
  price: Math.ceil(Math.random() * 10) * 20,
  photos: [
    `http://picsum.photos/300/150?r=${Math.random()}`,
    `http://picsum.photos/300/150?r=${Math.random()}`,
    `http://picsum.photos/300/150?r=${Math.random()}`,
    `http://picsum.photos/300/150?r=${Math.random()}`,
    `http://picsum.photos/300/150?r=${Math.random()}`
  ],
  description: getRandomDescription(),
  offers: shuffleArray([
    {
      title: `Add luggage`,
      price: 10,
      isSelected: getRandomBoolean()
    },
    {
      title: `Switch to comfort class`,
      price: 150,
      isSelected: getRandomBoolean()
    },
    {
      title: `Add meal`,
      price: 2,
      isSelected: getRandomBoolean()
    },
    {
      title: `Choose seats`,
      price: 9,
      isSelected: getRandomBoolean()
    }
  ]).slice(0, Math.floor(Math.random() * 3)),
  isFavorite: getRandomBoolean()
});

const getEventList = (count) => Array.from(new Array(count), () => getEvent());

const eventList = getEventList(4);

const data = {
  MenuItems,
  FilterItems,
  SortItems,
  eventList
};

export default data;
