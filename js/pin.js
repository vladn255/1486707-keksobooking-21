'use strict';
(function () {
  const PIN_WIDTH = 40;
  const PIN_HEIGHT = 40;
  const PIN_MAIN_HEIGHT = 44;

  const pinTemplate = document.querySelector(`#pin`)
    .content
    .querySelector(`.map__pin`);


  // создание метки на карте
  const createPin = (pinInfo, index) => {
    let newPinItem = pinTemplate.cloneNode(true);
    newPinItem.style.left = `${(pinInfo.location.x - window.pin.PIN_WIDTH / 2)}px`;
    newPinItem.style.top = `${(pinInfo.location.y - window.pin.PIN_HEIGHT)}px`;

    let newPinItemImg = newPinItem.querySelector(`img`);
    newPinItemImg.src = pinInfo.avatar;
    newPinItemImg.alt = pinInfo.offer.title;
    newPinItem.dataset.id = index;
    return newPinItem;
  };

  // создание фрагмента с метками
  const createPinsFragment = () => {
    let pinFragment = document.createDocumentFragment();

    for (let i = 0; i < window.data.pinsList.length; i++) {
      pinFragment.appendChild(createPin(window.data.pinsList[i], i));
    }
    return pinFragment;
  };

  window.pin = {
    PIN_WIDTH,
    PIN_HEIGHT,
    PIN_MAIN_HEIGHT,

    createPinsFragment
  };
})();
