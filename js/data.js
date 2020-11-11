'use strict';
(function () {
  const KEY_ESCAPE = `Escape`;
  const PIN_QUANTITY = 5;
  const typesListPriceMin = {
    'bungalow': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  const map = document.querySelector(`.map`);
  const housingType = map.querySelector(`#housing-type`);

  const errorTemplate = document.querySelector(`#error`)
    .content
    .querySelector(`.error`);

  const initialPinsList = [];

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
    return housingTypeValue === `any`
      ? true
      : element.offer.type === housingTypeValue;
  };

  // фильтр массива меток по заданным условиям
  const filterPins = () => {
    const filteredArray = [];

    for (let i = 0; i < initialPinsList.length; i++) {
      if (filteredArray.length === PIN_QUANTITY) {
        break;
      }
      let pin = initialPinsList[i];
      if (isHousingType(pin)) {
        filteredArray.push(pin);
      }
    }

    return filteredArray;
  };

  window.backend.load(successHandler, errorHandler);

  window.data = {
    typesListPriceMin,
    removeErrorBlock,
    errorHandler,
    filterPins
  };
})();
