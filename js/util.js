'use strict';

const KEY_ESCAPE = `Escape`;
const KEY_ENTER = `Enter`;
const errorTemplate = document.querySelector(`#error`)
  .content
  .querySelector(`.error`);

const successTemplate = document.querySelector(`#success`)
  .content
  .querySelector(`.success`);

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


// создание блока ошибки
const createErrorBlock = (errorMessage) => {
  let newError = errorTemplate.cloneNode(true);
  let newErrorTextMessage = newError.querySelector(`.error__message`);
  newErrorTextMessage.textContent = errorMessage;

  return newError;
};

// удаление блока ошибки
const removeErrorBlock = () => {
  document.querySelector(`.error`).remove();
};


// создание блока сообщения об успешной отправки
const createSuccessBlock = () => {
  let newSuccess = successTemplate.cloneNode(true);
  newSuccess.classList.add(`new__success`);
  document.body.insertAdjacentElement(`afterbegin`, newSuccess);
};

// удаление блока сообщения об успешной отправки
const removeSuccessBlock = () => {
  document.querySelector(`.new__success`).remove();
};

window.util = {
  KEY_ESCAPE,
  KEY_ENTER,
  generateRandomInt,
  getRandomSingleData,
  getRandomArrayData,
  createErrorBlock,
  removeErrorBlock,
  createSuccessBlock,
  removeSuccessBlock
};

