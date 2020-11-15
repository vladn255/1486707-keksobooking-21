'use strict';

const PIN_QUANTITY = 5;
const PRICE_RANGE_MIN = 10000;
const PRICE_RANGE_MAX = 50000;
const typesListPriceMin = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

const map = document.querySelector(`.map`);
const housingType = map.querySelector(`#housing-type`);
const housingPrice = map.querySelector(`#housing-price`);
const housingRooms = map.querySelector(`#housing-rooms`);
const housingGuests = map.querySelector(`#housing-guests`);
const housingFeatures = map.querySelector(`#housing-features`);

let initialPins = [];

// обработчик успешного получения данных об авторах с сервера - добавляет их в массив initialPins
const onSucces = (dataPins) => {
  if (document.querySelector(`.error`)) {
    document.querySelector(`.error__button`)
      .removeEventListener(`click`, window.backend.load(onSucces, onError));
    window.util.removeErrorBlock();
  }

  initialPins = dataPins.slice();
};

// обработчик закрытия окна ошибки
const onCloseError = (evt) => {
  if (evt.button === 0 || evt.key === window.util.KEY_ESCAPE) {
    window.backend.load(onSucces, onError);
  }
};

// обработчик получения ошибки при получении данных с сервера
const onError = (textMessage) => {
  if (document.querySelector(`.error`)) {
    window.util.removeErrorBlock();
  }

  document.body.insertAdjacentElement(`afterbegin`, window.util.createErrorBlock(textMessage));
  document.querySelector(`.error__button`)
    .addEventListener(`mousedown`, onCloseError);
  document.addEventListener(`click`, onCloseError);
  document.addEventListener(`keydown`, onCloseError);
};

// проверка совпадения фильтра типа жилья заданному
const isHousingType = (element) => {
  const housingTypeValue = housingType.value;
  return housingTypeValue === `any`
    ? true
    : element.offer.type === housingTypeValue;
};

// проверка совпадения фильтра ценового диапазона
const isHousingPrice = (element) => {
  const housingPriceValue = housingPrice.value;
  if (housingPriceValue === `middle`) {
    return (element.offer.price >= PRICE_RANGE_MIN && element.offer.price < PRICE_RANGE_MAX);
  } else if (housingPriceValue === `low`) {
    return element.offer.price < PRICE_RANGE_MIN;
  } else if (housingPriceValue === `high`) {
    return element.offer.price >= PRICE_RANGE_MAX;
  } else {
    return true;
  }
};

// проверка совпадения фильтра количества комнат
const isHousingRooms = (element) => {
  const housingRoomsValue = housingRooms.value;
  return housingRoomsValue === `any`
    ? true
    : element.offer.rooms === parseInt(housingRoomsValue, 10);
};

// проверка совпадения фильтра количества гостей
const isHousingGuests = (element) => {
  const housingGuestsValue = housingGuests.value;
  return housingGuestsValue === `any`
    ? true
    : element.offer.guests === parseInt(housingGuestsValue, 10);
};

// проверка совпадения фильтра дополнительных удобств
const isHousingFeatures = (element, feature) => {
  const housingFeatureInput = housingFeatures.querySelector(`#filter-${feature}`);
  return housingFeatureInput.checked
    ? element.offer.features.includes(feature)
    : true;
};

// фильтр массива меток по заданным условиям
const filterPins = () => {
  const filteredPins = [];

  for (let i = 0; i < initialPins.length; i++) {
    if (filteredPins.length === PIN_QUANTITY) {
      break;
    }
    let pin = initialPins[i];
    if (isHousingType(pin)
      && isHousingPrice(pin)
      && isHousingRooms(pin)
      && isHousingGuests(pin)
      && isHousingFeatures(pin, `wifi`)
      && isHousingFeatures(pin, `dishwasher`)
      && isHousingFeatures(pin, `parking`)
      && isHousingFeatures(pin, `washer`)
      && isHousingFeatures(pin, `elevator`)
      && isHousingFeatures(pin, `conditioner`)) {
      filteredPins.push(pin);
    }
  }

  return filteredPins;
};

window.backend.load(onSucces, onError);

window.data = {
  typesListPriceMin,
  onError,
  filterPins
};

