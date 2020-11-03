'use strict';
(function () {
  const KEY_ESCAPE = `Escape`;
  const typesListPriceMin = {
    'bungalow': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  const errorTemplate = document.querySelector(`#error`)
    .content
    .querySelector(`.error`);

  const pinsList = [];

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

  // обработчик успешного получения данных об авторах с сервера - добавляет их в массив pinsList
  const successHandler = (authors) => {
    for (let author of authors) {
      pinsList.push(author);
    }
    if (document.querySelector(`.new__error`)) {
      document.querySelector(`.new__error`).querySelector(`.error__button`)
        .removeEventListener(`click`, window.backend.load(successHandler, errorHandler));
      removeErrorBlock();
    }
  };

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

  window.backend.load(successHandler, errorHandler);

  window.data = {
    typesListPriceMin,
    pinsList,
    removeErrorBlock,
    errorHandler
  };
})();
