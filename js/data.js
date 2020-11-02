'use strict';
(function () {
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

  // обработчик успешного получения данных об авторах с сервера - добавляет их в массив pinsList
  const successHandler = (authors) => {
    for (let author of authors) {
      pinsList.push(author);
    }
    if (document.querySelector(`.new__error`)) {
      document.querySelector(`.new__error`).remove();
      document.querySelector(`.new__error`).querySelector(`.error__button`)
        .removeEventListener(`click`, window.backend.load(successHandler, errorHandler));
    }
  };

  const errorHandler = (textMessage) => {
    if (document.querySelector(`.new__error`)) {
      document.querySelector(`.new__error`).remove();
    }
    document.body.insertAdjacentElement(`afterbegin`, createErrorBlock(textMessage));
    document.querySelector(`.new__error`).querySelector(`.error__button`)
      .addEventListener(`click`, window.backend.load(successHandler, errorHandler));
  };

  window.backend.load(successHandler, errorHandler);

  window.data = {
    typesListPriceMin,
    pinsList,
  };
})();
