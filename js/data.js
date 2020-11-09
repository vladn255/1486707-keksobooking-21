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
  const checkHousingType = (pinsArray) => {
    const housingTypeValue = housingType.value;
    if (housingTypeValue !== `any`) {
      window.data.pinsList = pinsArray.filter((pinElement) => {
        return pinElement.offer.type === housingTypeValue;
      });
    } else {
      window.data.pinsList = initialPinsList;
    }
    return pinsList;
  };

  // проверка совпадения фильтра ценового диапазона
  const checkHousingPrice = (pinsArray) => {
    const housingPriceValue = housingPrice.value;
    if (housingPriceValue === `middle`) {
      window.data.pinsList = pinsArray.filter((pinElement) => {
        return (pinElement.offer.price >= priceRangeList.min && pinElement.offer.price < priceRangeList.max);
      });
    } else if (housingPriceValue === `low`) {
      window.data.pinsList = pinsArray.filter((pinElement) => {
        return (pinElement.offer.price < priceRangeList.min);
      });
    } else if (housingPriceValue === `high`) {
      window.data.pinsList = pinsArray.filter((pinElement) => {
        return (pinElement.offer.price >= priceRangeList.max);
      });
    } else if (housingPriceValue === `any`) {
      window.data.pinsList = initialPinsList;
    }

    return pinsList;
  };

  // проверка совпадения фильтра количества комнат
  const checkHousingRooms = (pinsArray) => {
    const housingRoomsValue = housingRooms.value;
    if (housingRoomsValue !== `any`) {
      window.data.pinsList = pinsArray.filter((pinElement) => {
        return pinElement.offer.rooms === parseInt(housingRoomsValue, 10);
      });
    } else {
      window.data.pinsList = initialPinsList;
    }
    return pinsList;
  };

  // проверка совпадения фильтра количества гостей
  const checkHousingGuests = (pinsArray) => {
    const housingGuestsValue = housingGuests.value;
    if (housingGuestsValue !== `any`) {
      window.data.pinsList = pinsArray.filter((pinElement) => {
        return pinElement.offer.guests === parseInt(housingGuestsValue, 10);
      });
    } else {
      window.data.pinsList = initialPinsList;
    }
    return pinsList;
  };

  // проверка совпадения фильтра дополнительных удобств
  const checkHousingFeatures = (pinsArray) => {
    const housingFeaturesChecked = [];
    const housingFeaturesList = housingFeatures.querySelectorAll(`.map__checkbox`);
    for (let featureInput of housingFeaturesList) {
      if (featureInput.checked) {
        let featureInputLabel = featureInput.id;
        housingFeaturesChecked.push(featureInputLabel.slice(7));
      }
    }
    window.data.pinsList = pinsArray.filter((pinElement) => {
      return housingFeaturesChecked.every((element) => {
        return pinElement.offer.features.includes(element);
      });
    });
    return pinsList;
  };

  // фильтр массива меток по заданным условиям
  const filterPins = () => {
    checkHousingType(initialPinsList);
    checkHousingPrice(initialPinsList);
    checkHousingRooms(initialPinsList);
    checkHousingGuests(initialPinsList);
    checkHousingFeatures(initialPinsList);
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
