'use strict';
(function () {
  const MAP_HEIGHT_MAX = 630;
  const MAP_HEIGHT_MIN = 130;
  const TYPE_LIST = [`palace`, `flat`, `house`, `bungalow`];
  const CHECKIN_LIST = [`12:00`, `13:00`, `14:00`];
  const CHECKOUT_LIST = [`12:00`, `13:00`, `14:00`];
  const FEATURES_LIST = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
  const PHOTOS_LIST = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
  const AVATAR_NAME_START = `img/avatars/user0`;
  const AVATAR_NAME_END = `.png`;
  const PRICE_MAX = 1000000;
  const ROOMS_COUNT = [1, 2, 3, 100];
  const GUEST_COUNT = [1, 2, 3];
  const AUTHORS_COUNT = 8;

  const mapBlockWidth = window.main.map.offsetWidth;

  const pinsList = [];
  const typesListPriceMin = {
    'bungalow': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  // генерирование данных
  const generateAvatarName = (n) => {
    let avatarName = AVATAR_NAME_START + n + AVATAR_NAME_END;
    return avatarName;
  };

  // генерирование данных
  const generateLocation = () => {
    let location = {
      x: window.util.generateRandomInt(0, mapBlockWidth),
      y: window.util.generateRandomInt(MAP_HEIGHT_MIN, MAP_HEIGHT_MAX)
    };
    return location;
  };

  // генерирование данных (строка адреса)
  const getAddress = (location) => {
    let x = location.x;
    let y = location.y;
    let address = `${x}, ${y}`;
    return address;
  };

  // генерирование данных (случайная цена)
  const getPrice = (type) => {
    let newPrice = window.util.generateRandomInt(window.data.typesListPriceMin[type], PRICE_MAX);
    return newPrice;
  };

  // генерирование данных (случайное количество комнат)
  const getRooms = () => {
    let roomsCount = ROOMS_COUNT[window.util.generateRandomInt(0, ROOMS_COUNT.length - 1)];
    return roomsCount;
  };

  // генерирование данных (количество гостей)
  const getGuests = () => {
    let guestsCount = GUEST_COUNT[window.util.generateRandomInt(0, GUEST_COUNT.length - 1)];
    return guestsCount;
  };

  // генерирование объявления
  const generateSign = (n) => {
    let newLocation = generateLocation();
    let newType = window.util.getRandomSingleData(TYPE_LIST);
    let sign = {
      avatar: generateAvatarName(n),
      offer: {
        title: `some string`,
        address: getAddress(newLocation),
        price: getPrice(newType),
        type: newType,
        rooms: getRooms(),
        guests: getGuests(),
        checkin: window.util.getRandomSingleData(CHECKIN_LIST),
        checkout: window.util.getRandomSingleData(CHECKOUT_LIST),
        features: window.util.getRandomArrayData(FEATURES_LIST),
        description: `some description`,
        photos: window.util.getRandomArrayData(PHOTOS_LIST)
      },
      location: newLocation
    };
    return sign;
  };

  // генерирование набора меток
  const generatePinsArray = () => {
    for (let i = 0; i < AUTHORS_COUNT; i++) {
      let newSign = generateSign(i + 1);
      window.data.pinsList.push(newSign);
    }
  };

  window.data = {
    typesListPriceMin,
    pinsList,
    generatePinsArray
  };
})();
