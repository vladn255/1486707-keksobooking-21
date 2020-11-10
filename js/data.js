'use strict';
(function () {
  const KEY_ESCAPE = `Escape`;
  const typesListPriceMin = {
    'bungalow': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  const priceRangeList = {
    min: 10000,
    max: 50000
  };
  const map = document.querySelector(`.map`);
  const housingType = map.querySelector(`#housing-type`);
  const housingPrice = map.querySelector(`#housing-price`);
  const housingRooms = map.querySelector(`#housing-rooms`);
  const housingGuests = map.querySelector(`#housing-guests`);
  const housingFeatures = map.querySelector(`#housing-features`);

  const errorTemplate = document.querySelector(`#error`)
    .content
    .querySelector(`.error`);

  const initialPinsList = [];
  let pinsList = initialPinsList;

  // создание блока ошибки
  const createErrorBlock = (errorMessage) => {
    let newError = errorTemplate.cloneNode(true);
    newError.classList.add(`new__error`);
    let newErrorTextMessage = newError.querySelector(`.error__message`);
    newErrorTextMessage.textContent = errorMessage;

    return newError;
  };

  // удаление блока ошибки
  const removeErrorBlock = () => {
    document.querySelector(`.new__error`).remove();
  };

  // обработчик успешного получения данных об авторах с сервера - добавляет их в массив initialPinsList
  const successHandler = (authors) => {
    for (let author of authors) {
      initialPinsList.push(author);
    }
    if (document.querySelector(`.new__error`)) {
      document.querySelector(`.new__error`).querySelector(`.error__button`)
        .removeEventListener(`click`, window.backend.load(successHandler, errorHandler));
      removeErrorBlock();
    }
  };

  // обработчик получения ошибки при получении данных с сервера
  const errorHandler = (textMessage) => {
    if (document.querySelector(`.new__error`)) {
      removeErrorBlock();
    }

    const onCloseError = (evt) => {
      if (evt.button === 0 || evt.key === KEY_ESCAPE) {
        window.backend.load(successHandler, errorHandler);
      }
    };
    document.body.insertAdjacentElement(`afterbegin`, createErrorBlock(textMessage));
    document.querySelector(`.new__error`).querySelector(`.error__button`)
      .addEventListener(`mousedown`, onCloseError);
    document.addEventListener(`click`, onCloseError);
    document.addEventListener(`keydown`, onCloseError);
  };

  // проверка совпадения фильтра типа жилья заданному
  const isHousingType = (element) => {
    const housingTypeValue = housingType.value;
    if (housingTypeValue !== `any`) {
      return element.offer.type === housingTypeValue
        ? true
        : false;

    } else {
      return true;
    }
  };

  // проверка совпадения фильтра ценового диапазона
  const isHousingPrice = (element) => {
    const housingPriceValue = housingPrice.value;
    if (housingPriceValue === `middle`) {
      return (element.offer.price >= priceRangeList.min && element.offer.price < priceRangeList.max)
        ? true
        : false;
    } else if (housingPriceValue === `low`) {
      return element.offer.price < priceRangeList.min
        ? true
        : false;
    } else if (housingPriceValue === `high`) {
      return element.offer.price >= priceRangeList.max
        ? true
        : false;
    } else {
      return true;
    }
  };

  // проверка совпадения фильтра количества комнат
  const isHousingRooms = (element) => {
    const housingRoomsValue = housingRooms.value;
    if (housingRoomsValue !== `any`) {
      return element.offer.rooms === parseInt(housingRoomsValue, 10)
        ? true
        : false;
    } else {
      return true;
    }
  };

  // проверка совпадения фильтра количества гостей
  const isHousingGuests = (element) => {
    const housingGuestsValue = housingGuests.value;
    if (housingGuestsValue !== `any`) {
      return element.offer.guests === parseInt(housingGuestsValue, 10)
        ? true
        : false;
    } else {
      return true;
    }
  };

  // проверка совпадения фильтра дополнительных удобств
  const isHousingFeatures = (element) => {
    const housingFeaturesChecked = [];
    const housingFeaturesList = housingFeatures.querySelectorAll(`.map__checkbox`);
    for (let featureInput of housingFeaturesList) {
      if (featureInput.checked) {
        let featureInputLabel = featureInput.id;
        housingFeaturesChecked.push(featureInputLabel.slice(7));
      }
    }
    return housingFeaturesChecked.every((feature) => {
      return element.offer.features.includes(feature);
    });

  };

  // фильтр массива меток по заданным условиям
  const filterPins = () => {
    const filteredArray = [];

    initialPinsList.forEach((pin) => {
      if (isHousingType(pin)
        && isHousingPrice(pin)
        && isHousingRooms(pin)
        && isHousingGuests(pin)
        && isHousingFeatures(pin)) {
        filteredArray.push(pin);
      }
    });

    window.data.pinsList = filteredArray;
  };

  window.backend.load(successHandler, errorHandler);

  window.data = {
    typesListPriceMin,
    pinsList,
    removeErrorBlock,
    errorHandler,
    filterPins
  };
})();
