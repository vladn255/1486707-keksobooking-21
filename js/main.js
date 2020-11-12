'use strict';
(function () {
  const PIN_WIDTH = window.pin.PIN_WIDTH;
  const PIN_MAIN_HEIGHT = window.pin.PIN_MAIN_HEIGHT;
  const map = document.querySelector(`.map`);
  const mapPinMain = document.querySelector(`.map__pin--main`);
  const adForm = document.querySelector(`.ad-form`);
  const formReset = document.querySelector(`.ad-form__reset`);
  const housingType = map.querySelector(`#housing-type`);
  const housingPrice = map.querySelector(`#housing-price`);
  const housingRooms = map.querySelector(`#housing-rooms`);
  const housingGuests = map.querySelector(`#housing-guests`);
  const housingFeatures = map.querySelector(`#housing-features`);
  const titleInput = adForm.querySelector(`#title`);
  const priceInput = adForm.querySelector(`#price`);
  const typeInput = adForm.querySelector(`#type`);
  const checkinInput = adForm.querySelector(`#timein`);
  const checkoutInput = adForm.querySelector(`#timeout`);

  // обработчик события выставления активного состояния
  const onSetActiveMode = (evt) => {

    if (evt.button === 0 || evt.key === window.util.KEY_ENTER) {
      window.card.createPinsList(window.pin.pinsFragment);
      window.map.addShowCardListeners();

      map.classList.remove(`map--faded`);
      adForm.classList.remove(`ad-form--disabled`);
      window.form.removeDisabledAttribute();

      window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT);

      mapPinMain.removeEventListener(`mouseup`, onSetActiveMode);
      mapPinMain.removeEventListener(`keydown`, onSetActiveMode);

      adForm.addEventListener(`change`, window.form.onSetRooms);
      titleInput.addEventListener(`input`, window.form.onInputTitle);
      typeInput.addEventListener(`change`, window.form.onChangeType);
      typeInput.addEventListener(`change`, window.form.onInputPrice);
      priceInput.addEventListener(`input`, window.form.onInputPrice);
      checkinInput.addEventListener(`change`, window.form.onSetTime);
      checkoutInput.addEventListener(`change`, window.form.onSetTime);
      window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT / 2);
    }
  };

  // обработчик клика на экране успешной отправки
  const onSuccessClick = (evt) => {
    if (evt.button === 0 || evt.key === window.util.KEY_ESCAPE) {
      window.util.removeSuccessBlock();
      document.removeEventListener(`click`, onSuccessClick);
      document.removeEventListener(`keydown`, onSuccessClick);
    }
  };

  // обработчик отправки формы
  const submitHandler = (evt) => {
    evt.preventDefault();
    if (document.querySelector(`.new__error`)) {
      window.data.removeErrorBlock();
    }

    const onSuccess = () => {
      window.util.createSuccessBlock();
      mapPinMain.removeEventListener(`mousedown`, window.move.onTraceMainPin);
      mapPinMain.removeEventListener(`mousedown`, onSetActiveMode);
      mapPinMain.removeEventListener(`keydown`, onSetActiveMode);
      setInitialState();

      document.addEventListener(`click`, onSuccessClick);
      document.addEventListener(`keydown`, onSuccessClick);
    };

    window.backend.save(new FormData(adForm), onSuccess, window.data.errorHandler);
  };

  // установка изначальных условий
  const setInitialState = () => {
    mapPinMain.addEventListener(`mousedown`, window.move.onTraceMainPin);
    mapPinMain.addEventListener(`mousedown`, onSetActiveMode);
    mapPinMain.addEventListener(`keydown`, onSetActiveMode);
    window.card.removePinsList();
    window.form.resetForm();
    window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_MAIN_HEIGHT);
    window.move.setInitialPosition();
  };

  // обработчик изменения состояния фильтра
  const onChangeFilter = () => {
    window.card.removePinsList();
    window.data.filterPins();
    window.card.createPinsList(window.pin.pinsFragment);
    window.map.closeCardPopup();
  };

  housingType.addEventListener(`change`, window.backend.debounce(onChangeFilter));
  housingPrice.addEventListener(`change`, window.backend.debounce(onChangeFilter));
  housingRooms.addEventListener(`change`, window.backend.debounce(onChangeFilter));
  housingGuests.addEventListener(`change`, window.backend.debounce(onChangeFilter));
  housingFeatures.addEventListener(`change`, window.backend.debounce(onChangeFilter));

  setInitialState();

  adForm.addEventListener(`submit`, submitHandler);
  formReset.addEventListener(`click`, setInitialState);

  window.form.setDisabledAttribute();

})();
