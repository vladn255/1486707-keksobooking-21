'use strict';

const MAX_ROOMS_COUNT = 100;
const MAX_PRICE = 1000000;
const TITLE_MIN_LENGTH = 30;
const TITLE_MAX_LENGTH = 100;
const PIN_WIDTH = window.pin.PIN_WIDTH;
const PIN_HEIGHT = window.pin.PIN_HEIGHT;
const PIN_TAIL = window.pin.PIN_TAIL;

const adForm = document.querySelector(`.ad-form`);
const map = document.querySelector(`.map`);
const mapFilters = document.querySelector(`.map__filters`);
const capacity = adForm.querySelector(`#capacity`);
const roomNumber = adForm.querySelector(`#room_number`);
const inputAddress = adForm.querySelector(`#address`);
const titleInput = adForm.querySelector(`#title`);
const priceInput = adForm.querySelector(`#price`);
const typeInput = adForm.querySelector(`#type`);
const checkinInput = adForm.querySelector(`#timein`);
const checkoutInput = adForm.querySelector(`#timeout`);

const typesListPriceMin = window.data.typesListPriceMin;

const formInputsSet = {
  adForm: adForm.querySelectorAll(`fieldset`),
  mapFilter: mapFilters,
  mapFiltersFieldsets: mapFilters.querySelectorAll(`fieldset`),
  mapFiltersSelects: mapFilters.querySelectorAll(`select`)
};

// выставление статуса форм ввода
const setInputsStatus = (collection, boolean) => {
  for (let item of collection) {
    if (boolean) {
      item.setAttribute(`disabled`, true);
    } else {
      item.removeAttribute(`disabled`);
    }
  }
};

// задание условий правильности формы комнат
const setRoomsValidity = () => {
  let roomNumberValue = parseInt(roomNumber.value, 10);
  let capacityValue = parseInt(capacity.value, 10);
  if ((roomNumberValue < capacityValue) && (roomNumberValue !== MAX_ROOMS_COUNT)) {
    capacity.setCustomValidity(`Количество гостей превышает допустимое для указанного количества комнат`);
  } else if ((roomNumberValue === MAX_ROOMS_COUNT) && (capacityValue !== 0)) {
    roomNumber.setCustomValidity(`Такое количество комнат предназначено не для гостей`);
  } else if ((roomNumberValue !== MAX_ROOMS_COUNT) && (capacityValue === 0)) {
    capacity.setCustomValidity(`Укажите количество комнат - 100`);
  } else {
    capacity.setCustomValidity(``);
    roomNumber.setCustomValidity(``);
  }
};

// выставление условий правильности формы заголовка
const setTitleValidity = () => {
  const titleInputLength = titleInput.value.length;
  if (titleInputLength < TITLE_MIN_LENGTH) {
    titleInput.setCustomValidity(`Минимальное количество символов - 30`);
  } else if (titleInputLength > TITLE_MAX_LENGTH) {
    titleInput.setCustomValidity(`Максимальное количество символов - 100`);
  } else {
    titleInput.setCustomValidity(``);
  }
};

// выставление условий правильности заполнения типа
const setTypeValidity = () => {
  const minPrice = typesListPriceMin[typeInput.value];
  priceInput.setAttribute(`placeholder`, `${minPrice}`);
};

// выставление условий правильности заполнения цены
const setPriceValidity = () => {
  const priceInputValue = parseInt(priceInput.value, 10);
  const minPrice = typesListPriceMin[typeInput.value];

  if (priceInputValue < minPrice) {
    priceInput.setCustomValidity(`цена не может быть меньше ${minPrice}`);
  } else if (priceInputValue > MAX_PRICE) {
    priceInput.setCustomValidity(`цена не может быть больше ${MAX_PRICE}`);
  } else {
    priceInput.setCustomValidity(``);
  }
};

// выставление условий правильности заполнения времени
const setTimeValidity = (time) => {
  const timeValue = time.value;
  let checkinTime = checkinInput.value;
  let checkoutTime = checkoutInput.value;

  if (checkinTime !== checkoutTime) {
    checkinInput.value = timeValue;
    checkoutInput.value = timeValue;
  }
};

// установка статуса "недоступно" в форме
const setDisabledAttribute = () => {
  setInputsStatus(formInputsSet.adForm, true);
  setInputsStatus(formInputsSet.mapFilter, true);
  setInputsStatus(formInputsSet.mapFiltersFieldsets, true);
  setInputsStatus(formInputsSet.mapFiltersSelects, true);
};

// удаление статуса "недоступно" в форме
const removeDisabledAttribute = () => {
  setInputsStatus(formInputsSet.adForm, false);
  setInputsStatus(formInputsSet.mapFilter, false);
  setInputsStatus(formInputsSet.mapFiltersFieldsets, false);
  setInputsStatus(formInputsSet.mapFiltersSelects, false);
};

// установка значения адреса в форме
const setAddressValue = (pin, width = PIN_WIDTH / 2, height = PIN_HEIGHT / 2) => {
  let leftPosition = parseInt(pin.style.left, 10);
  let topPosition = parseInt(pin.style.top, 10);
  inputAddress.value = `${Math.round(leftPosition + width / 2)}, ${Math.round(topPosition + height + PIN_TAIL)}`;
};

// обработчик выставления количества комнат
const onSetRooms = () => {
  setRoomsValidity();
  capacity.reportValidity();
  roomNumber.reportValidity();
};

// обработчик ввода заголовка
const onInputTitle = () => {
  setTitleValidity();
  titleInput.reportValidity();
};

// обработчик изменения типа
const onChangeType = () => {
  setTypeValidity();
  typeInput.reportValidity();
};

// обработчик ввода цены
const onInputPrice = () => {
  setPriceValidity();
  priceInput.reportValidity();
};

// обработчик ввода времени
const onSetTime = (evt) => {
  const timestamp = evt.currentTarget;
  setTimeValidity(timestamp);
};


// сброс состояния формы
const resetForm = () => {
  setDisabledAttribute();
  map.classList.add(`map--faded`);
  adForm.classList.add(`ad-form--disabled`);

  adForm.reset();
  mapFilters.reset();
};

window.form = {
  setDisabledAttribute,
  removeDisabledAttribute,
  setAddressValue,
  onSetRooms,
  onInputTitle,
  onChangeType,
  onInputPrice,
  onSetTime,
  resetForm
};

