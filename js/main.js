'use strict';

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
const PIN_WIDTH = 40;
const PIN_HEIGHT = 40;
const AUTHORS_COUNT = 8;

const signsList = [];
const map = document.querySelector(`.map`);
const mapBlockWidth = map.offsetWidth;
const pinTemplate = document.querySelector(`#pin`)
  .content
  .querySelector(`.map__pin`);
const pinsList = document.querySelector(`.map__pins`);
const typesListPriceMin = {
  'bungalow': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

const generateRandomInt = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomSingleData = (array) => {
  return array[generateRandomInt(0, array.length - 1)];
};

const getRandomArrayData = (array) => {
  let randomArray = [];
  let arrayEntriesNumber = generateRandomInt(0, array.length - 1);
  for (let i = 0; i <= arrayEntriesNumber; i++) {
    randomArray.push(getRandomSingleData(array));
  }
  return randomArray;
};

const generateAvatarName = (n) => {
  let avatarName = AVATAR_NAME_START + n + AVATAR_NAME_END;
  return avatarName;
};

const generateLocation = () => {
  let location = {
    x: generateRandomInt(0, mapBlockWidth),
    y: generateRandomInt(MAP_HEIGHT_MIN, MAP_HEIGHT_MAX)
  };
  return location;
};

const getAddress = (location) => {
  let x = location.x;
  let y = location.y;
  let address = `${x}, ${y}`;
  return address;
};

const getPrice = (type) => {
  let newPrice = generateRandomInt(typesListPriceMin[type], PRICE_MAX);
  return newPrice;
};

const getRooms = () => {
  let roomsCount = ROOMS_COUNT[generateRandomInt(0, ROOMS_COUNT.length - 1)];
  return roomsCount;
};

const getGuests = () => {
  let guestsCount = GUEST_COUNT[generateRandomInt(0, ROOMS_COUNT.length - 1)];
  return guestsCount;
};

const generateSign = (n) => {
  let newLocation = generateLocation();
  let newType = getRandomSingleData(TYPE_LIST);
  let sign = {
    avatar: generateAvatarName(n),
    offer: {
      title: `some string`,
      address: getAddress(newLocation),
      price: getPrice(newType),
      type: newType,
      rooms: getRooms(),
      guests: getGuests(),
      checkin: getRandomSingleData(CHECKIN_LIST),
      checkout: getRandomSingleData(CHECKOUT_LIST),
      features: getRandomArrayData(FEATURES_LIST),
      description: `some description`,
      photos: getRandomArrayData(PHOTOS_LIST)
    },
    location: newLocation
  };
  return sign;
};

const createPin = (pinInfo) => {
  let newPinItem = pinTemplate.cloneNode(true);
  newPinItem.style.left = `${(pinInfo.location.x - PIN_WIDTH / 2)}px`;
  newPinItem.style.top = `${(pinInfo.location.y - PIN_HEIGHT)}px`;

  let newPinItemImg = newPinItem.querySelector(`img`);
  newPinItemImg.src = pinInfo.avatar;
  newPinItemImg.alt = pinInfo.offer.title;
  return newPinItem;
};

const generatePinsArray = () => {
  for (let i = 0; i < AUTHORS_COUNT; i++) {
    let newSign = generateSign(i + 1);
    signsList.push(newSign);
  }
};

const createPinsFragment = () => {
  let pinFragment = document.createDocumentFragment();

  for (let i of signsList) {
    pinFragment.appendChild(createPin(i));
  }
  return pinFragment;
};

const createPinsList = () => {
  generatePinsArray();
  pinsList.appendChild(createPinsFragment());
};

map.classList.remove(`map--faded`);

createPinsList();

