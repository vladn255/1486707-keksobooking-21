'use strict';
(function () {
  const mapPins = document.querySelector(`.map__pins`);
  const cardTemplate = document.querySelector(`#card`)
    .content;

  const typesListTranslations = {
    'bungalow': `Бунгало`,
    'flat': `Квартира`,
    'house': `Дом`,
    'palace': `Дворец`
  };

  // получение перевода типа жилья из карты значений
  const getTypeTranslation = (type) => {
    let newTypeTranslation = typesListTranslations[type];
    return newTypeTranslation;
  };

  // создание списка удобств
  const createFeaturesItem = (featuresObjectItem) => {
    let newFeaturesItem = document.createElement(`li`);
    newFeaturesItem.classList.add(`popup__feature`);
    newFeaturesItem.classList.add(`popup__feature--${featuresObjectItem}`);

    return newFeaturesItem;
  };

  // создание фрагмента со списком удобств
  const createFeaturesFragment = (featuresObject) => {
    let featuresFragment = document.createDocumentFragment();
    for (let feature of featuresObject) {
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
  const createPhotoFragment = (featuresObject) => {
    let photoFragment = document.createDocumentFragment();
    for (let featureObject of featuresObject) {
      photoFragment.appendChild(generatePhotoItem(featureObject));
    }
    return photoFragment;
  };

  // создание и вставка на карту набора меток
  const createPinsList = () => {
    mapPins.appendChild(window.pin.createPinsFragment());
  };

  // удаление набора меток с карты
  const removePinsList = () => {
    const pins = mapPins.querySelectorAll(`.map__pin`);
    for (let pin of pins) {
      if (!pin.classList.contains(`map__pin--main`)) {
        pin.remove();
      }
    }
  };

  // рендер карточки объявления
  const renderCard = (pin) => {
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
    if (pin.avatar) {
      newCard.querySelector(`.popup__avatar`).src = pin.avatar;
    }

    return newCard;
  };

  window.card = {
    createPinsList,
    removePinsList,
    renderCard
  };

})();
