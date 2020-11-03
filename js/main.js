'use strict';
(function () {
  const KEY_ENTER = `Enter`;
  const PIN_WIDTH = window.pin.PIN_WIDTH;
  const PIN_MAIN_HEIGHT = window.pin.PIN_MAIN_HEIGHT;
  const map = document.querySelector(`.map`);
  const mapPinMain = document.querySelector(`.map__pin--main`);
  const adForm = document.querySelector(`.ad-form`);
  const formReset = document.querySelector(`.ad-form__reset`);

  // обработчик события выставления активного состояния
  const onSetActiveMode = (evt) => {

    if (evt.button === 0 || evt.key === KEY_ENTER) {
      window.card.createPinsList();
      window.map.addShowCardListeners();

      map.classList.remove(`map--faded`);
      window.form.adForm.classList.remove(`ad-form--disabled`);
      window.form.removeDisabledAttribute();

      window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT);

      mapPinMain.removeEventListener(`mouseup`, onSetActiveMode);
      mapPinMain.removeEventListener(`keydown`, onSetActiveMode);

      window.form.adForm.addEventListener(`change`, window.form.onSetRooms);
      window.form.titleInput.addEventListener(`input`, window.form.onInputTitle);
      window.form.typeInput.addEventListener(`change`, window.form.onChangeType);
      window.form.typeInput.addEventListener(`change`, window.form.onInputPrice);
      window.form.priceInput.addEventListener(`input`, window.form.onInputPrice);
      window.form.checkinInput.addEventListener(`change`, window.form.onSetTime);
      window.form.checkoutInput.addEventListener(`change`, window.form.onSetTime);
      window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT / 2);
    }
  };

  const onMouseUp = () => {
    document.removeEventListener(`mousemove`, onMouseMove);
    mapPinMain.removeEventListener(`mouseup`, onMouseUp);
    mapPinMain.addEventListener(`mouseup`, onSetActiveMode);
  };

  const onMouseMove = () => {
    mapPinMain.removeEventListener(`mouseup`, onSetActiveMode);
    mapPinMain.addEventListener(`mouseup`, onMouseUp);
  };

  const onMouseDown = () => {
    document.addEventListener(`mousemove`, onMouseMove);
  };

  // установка изначальных условий
  const setInitialState = () => {
    mapPinMain.addEventListener(`mousedown`, window.move.onTraceMainPin);
    mapPinMain.addEventListener(`mousedown`, onMouseDown);
    mapPinMain.addEventListener(`mouseup`, onSetActiveMode);
    mapPinMain.addEventListener(`keydown`, onSetActiveMode);
    window.card.removePinsList();
    window.form.resetForm();
    window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT);
  };

  setInitialState();

  adForm.addEventListener(`submit`, window.form.submitHandler);
  formReset.addEventListener(`click`, window.form.onReset);

  window.form.setDisabledAttribute();

})();
