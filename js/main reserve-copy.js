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

const pinsList = [];
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

// утилитарная функция
const generateRandomInt = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};
// утилитарная функция
const getRandomSingleData = (array) => {
  return array[generateRandomInt(0, array.length - 1)];
};
// утилитарная функция
const getRandomArrayData = (array) => {
  let randomArray = [];
  let arrayEntriesNumber = generateRandomInt(0, array.length - 1);
  for (let i = 0; i <= arrayEntriesNumber; i++) {
    randomArray.push(getRandomSingleData(array));
  }
  return randomArray;
};
// генерирование данных
const generateAvatarName = (n) => {
  let avatarName = AVATAR_NAME_START + n + AVATAR_NAME_END;
  return avatarName;
};
// генерирование данных
const generateLocation = () => {
  let location = {
    x: generateRandomInt(0, mapBlockWidth),
    y: generateRandomInt(MAP_HEIGHT_MIN, MAP_HEIGHT_MAX)
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
  let newPrice = generateRandomInt(typesListPriceMin[type], PRICE_MAX);
  return newPrice;
};
// генерирование данных (случайное количество комнат)
const getRooms = () => {
  let roomsCount = ROOMS_COUNT[generateRandomInt(0, ROOMS_COUNT.length - 1)];
  return roomsCount;
};
// генерирование данных (количество гостей)
const getGuests = () => {
  let guestsCount = GUEST_COUNT[generateRandomInt(0, GUEST_COUNT.length - 1)];
  return guestsCount;
};
// генерирование объявления
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
// создание метки на карте
const createPin = (pinInfo, index) => {
  let newPinItem = pinTemplate.cloneNode(true);
  newPinItem.style.left = `${(pinInfo.location.x - PIN_WIDTH / 2)}px`;
  newPinItem.style.top = `${(pinInfo.location.y - PIN_HEIGHT)}px`;

  let newPinItemImg = newPinItem.querySelector(`img`);
  newPinItemImg.src = pinInfo.avatar;
  newPinItemImg.alt = pinInfo.offer.title;
  newPinItem.dataset.id = index;
  return newPinItem;
};
// генерирование набора меток
const generatePinsArray = () => {
  for (let i = 0; i < AUTHORS_COUNT; i++) {
    let newSign = generateSign(i + 1);
    pinsList.push(newSign);
  }
};
// создание фрагмента с метками
const createPinsFragment = () => {
  let pinFragment = document.createDocumentFragment();

  for (let i = 0; i < pinsList.length; i++) {
    pinFragment.appendChild(createPin(pinsList[i], i));
  }
  return pinFragment;
};
// создание и вставка на карту набора меток
const createPinsList = () => {
  generatePinsArray();
  mapPins.appendChild(createPinsFragment());
};
// получение перевода типа жилья из карты значений
const getTypeTranslation = (type) => {
  let newTypeTranslation = typesListTranslations[type];
  return newTypeTranslation;
};
// генерирование списка удобств (создание нод)
const generateFeaturesItem = (featuresObjectItem) => {
  let newFeaturesItem = document.createElement(`li`);
  newFeaturesItem.classList.add(`popup__feature`);
  newFeaturesItem.classList.add(`popup__feature--${featuresObjectItem}`);

  return newFeaturesItem;
};
// создание фрагмента со списком удобств
const createFeaturesFragment = (featuresObject) => {
  let featuresFragment = document.createDocumentFragment();
  for (let feature of featuresObject) {
    featuresFragment.appendChild(generateFeaturesItem(feature));
  }
  return featuresFragment;
};
// генерирование фотографии по переданному адресу
const generatePhotoItem = (photoItem) => {
  let newPhotoItem = cardTemplate.querySelector(`.popup__photo`).cloneNode(true);
  newPhotoItem.src = photoItem;
  return newPhotoItem;
};
// вставка сгенерированных фотографий во фрагмент
const createPhotoFragment = (featuresObject) => {
  let photoFragment = document.createDocumentFragment();
  for (let featureObject of featuresObject) {
    photoFragment.appendChild(generatePhotoItem(featureObject));
  }
  return photoFragment;
};
// рендер карточки объявления
const renderCard = (pin) => {
  let newCard = document.querySelector(`.map__card`);

  if (!newCard) {
    newCard = cardTemplate.cloneNode(true);
  }

  if (pin.offer.address) {
    newCard.querySelector(`.popup__text--address`).textContent = pin.offer.address;
  }
  if (pin.offer.price) {
    newCard.querySelector(`.popup__text--price`).textContent = pin.offer.price;
  }
  if (pin.offer.type) {
    newCard.querySelector(`.popup__type`).textContent = getTypeTranslation(pin.offer.type);
  }
  if (pin.offer.rooms && pin.offer.guests) {
    newCard.querySelector(`.popup__text--capacity`).textContent = `${pin.offer.rooms} комнаты для ${pin.offer.guests} гостей`;
  }
  if (pin.offer.checkin && pin.offer.checkout) {
    newCard.querySelector(`.popup__text--time`).textContent = `Заезд после ${pin.offer.checkin}, выезд до ${pin.offer.checkout}`;
  }
  if (pin.offer.features) {
    newCard.querySelector(`.popup__features`).innerHTML = ``;
    newCard.querySelector(`.popup__features`).appendChild(createFeaturesFragment(pin.offer.features));
  }
  if (pin.offer.description) {
    newCard.querySelector(`.popup__description`).textContent = pin.offer.description;
  }
  if (pin.offer.photos) {
    newCard.querySelector(`.popup__photos`).innerHTML = ``;
    newCard.querySelector(`.popup__photos`).appendChild(createPhotoFragment(pin.offer.photos));
  }
  if (pin.avatar) {
    newCard.querySelector(`.popup__avatar`).src = pin.avatar;
  }

  return newCard;
};
// вставка карточки объявления на карту
const insertCard = (card) => {
  map.insertBefore(card, map.querySelector(`.map__filters-container`));
};
// добавление подписчиков показа карточки
const addShowCardListeners = () => {
  const mapPinsList = mapPins.querySelectorAll(`.map__pin:not(.map__pin--main)`);
  for (let mapPin of mapPinsList) {
    mapPin.addEventListener(`click`, onShowCard);
  }
};
// удаление подписчиков показа карточки
// const removeShowCardListeners = () => {
//   const mapPinsList = mapPins.querySelectorAll(`.map__pin:not(.map__pin--main)`);
//   for (let mapPin of mapPinsList) {
//     mapPin.removeEventListener(`click`, onShowCard);
//   }
// };


// команда показа карточки
const showCard = (pinNumber) => {
  const cardNumber = pinsList[pinNumber];
  insertCard(renderCard(cardNumber));

  const mapCardPopup = document.querySelector(`.map__card`);
  const mapCardPopupClose = mapCardPopup.querySelector(`.popup__close`);
  mapCardPopup.classList.remove(`visually-hidden`);

  mapCardPopupClose.addEventListener(`click`, onCloseCardPopup);
  map.addEventListener(`keydown`, onCloseCardPopup);
};
// обработчик события для показа карточки
const onShowCard = (evt) => {
  if (document.querySelector(`.map__card`)) {
    closeCardPopup();
  }
  const mapPinNumber = evt.currentTarget.dataset.id;
  showCard(mapPinNumber);
};
// команда скрытия карточки объявления
const closeCardPopup = () => {
  document.querySelector(`.map__card`).classList.add(`visually-hidden`);
  addShowCardListeners();
};
// обработчик события для скрытия карточки
const onCloseCardPopup = (evt) => {
  if ((evt.button === 0) || (evt.key === KEY_ESCAPE)) {
    closeCardPopup();
  }
};
// выставление статуса форм ввода
const setInputsStatus = (collection, boolean) => {
  for (let item of collection) {
    if (boolean) {
      item.setAttribute(`disabled`, true);
    } else {
      item.removeAttribute(`disabled`);
    }
  }
};
// выставление статуса "недоступно" в форме
const setDisabledAttribute = () => {
  setInputsStatus(formInputsSet.adForm, true);
  setInputsStatus(formInputsSet.mapFilter, true);
  setInputsStatus(formInputsSet.mapFiltersFieldsets, true);
  setInputsStatus(formInputsSet.mapFiltersSelects, true);
};
// удаление статуса "недоступно" в форме
const removeDisabledAttribute = () => {
  setInputsStatus(formInputsSet.adForm, false);
  setInputsStatus(formInputsSet.mapFilter, false);
  setInputsStatus(formInputsSet.mapFiltersFieldsets, false);
  setInputsStatus(formInputsSet.mapFiltersSelects, false);
};
// установка значения адреса в форме
const setAddressValue = (pin, width = PIN_WIDTH, height = PIN_HEIGHT) => {
  let leftPosition = parseInt(pin.style.left, 10);
  let topPosition = parseInt(pin.style.top, 10);
  inputAddress.value = `${Math.round(leftPosition + width / 2)}, ${Math.round(topPosition + height)}`;
};
// обработчик события выставления активного состояния
const onSetActiveMode = (evt) => {
  if (evt.button === 0 || evt.key === KEY_ENTER) {
    createPinsList();
    addShowCardListeners();

    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);
    removeDisabledAttribute();

    mapPinMain.removeEventListener(`mousedown`, onSetActiveMode);
    mapPinMain.removeEventListener(`keydown`, onSetActiveMode);

    setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT);

    mapPinMain.removeEventListener(`mousedown`, onSetActiveMode);
    mapPinMain.removeEventListener(`keydown`, onSetActiveMode);

    adForm.addEventListener(`change`, onSetRooms);
    titleInput.addEventListener(`input`, onInputTitle);
    typeInput.addEventListener(`change`, onChangeType);
    typeInput.addEventListener(`change`, onInputPrice);
    priceInput.addEventListener(`input`, onInputPrice);
    checkinInput.addEventListener(`change`, onSetTime);
    checkoutInput.addEventListener(`change`, onSetTime);
    setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT / 2);
  }
};
// задание условий правильности формы комнат
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
// обработчик выставления количества комнат
const onSetRooms = () => {
  setRoomsValidity();
  capacity.reportValidity();
  roomNumber.reportValidity();
};
// выставление условий правильности формы заголовка
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
// обработчик ввода заголовка
const onInputTitle = () => {
  setTitleValidity();
  titleInput.reportValidity();
};
// выставление условий правильности заполнения типа
const setTypeValidity = () => {
  const minPrice = typesListPriceMin[typeInput.value];
  priceInput.setAttribute(`placeholder`, `${minPrice}`);
};
// обработчик изменения типа
const onChangeType = () => {
  setTypeValidity();
  typeInput.reportValidity();
};
// выставление условий правильности заполнения цены
const setPriceValidity = () => {
  const priceInputValue = parseInt(priceInput.value, 10);
  const minPrice = typesListPriceMin[typeInput.value];

  if (priceInputValue < minPrice) {
    priceInput.setCustomValidity(`цена не может быть меньше ${minPrice}`);
  } else {
    priceInput.setCustomValidity(``);
  }
};
// обработчик ввода цены
const onInputPrice = () => {
  setPriceValidity();
  priceInput.reportValidity();
};
// выставление условий правильности заполнения времени
const setTimeValidity = (time) => {
  const timeValue = time.value;
  let checkinTime = checkinInput.value;
  let checkoutTime = checkoutInput.value;

  if (checkinTime !== checkoutTime) {
    checkinInput.value = timeValue;
    checkoutInput.value = timeValue;
  }
};
// обработчик ввода времени
const onSetTime = (evt) => {
  const timestamp = evt.currentTarget;
  setTimeValidity(timestamp);
};

mapPinMain.addEventListener(`mousedown`, onSetActiveMode);

mapPinMain.addEventListener(`keydown`, onSetActiveMode);
// установка изначальных условий
setDisabledAttribute();
