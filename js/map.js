'use strict';
(function () {
  const KEY_ENTER = `Enter`;
  const KEY_ESCAPE = `Escape`;
  const mapPinMain = document.querySelector(`.map__pin--main`);

  // вставка карточки объявления на карту
  const insertCard = (card) => {
    window.main.map.insertBefore(card, window.main.map.querySelector(`.map__filters-container`));
  };

  // добавление подписчиков показа карточки
  const addShowCardListeners = () => {
    const mapPinsList = window.main.mapPins.querySelectorAll(`.map__pin:not(.map__pin--main)`);
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
    const cardNumber = window.data.pinsList[pinNumber];
    insertCard(window.card.renderCard(cardNumber));

    const mapCardPopup = document.querySelector(`.map__card`);
    const mapCardPopupClose = mapCardPopup.querySelector(`.popup__close`);
    mapCardPopup.classList.remove(`visually-hidden`);

    mapCardPopupClose.addEventListener(`click`, onCloseCardPopup);
    window.main.map.addEventListener(`keydown`, onCloseCardPopup);
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

  // обработчик события выставления активного состояния
  const onSetActiveMode = (evt) => {
    if (evt.button === 0 || evt.key === KEY_ENTER) {
      window.card.createPinsList();
      addShowCardListeners();

      window.main.map.classList.remove(`map--faded`);
      window.form.adForm.classList.remove(`ad-form--disabled`);
      window.form.removeDisabledAttribute();

      mapPinMain.removeEventListener(`mousedown`, onSetActiveMode);
      mapPinMain.removeEventListener(`keydown`, onSetActiveMode);

      window.form.setAddressValue(mapPinMain, window.pin.PIN_WIDTH, window.pin.PIN_MAIN_HEIGHT);

      mapPinMain.removeEventListener(`mousedown`, onSetActiveMode);
      mapPinMain.removeEventListener(`keydown`, onSetActiveMode);

      window.form.adForm.addEventListener(`change`, window.form.onSetRooms);
      window.form.titleInput.addEventListener(`input`, window.form.onInputTitle);
      window.form.typeInput.addEventListener(`change`, window.form.onChangeType);
      window.form.typeInput.addEventListener(`change`, window.form.onInputPrice);
      window.form.priceInput.addEventListener(`input`, window.form.onInputPrice);
      window.form.checkinInput.addEventListener(`change`, window.form.onSetTime);
      window.form.checkoutInput.addEventListener(`change`, window.form.onSetTime);
      window.form.setAddressValue(mapPinMain, window.pin.PIN_WIDTH, window.pin.PIN_MAIN_HEIGHT / 2);
    }
  };

  // установка изначальных условий
  mapPinMain.addEventListener(`mousedown`, onSetActiveMode);

  mapPinMain.addEventListener(`keydown`, onSetActiveMode);

  window.form.setDisabledAttribute();

})();
