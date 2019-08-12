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

const data = {
  MenuItems,
  FilterItems,
  SortItems,
  TripDays,
  // EventsList
};

export default data;
