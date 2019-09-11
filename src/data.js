const ONE_MINUTE_MS = 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const ONE_HOUR_MIN = 60;
const ONE_DAY_MIN = 24 * 60;

const EVENT_TYPES = {
  Transfer: [
    `taxi`,
    `bus`,
    `train`,
    `ship`,
    `transport`,
    `drive`,
    `flight`,
  ],
  Activity: [
    `check-in`,
    `sightseeing`,
    `restaurant`
  ]
};

const getRandomBoolean = () => Boolean(Math.round(Math.random()));

const shuffleArray = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
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


const getRandomType = () => {
  const arr = EVENT_TYPES[Math.round(Math.random()) ? [`Transfer`] : [`Activity`]];
  return arr[Math.floor(Math.random() * arr.length)];
};

const DESTINATION = [
  `Simferopol`,
  `Sevastopol`,
  `Yalta`,
  `Simeiz`,
  `Balaklava`
];

const getPictureURL = () => {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open(`GET`, `http://picsum.photos/300/150?r=${Math.random()}`, false);
  xmlHttp.send(null);
  return xmlHttp.responseURL;
};

const getPictures = (destination) => Array.from(new Array(5), ((val, i) => (
  {
    src: getPictureURL(),
    description: `${destination} photo ${i + 1}`
  })
));

const getDestination = (destination) => ({
  description: getRandomDescription(),
  name: destination,
  pictures: getPictures(destination)
});

const Destionation = DESTINATION.map((destination) => getDestination(destination));

const OFFERS = [
  {
    type: `taxi`,
    offers: [
      {
        name: `Upgrade to a business class`,
        price: 120
      },
      {
        name: `Choose the radio station`,
        price: 60
      }
    ]
  },
  {
    type: `bus`,
    offers: []
  },
  {
    type: `train`,
    offers: [
      {
        name: `Add meal`,
        price: 2
      }
    ]
  },
  {
    type: `ship`,
    offers: [
      {
        name: `Switch to comfort class`,
        price: 150
      }
    ]
  },
  {
    type: `transport`,
    offers: []
  },
  {
    type: `drive`,
    offers: []
  },
  {
    type: `flight`,
    offers: [
      {
        name: `Add luggage`,
        price: 10
      },
      {
        name: `Choose seats`,
        price: 9
      }
    ]
  },
  {
    type: `check-in`,
    offers: [
      {
        name: `Add luggage`,
        price: 10
      }
    ]
  },
  {
    type: `sightseeing`,
    offers: []
  },
  {
    type: `restaurant`,
    offers: [
      {
        name: `Add meal`,
        price: 2
      }
    ]
  }
];

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

const getOffers = (type) => {
  let offers = [];
  for (let offer of OFFERS) {
    if (offer.type === type) {
      offers = shuffleArray(offers.concat(offer.offers));
      break;
    }
  }
  offers.length = Math.floor(Math.random() * (offers.length + 1));
  return offers;
};

const getEvent = () => {
  const dateStart = Math.round((Date.now() + Math.floor(Math.random() * 7 * ONE_DAY_MIN) * ONE_MINUTE_MS) / FIVE_MINUTES_MS) * FIVE_MINUTES_MS;

  const dateEnd = Math.round((dateStart + 10 * ONE_MINUTE_MS + Math.floor(Math.random() * 36 * ONE_HOUR_MIN) * ONE_MINUTE_MS) / FIVE_MINUTES_MS) * FIVE_MINUTES_MS;

  const type = getRandomType();
  const offers = getOffers(type);

  return {
    type,
    destination: Destionation[Math.floor(Math.random() * DESTINATION.length)],
    dateStart,
    dateEnd,
    price: Math.ceil(Math.random() * 10) * 20,
    offers,
    isFavorite: getRandomBoolean()
  };
};

const getEventListMock = (count) => Array.from(new Array(count), () => getEvent());

// const setEventsDuration = (events) => {
//   return events.map((event) => {
//     event.duration = event.dateEnd - event.dateStart;
//     return event;
//   });
// };

let events = getEventListMock(4);
// events = setEventsDuration(events);

const data = {
  EVENT_TYPES,
  MenuItems,
  FilterItems,
  events,
  offerList: OFFERS,
  destionationList: Destionation
};

export default data;
