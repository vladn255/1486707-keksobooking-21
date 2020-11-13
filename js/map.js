'use strict';

const map = document.querySelector(`.map`);
const mapPins = document.querySelector(`.map__pins`);

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

// команда показа карточки
const showCard = (pinNumber) => {
  const cardNumberArray = window.data.filterPins();
  if (cardNumberArray.length !== 0) {
    const cardNumber = cardNumberArray[pinNumber];
    insertCard(window.card.renderCard(cardNumber));

    const mapCardPopup = document.querySelector(`.map__card`);
    const mapCardPopupClose = mapCardPopup.querySelector(`.popup__close`);
    mapCardPopup.classList.remove(`visually-hidden`);

    mapCardPopupClose.addEventListener(`click`, onCloseCardPopup);
    map.addEventListener(`keydown`, onCloseCardPopup);
  }
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
  if (document.querySelector(`.map__card`)) {
    document.querySelector(`.map__card`).classList.add(`visually-hidden`);
  }
  addShowCardListeners();
};

// обработчик события для скрытия карточки
const onCloseCardPopup = (evt) => {
  if ((evt.button === 0) || (evt.key === window.util.KEY_ESCAPE)) {
    closeCardPopup();
  }
};
window.map = {
  addShowCardListeners,
  closeCardPopup
};


