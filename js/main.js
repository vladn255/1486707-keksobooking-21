'use strict';
(function () {
  const KEY_ENTER = `Enter`;
  const map = document.querySelector(`.map`);
  const mapPinMain = document.querySelector(`.map__pin--main`);

  // обработчик события выставления активного состояния
  const onSetActiveMode = (evt) => {
    if (evt.button === 0 || evt.key === KEY_ENTER) {
      window.card.createPinsList();
      window.map.addShowCardListeners();

      map.classList.remove(`map--faded`);
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
