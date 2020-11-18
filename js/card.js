'use strict';

const mapPins = document.querySelector(`.map__pins`);
const cardTemplate = document.querySelector(`#card`)
  .content;

const typesListTranslations = {
  bungalow: `Бунгало`,
  flat: `Квартира`,
  house: `Дом`,
  palace: `Дворец`
};

// получение перевода типа жилья из карты значений
const getTypeTranslation = (type) => {
  return typesListTranslations[type];
};

// создание списка удобств
const createFeaturesItem = (featuresObjectItem) => {
  let newFeaturesItem = document.createElement(`li`);
  newFeaturesItem.classList.add(`popup__feature`);
  newFeaturesItem.classList.add(`popup__feature--${featuresObjectItem}`);

  return newFeaturesItem;
};

// создание фрагмента со списком удобств
const createFeaturesFragment = (featuresArray) => {
  let featuresFragment = document.createDocumentFragment();
  for (let feature of featuresArray) {
    featuresFragment.appendChild(createFeaturesItem(feature));
  }
  return featuresFragment;
};

// генерирование фотографии по переданному адресу
const generatePhotoItem = (photoItem) => {
  let newPhotoItem = cardTemplate.querySelector(`.popup__photo`).cloneNode(true);
  newPhotoItem.src = photoItem;
  return newPhotoItem;
};

// вставка сгенерированных фотографий во фрагмент
const createPhotoFragment = (photos) => {
  let photoFragment = document.createDocumentFragment();
  for (let photo of photos) {
    photoFragment.appendChild(generatePhotoItem(photo));
  }
  return photoFragment;
};

// создание и вставка на карту набора меток
const createPinsList = () => {
  const pinsFragment = window.pin.createPinsFragment();
  mapPins.appendChild(pinsFragment);
};

// удаление набора меток с карты
const removePinsList = () => {
  const mapPinsList = mapPins.querySelectorAll(`.map__pin:not(.map__pin--main)`);
  mapPinsList.forEach((pin) => {
    pin.remove();
  });
};

// рендер карточки объявления
const render = (pin) => {
  let newCard = document.querySelector(`.map__card`);

  if (!newCard) {
    newCard = cardTemplate.cloneNode(true);
  }

  if (pin.offer.address) {
    newCard.querySelector(`.popup__text--address`).textContent = pin.offer.address;
  }
  if (pin.offer.price) {
    newCard.querySelector(`.popup__text--price`).textContent = pin.offer.price;
  }
  if (pin.offer.type) {
    newCard.querySelector(`.popup__type`).textContent = getTypeTranslation(pin.offer.type);
  }
  if (pin.offer.rooms && pin.offer.guests) {
    newCard.querySelector(`.popup__text--capacity`).textContent = `${pin.offer.rooms} комнаты для ${pin.offer.guests} гостей`;
  }
  if (pin.offer.checkin && pin.offer.checkout) {
    newCard.querySelector(`.popup__text--time`).textContent = `Заезд после ${pin.offer.checkin}, выезд до ${pin.offer.checkout}`;
  }
  if (pin.offer.features) {
    newCard.querySelector(`.popup__features`).innerHTML = ``;
    newCard.querySelector(`.popup__features`).appendChild(createFeaturesFragment(pin.offer.features));
  }
  if (pin.offer.description) {
    newCard.querySelector(`.popup__description`).textContent = pin.offer.description;
  }
  if (pin.offer.photos) {
    newCard.querySelector(`.popup__photos`).innerHTML = ``;
    newCard.querySelector(`.popup__photos`).appendChild(createPhotoFragment(pin.offer.photos));
  }
  if (pin.author && pin.author.avatar) {
    newCard.querySelector(`.popup__avatar`).src = pin.author.avatar;
  }
  if (pin.offer.title) {
    newCard.querySelector(`.popup__title`).textContent = pin.offer.title;
  }

  return newCard;
};

window.card = {
  createPinsList,
  removePinsList,
  render
};


