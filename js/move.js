'use strict';

(function () {
  const mapOverlay = document.querySelector(`.map__overlay`);
  const mapPinMain = document.querySelector(`.map__pin--main`);

  const MAP_HEIGHT_MAX = 630;
  const PIN_WIDTH = window.pin.PIN_WIDTH;
  const PIN_HEIGHT = window.pin.PIN_HEIGHT;
  const MAP_MIN_COORD_Y = mapOverlay.offsetTop;
  const MAP_MAX_COORD_Y = mapOverlay.offsetTop + MAP_HEIGHT_MAX;
  const MAP_MIN_COORD_X = mapOverlay.offsetLeft;
  const MAP_MAX_COORD_X = mapOverlay.offsetLeft + mapOverlay.offsetWidth;
  const MAP_PIN_MAIN_INITIAL_X = parseInt(mapPinMain.offsetLeft, 10);
  const MAP_PIN_MAIN_INITIAL_Y = parseInt(mapPinMain.offsetTop, 10);

  let startCoords = {
    x: 0,
    y: 0
  };

  // перемещение метки мышкой
  const moveMouse = (moveEvt) => {
    moveEvt.preventDefault();

    let shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY,
    };

    startCoords.x = moveEvt.clientX;
    startCoords.y = moveEvt.clientY;

    let posY = mapPinMain.offsetTop - shift.y;
    let posX = mapPinMain.offsetLeft - shift.x;

    if (posY <= (MAP_MIN_COORD_Y - PIN_HEIGHT)) {
      posY = MAP_MIN_COORD_Y - PIN_HEIGHT;
    } else if (posY >= MAP_MAX_COORD_Y) {
      posY = MAP_MAX_COORD_Y;
    }

    if (posX <= (MAP_MIN_COORD_X - PIN_WIDTH / 2)) {
      posX = MAP_MIN_COORD_X - PIN_WIDTH / 2;
    } else if (posX >= MAP_MAX_COORD_X - PIN_WIDTH / 2) {
      posX = MAP_MAX_COORD_X - PIN_WIDTH / 2;
    }

    mapPinMain.style.top = `${posY}px`;
    mapPinMain.style.left = `${posX}px`;
  };

  // обработчик передвижения нажатой мышки
  const onTraceMainPin = (evt) => {
    evt.preventDefault();
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const onMouseMove = (moveEvt) => {
      moveMouse(moveEvt);
      window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_HEIGHT);
    };

    const onMouseUp = () => {
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    document.addEventListener(`mousemove`, onMouseMove);

    document.addEventListener(`mouseup`, onMouseUp);
  };

  const setInitialPosition = () => {
    mapPinMain.style.top = `${MAP_PIN_MAIN_INITIAL_Y}px`;
    mapPinMain.style.left = `${MAP_PIN_MAIN_INITIAL_X}px`;
  };

  window.move = {
    onTraceMainPin,
    setInitialPosition
  };

})();
