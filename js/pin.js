'use strict';

const WIDTH = document.querySelector(`.map__pin--main`).offsetWidth;
const HEIGHT = document.querySelector(`.map__pin--main`).offsetHeight;
const QUANTITY = 5;
const TAIL = 18;

const pinTemplate = document.querySelector(`#pin`)
  .content
  .querySelector(`.map__pin`);

// создание метки на карте
const createPin = (pinInfo, index) => {
  let newPinItem = pinTemplate.cloneNode(true);
  newPinItem.style.left = `${(pinInfo.location.x - WIDTH / 2)}px`;
  newPinItem.style.top = `${(pinInfo.location.y - HEIGHT)}px`;

  let newPinItemImg = newPinItem.querySelector(`img`);
  newPinItemImg.src = pinInfo.author.avatar;
  newPinItemImg.alt = pinInfo.offer.title;
  newPinItem.dataset.id = index;
  return newPinItem;
};

// создание фрагмента с метками
const createPinsFragment = () => {
  const pinsList = window.data.filterPins();
  let pinFragment = document.createDocumentFragment();
  let pinsCount = pinsList.length < QUANTITY
    ? pinsList.length
    : QUANTITY;

  for (let i = 0; i < pinsCount; i++) {
    if (pinsList[i].offer) {
      pinFragment.appendChild(createPin(pinsList[i], i));
    }
  }

  return pinFragment;
};

window.pin = {
  WIDTH,
  HEIGHT,
  QUANTITY,
  TAIL,

  createPinsFragment
};

