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
const PIN_MAIN_HEIGHT = 44;
const AUTHORS_COUNT = 8;

const signsList = [];
const map = document.querySelector(`.map`);
const mapBlockWidth = map.offsetWidth;
const pinTemplate = document.querySelector(`#pin`)
  .content
  .querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`)
  .content;
const mapPins = document.querySelector(`.map__pins`);
const typesListPriceMin = {
  'bungalow': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};
const typesListTranslations = {
  'bungalow': `Бунгало`,
  'flat': `Квартира`,
  'house': `Дом`,
  'palace': `Дворец`
};
const adForm = document.querySelector(`.ad-form`);
const mapFilters = document.querySelector(`.map__filters`);
const mapPinMain = document.querySelector(`.map__pin--main`);
const capacity = adForm.querySelector(`#capacity`);
const roomNumber = adForm.querySelector(`#room_number`);

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
  let guestsCount = GUEST_COUNT[generateRandomInt(0, GUEST_COUNT.length - 1)];
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
  mapPins.appendChild(createPinsFragment());
};

const getTypeTranslation = (type) => {
  let newTypeTranslation = typesListTranslations[type];
  return newTypeTranslation;
};

const generateFeaturesItem = (featuresObjectItem) => {
  let newFeaturesItem = document.createElement(`li`);
  newFeaturesItem.classList.add(`popup__feature`);
  newFeaturesItem.classList.add(`popup__feature--${featuresObjectItem}`);

  return newFeaturesItem;
};

const createFeaturesFragment = (featuresObject) => {
  let featuresFragment = document.createDocumentFragment();
  for (let i of featuresObject) {
    featuresFragment.appendChild(generateFeaturesItem(i));
  }
  return featuresFragment;
};

const generatePhotoItem = (photoItem) => {
  let newPhotoItem = cardTemplate.querySelector(`.popup__photo`).cloneNode(true);
  newPhotoItem.src = photoItem;
  return newPhotoItem;
};

const createPhotoFragment = (featuresObject) => {
  let photoFragment = document.createDocumentFragment();
  for (let i of featuresObject) {
    photoFragment.appendChild(generatePhotoItem(i));
  }
  return photoFragment;
};

const createCard = (pin) => {
  let newCard = cardTemplate.cloneNode(true);
  newCard.querySelector(`.popup__text--address`).textContent = pin.offer.address;
  newCard.querySelector(`.popup__text--price`).textContent = pin.offer.price;
  newCard.querySelector(`.popup__type`).textContent = getTypeTranslation(pin.offer.type);
  newCard.querySelector(`.popup__text--capacity`).textContent = `${pin.offer.rooms} комнаты для ${pin.offer.guests} гостей`;
  newCard.querySelector(`.popup__text--time`).textContent = `Заезд после ${pin.offer.checkin}, выезд до ${pin.offer.checkout}`;
  newCard.querySelector(`.popup__features`).innerHTML = ``;
  newCard.querySelector(`.popup__features`).appendChild(createFeaturesFragment(pin.offer.features));
  newCard.querySelector(`.popup__description`).textContent = pin.offer.description;
  newCard.querySelector(`.popup__photos`).innerHTML = ``;
  newCard.querySelector(`.popup__photos`).appendChild(createPhotoFragment(pin.offer.photos));
  newCard.querySelector(`.popup__avatar`).src = pin.avatar;

  return newCard;
};

const insertCard = (card) => {
  map.insertBefore(card, map.querySelector(`.map__filters-container`));
};

const showFirstCard = () => {
  let firstCard = signsList[0];
  insertCard(createCard(firstCard));
};

const setInitialMode = () => {
  setInputsStatus(adForm.querySelectorAll(`fieldset`), true);
  setInputsStatus(mapFilters, true);
  setInputsStatus(mapFilters.querySelectorAll(`fieldset`), true);
  setInputsStatus(mapFilters.querySelectorAll(`select`), true);
};

const setAddressValue = (pin, width = PIN_WIDTH, height = PIN_HEIGHT) => {
  let leftPosition = parseInt(pin.style.left, 10);
  let topPosition = parseInt(pin.style.top, 10);
  adForm.querySelector(`input[name="address"]`).value = `${Math.round(leftPosition + width / 2)}, ${Math.round(topPosition + height)}`;
};

const setInputsStatus = (collection, boolean) => {
  for (let item of collection) {
    item.disabled = boolean;
  }
};

const onSetActiveMode = (evt) => {
  if (evt.button === 0 || evt.key === `Enter`) {
    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);
    setInputsStatus(adForm.querySelectorAll(`fieldset`), false);
    setInputsStatus(mapFilters, false);
    setInputsStatus(mapFilters.querySelectorAll(`fieldset`), false);
    setInputsStatus(mapFilters.querySelectorAll(`select`), false);

    setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT);
  }
};

const setRoomsValidity = () => {
  let roomNumberValue = parseInt(roomNumber.value, 10);
  let capacityValue = parseInt(capacity.value, 10);
  if ((roomNumberValue < capacityValue) && (roomNumberValue !== ROOMS_COUNT[ROOMS_COUNT.length - 1])) {
    capacity.setCustomValidity(`Количество гостей превышает допустимое для указанного количества комнат`);
  } else if ((roomNumberValue === ROOMS_COUNT[ROOMS_COUNT.length - 1]) && (capacityValue !== 0)) {
    roomNumber.setCustomValidity(`Такое количество комнат предназначено не для гостей`);
  } else if ((roomNumberValue !== ROOMS_COUNT[ROOMS_COUNT.length - 1]) && (capacityValue === 0)) {
    capacity.setCustomValidity(`Укажите количество комнат - 100`);
  } else {
    capacity.setCustomValidity(``);
    roomNumber.setCustomValidity(``);
  }
  capacity.reportValidity();
  roomNumber.reportValidity();
};

const onSetRoomsValidity = () => {
  setRoomsValidity();
};

adForm.addEventListener(`change`, onSetRoomsValidity);

mapPins.addEventListener(`mousedown`, onSetActiveMode);

mapPins.addEventListener(`keydown`, onSetActiveMode);

setInitialMode();

setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT / 2);

createPinsList();

showFirstCard();
