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
const MAX_ROOMS_COUNT = 100;
const KEY_ENTER = `Enter`;
const KEY_ESCAPE = `Escape`;
const TITLE_MIN_LENGTH = 30;
const TITLE_MAX_LENGTH = 100;

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
const formInputsSet = {
  adForm: adForm.querySelectorAll(`fieldset`),
  mapFilter: mapFilters,
  mapFiltersFieldsets: mapFilters.querySelectorAll(`fieldset`),
  mapFiltersSelects: mapFilters.querySelectorAll(`select`)
};
const inputAddress = adForm.querySelector(`input[name="address"]`);
const titleInput = adForm.querySelector(`#title`);
const priceInput = adForm.querySelector(`#price`);
const typeInput = adForm.querySelector(`#type`);
const checkinInput = adForm.querySelector(`#timein`);
const checkoutInput = adForm.querySelector(`#timeout`);

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

const getCardNumber = (pin) => {
  const imgSrcValue = pin.querySelector(`img`).getAttribute(`src`);
  const pinNumber = parseInt(imgSrcValue.replace(AVATAR_NAME_START, ``), 10);
  const cardNumber = pinNumber - 1;

  return cardNumber;
};

const addShowCardListeners = () => {
  const mapPinsList = mapPins.querySelectorAll(`.map__pin`);
  for (let i of mapPinsList) {
    i.addEventListener(`click`, onShowCard);
  }
};

const removeShowCardListeners = () => {
  const mapPinsList = mapPins.querySelectorAll(`.map__pin`);
  for (let i of mapPinsList) {
    i.removeEventListener(`click`, onShowCard);
  }
};

const showCard = (number) => {
  insertCard(createCard(signsList[number]));

  const mapCardPopup = document.querySelector(`.map__card`);
  const mapCardPopupClose = mapCardPopup.querySelector(`.popup__close`);

  removeShowCardListeners();
  mapCardPopupClose.addEventListener(`click`, onCloseCardPopup);
  map.addEventListener(`keydown`, onCloseCardPopup);
};

const showFirstCard = () => {
  showCard(0);
};

const onShowCard = (evt) => {
  if (!evt.currentTarget.matches(`.map__pin--main`)) {
    const mapPinNumber = getCardNumber(evt.currentTarget);
    showCard(mapPinNumber);
  }
};

const closeCardPopup = () => {
  document.querySelector(`.map__card`).remove();
};

const onCloseCardPopup = (evt) => {
  if ((evt.button === 0) || (evt.key === KEY_ESCAPE)) {
    closeCardPopup();
    addShowCardListeners();
  }
};

const setInputsStatus = (collection, boolean) => {
  for (let item of collection) {
    if (boolean) {
      item.setAttribute(`disabled`, true);
    } else {
      item.removeAttribute(`disabled`);
    }
  }
};

const setDisabledAttribute = () => {
  setInputsStatus(formInputsSet.adForm, true);
  setInputsStatus(formInputsSet.mapFilter, true);
  setInputsStatus(formInputsSet.mapFiltersFieldsets, true);
  setInputsStatus(formInputsSet.mapFiltersSelects, true);
};

const removeDisabledAttribute = () => {
  setInputsStatus(formInputsSet.adForm, false);
  setInputsStatus(formInputsSet.mapFilter, false);
  setInputsStatus(formInputsSet.mapFiltersFieldsets, false);
  setInputsStatus(formInputsSet.mapFiltersSelects, false);
};

const setAddressValue = (pin, width = PIN_WIDTH, height = PIN_HEIGHT) => {
  let leftPosition = parseInt(pin.style.left, 10);
  let topPosition = parseInt(pin.style.top, 10);
  inputAddress.value = `${Math.round(leftPosition + width / 2)}, ${Math.round(topPosition + height)}`;
};

const onSetActiveMode = (evt) => {
  createPinsList();
  showFirstCard();

  if (evt.button === 0 || evt.key === KEY_ENTER) {
    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);
    removeDisabledAttribute();

    mapPinMain.removeEventListener(`mousedown`, onSetActiveMode);
    mapPinMain.removeEventListener(`keydown`, onSetActiveMode);

    setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT);
  }
};

const setRoomsValidity = () => {
  let roomNumberValue = parseInt(roomNumber.value, 10);
  let capacityValue = parseInt(capacity.value, 10);
  if ((roomNumberValue < capacityValue) && (roomNumberValue !== MAX_ROOMS_COUNT)) {
    capacity.setCustomValidity(`Количество гостей превышает допустимое для указанного количества комнат`);
  } else if ((roomNumberValue === MAX_ROOMS_COUNT) && (capacityValue !== 0)) {
    roomNumber.setCustomValidity(`Такое количество комнат предназначено не для гостей`);
  } else if ((roomNumberValue !== MAX_ROOMS_COUNT) && (capacityValue === 0)) {
    capacity.setCustomValidity(`Укажите количество комнат - 100`);
  } else {
    capacity.setCustomValidity(``);
    roomNumber.setCustomValidity(``);
  }
};

const onSetRoomsValidity = () => {
  setRoomsValidity();
  capacity.reportValidity();
  roomNumber.reportValidity();
};

const setTitleValidity = () => {
  const titleInputLength = titleInput.value.length;
  if (titleInputLength < TITLE_MIN_LENGTH) {
    titleInput.setCustomValidity(`Минимальное количество символов - 30`);
  } else if (titleInputLength > TITLE_MAX_LENGTH) {
    titleInput.setCustomValidity(`Максимальное количество символов - 100`);
  } else {
    titleInput.setCustomValidity(``);
  }
};

const onSetTitleValidity = () => {
  setTitleValidity();
  titleInput.reportValidity();
};

const setTypeValidity = () => {
  const minPrice = typesListPriceMin[typeInput.value];
  priceInput.setAttribute(`placeholder`, `${minPrice}`);
};

const onSetTypeValidity = () => {
  setTypeValidity();
  typeInput.reportValidity();
};

const setPriceValidity = () => {
  const priceInputValue = priceInput.value;
  const minPrice = typesListPriceMin[typeInput.value];

  if (priceInputValue < minPrice) {
    priceInput.setCustomValidity(`цена не может быть меньше ${minPrice}`);
  } else {
    priceInput.setCustomValidity(``);
  }
};

const onSetPriceValidity = () => {
  setPriceValidity();
  priceInput.reportValidity();
};

const setSelectedAttribute = (select, value) => {
  for (let i = 0; i < select.length; i++) {
    if (select[i].value === value) {
      select[i].setAttribute(`selected`, true);
    }
  }
};

const setTimeValidity = (time) => {
  const timeValue = time.value;
  let checkinTime = checkinInput.value;
  let checkoutTime = checkoutInput.value;

  if (timeValue !== checkinTime) {
    setSelectedAttribute(checkinInput, timeValue);
  } else if (timeValue !== checkoutTime) {
    setSelectedAttribute(checkoutInput, timeValue);
  }
};

const onSetTimeValidity = (evt) => {
  const timestamp = evt.currentTarget;
  setTimeValidity(timestamp);
};

adForm.addEventListener(`change`, onSetRoomsValidity);
titleInput.addEventListener(`input`, onSetTitleValidity);
typeInput.addEventListener(`change`, onSetTypeValidity);
priceInput.addEventListener(`change`, onSetPriceValidity);
checkinInput.addEventListener(`change`, onSetTimeValidity);

mapPinMain.addEventListener(`mousedown`, onSetActiveMode);

mapPinMain.addEventListener(`keydown`, onSetActiveMode);

setDisabledAttribute();

setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT / 2);
