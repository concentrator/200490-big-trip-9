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

const TripDays = [
  {
    number: 1,
    date: `2019-03-18`,
    events: [
      {
        id: 0,
        type: `taxi`,
        title: `Taxi to airport`,
        startTime: `2019-03-18T10:30`,
        endTime: `2019-03-18T11:00`,
        price: 20,
        offers: [
          {
            title: `Order Uber`,
            price: 20
          }
        ]
      },
      {
        id: 1,
        type: `flight`,
        title: `Flight to Geneva`,
        startTime: `2019-03-18T12:25`,
        endTime: `2019-03-18T13:35`,
        price: 160,
        offers: [
          {
            title: `Add luggage`,
            price: 50
          },
          {
            title: `Switch to comfort`,
            price: 80
          }
        ]
      },
      {
        id: 2,
        type: `drive`,
        title: `Drive to Chamonix`,
        startTime: `2019-03-18T14:30`,
        endTime: `2019-03-18T16:05`,
        price: 160,
        offers: [
          {
            title: `Rent a car`,
            price: 200
          }
        ]
      }
    ]
  },
  // {
  //   number: 2,
  //   date: `2019-03-19`
  // },
  // {
  //   number: 3,
  //   date: `2019-03-20`
  // }
];

// const EventsList = [

// ];

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
    `check`,
    `sightseeing`,
    `restaurant`
  ][Math.floor(Math.random() * 10)],
  destination: [
    `Amsterdam`,
    `Geneva`,
    `Chamonix`,
    `Saint Petersburg`
  ][Math.floor(Math.random() * 3)],
  photos: [
    `http://picsum.photos/300/150?r=${Math.random()}`,
    `http://picsum.photos/300/150?r=${Math.random()}`,
    `http://picsum.photos/300/150?r=${Math.random()}`,
    `http://picsum.photos/300/150?r=${Math.random()}`,
    `http://picsum.photos/300/150?r=${Math.random()}`
  ],
  description: getRandomDescription(),
  price: Math.ceil(Math.random() * 10) * 20,
  offers: shuffleArray([
    {
      title: `Add luggage`,
      price: 10,
      isChecked: getRandomBoolean()
    },
    {
      title: `Switch to comfort class`,
      price: 150,
      isChecked: getRandomBoolean()
    },
    {
      title: `Add meal`,
      price: 2,
      isChecked: getRandomBoolean()
    },
    {
      title: `Choose seats`,
      price: 9,
      isChecked: getRandomBoolean()
    }
  ]).slice(0, Math.floor(Math.random() * 3))
});

const event = getEvent();

console.log(event);

const data = {
  MenuItems,
  FilterItems,
  SortItems,
  TripDays,
  // EventsList
};

export default data;
