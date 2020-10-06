'use strict';

const signsList = [];
const map = document.querySelector(`.map`);
const mapBlock = map.getBoundingClientRect();
const MAP_HEIGHT_MAX = 630;
const MAP_HEIGHT_MIN = 130;
const TYPE_LIST = [`palace`, `flat`, `house`, `bungalow`];
const CHECKIN_LIST = [`12:00`, `13:00`, `14:00`];
const CHECKOUT_LIST = [`12:00`, `13:00`, `14:00`];
const FEATURES_LIST = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const PHOTOS_LIST = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const pinTemplate = document.querySelector(`#pin`)
  .content
  .querySelector(`.map__pin`);
const pinsList = document.querySelector(`.map__pins`);

const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const randomSingleData = (array) => {
  let min = 0;
  let max = array.length - 1;
  return array[randomInteger(min, max)];
};

const randomArrayData = (array) => {
  let randomArray = [];
  let min = 0;
  let max = array.length - 1;
  let arrayEntriesNumber = randomInteger(min, max);
  for (let i = 0; i <= arrayEntriesNumber; i++) {
    randomArray.push(randomSingleData(array));
  }
  return randomArray;
};

const getAvatar = (n) => {
  let avatarName = `img/avatars/user${`0${n}`}.png`;
  return avatarName;
};

const getLocation = () => {
  let mapWidthMin = mapBlock.x;
  let mapWidthMax = mapBlock.x + mapBlock.width;
  let location = {
    x: randomInteger(mapWidthMin, mapWidthMax),
    y: randomInteger(MAP_HEIGHT_MIN, MAP_HEIGHT_MAX)
  };
  return location;
};

const getAddress = (location) => {
  let x = location.x;
  let y = location.y;
  let address = `${x}, ${y}`;
  return address;
};

const createSign = (n) => {
  let location = getLocation();
  let sign = {
    avatar: getAvatar(n),
    offer: {
      title: `some string`,
      address: getAddress(location),
      price: `some integer`,
      type: randomSingleData(TYPE_LIST),
      rooms: `some integer`,
      guests: `some integer`,
      checkin: randomSingleData(CHECKIN_LIST),
      checkout: randomSingleData(CHECKOUT_LIST),
      features: randomArrayData(FEATURES_LIST),
      description: `some string`,
      photos: randomArrayData(PHOTOS_LIST)
    },
    location: location
  };
  return sign;
};

const createPin = (pinInfo) => {
  let newPinItem = pinTemplate.cloneNode(true);
  newPinItem.style = `left:` + (pinInfo.location.x + 40) + `px; top: ` + (pinInfo.location.y + 40) + `px;`;
  let newPinItemImg = newPinItem.querySelector(`img`);
  newPinItemImg.src = pinInfo.avatar;
  newPinItemImg.alt = pinInfo.offer.title;
  return newPinItem;
};

for (let i = 1; i <= 8; i++) {
  let newSign = createSign(i);
  signsList.push(newSign);
}

map.classList.remove(`map--faded`);

const pinFragment = document.createDocumentFragment();

for (let i of signsList) {
  let newItem = createPin(i);
  pinFragment.appendChild(newItem);
}

pinsList.appendChild(pinFragment);
