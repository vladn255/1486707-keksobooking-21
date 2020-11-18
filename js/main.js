'use strict';

const PIN_WIDTH = document.querySelector(`.map__pin--main`).offsetWidth;
const PIN_HEIGHT = document.querySelector(`.map__pin--main`).offsetHeight;
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
const onSetActiveModeClick = (evt) => {

  if (evt.button === 0) {
    window.card.removePinsList();
    window.card.createPinsList(window.pin.pinsFragment);
    window.map.addShowCardListeners();

    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);
    window.form.setDisabledAttribute(false);

    window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_HEIGHT);

    mapPinMain.removeEventListener(`mouseup`, onSetActiveModeClick);
    mapPinMain.removeEventListener(`keydown`, onSetActiveModeKeydown);

    adForm.addEventListener(`change`, window.form.onSetRooms);
    titleInput.addEventListener(`input`, window.form.onInputTitle);
    typeInput.addEventListener(`change`, window.form.onChangeType);
    typeInput.addEventListener(`change`, window.form.onInputPrice);
    priceInput.addEventListener(`input`, window.form.onInputPrice);
    checkinInput.addEventListener(`change`, window.form.onSetTime);
    checkoutInput.addEventListener(`change`, window.form.onSetTime);
  }
};

const onSetActiveModeKeydown = (evt) => {

  if (evt.key === window.util.KEY_ENTER) {
    window.card.removePinsList();
    window.card.createPinsList(window.pin.pinsFragment);
    window.map.addShowCardListeners();

    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);
    window.form.setDisabledAttribute(false);

    window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_HEIGHT);

    mapPinMain.removeEventListener(`mouseup`, onSetActiveModeClick);
    mapPinMain.removeEventListener(`keydown`, onSetActiveModeKeydown);

    adForm.addEventListener(`change`, window.form.onSetRooms);
    titleInput.addEventListener(`input`, window.form.onInputTitle);
    typeInput.addEventListener(`change`, window.form.onChangeType);
    typeInput.addEventListener(`change`, window.form.onInputPrice);
    priceInput.addEventListener(`input`, window.form.onInputPrice);
    checkinInput.addEventListener(`change`, window.form.onSetTime);
    checkoutInput.addEventListener(`change`, window.form.onSetTime);
  }
};

// обработчик клика на экране успешной отправки
const onSuccessClick = (evt) => {
  if (evt.button === 0) {
    window.util.removeSuccessBlock();
    document.removeEventListener(`click`, onSuccessClick);
    document.removeEventListener(`keydown`, onSuccessKeydown);
  }
};

const onSuccessKeydown = (evt) => {
  if (evt.key === window.util.KEY_ESCAPE) {
    window.util.removeSuccessBlock();
    document.removeEventListener(`click`, onSuccessClick);
    document.removeEventListener(`keydown`, onSuccessKeydown);
  }
};

// обработчик отправки формы
const onSubmit = (evt) => {
  evt.preventDefault();
  if (document.querySelector(`.new__error`)) {
    window.data.removeErrorBlock();
  }

  const onSuccess = () => {
    window.util.createSuccessBlock();
    mapPinMain.removeEventListener(`mousedown`, window.move.onTraceMainPin);
    mapPinMain.removeEventListener(`mousedown`, onSetActiveModeClick);
    mapPinMain.removeEventListener(`keydown`, onSetActiveModeKeydown);

    onSetInitialState();

    document.addEventListener(`click`, onSuccessClick);
    document.addEventListener(`keydown`, onSuccessKeydown);
  };

  window.backend.save(new FormData(adForm), onSuccess, window.data.onError);
};

// установка изначальных условий
const onSetInitialState = () => {
  mapPinMain.addEventListener(`mousedown`, window.move.onTraceMainPin);
  mapPinMain.addEventListener(`mousedown`, onSetActiveModeClick);
  mapPinMain.addEventListener(`keydown`, onSetActiveModeKeydown);

  window.card.removePinsList();
  window.form.reset();
  window.move.setInitialPosition();
  window.form.setAddressValue(mapPinMain);
  window.map.closeCardPopup();
};

// обработчик изменения состояния фильтра
const onChangeFilter = () => {
  window.card.removePinsList();
  window.data.filterPins();
  window.card.createPinsList(window.pin.pinsFragment);
  window.map.addShowCardListeners();
  window.map.closeCardPopup();
};

housingType.addEventListener(`change`, window.backend.debounce(onChangeFilter));
housingPrice.addEventListener(`change`, window.backend.debounce(onChangeFilter));
housingRooms.addEventListener(`change`, window.backend.debounce(onChangeFilter));
housingGuests.addEventListener(`change`, window.backend.debounce(onChangeFilter));
housingFeatures.addEventListener(`change`, window.backend.debounce(onChangeFilter));

onSetInitialState();

adForm.addEventListener(`submit`, onSubmit);
formReset.addEventListener(`click`, onSetInitialState);

window.form.setDisabledAttribute(true);


