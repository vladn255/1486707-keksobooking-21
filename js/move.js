'use strict';

const MAP_HEIGHT_MAX = 630;
const MAP_HEIGHT_MIN = 130;
const PIN_WIDTH = document.querySelector(`.map__pin--main`).offsetWidth;
const PIN_HEIGHT = document.querySelector(`.map__pin--main`).offsetHeight;
const PIN_TAIL = window.pin.TAIL;
const MAP_MIN_COORD_Y = document.querySelector(`.map__overlay`).offsetTop + MAP_HEIGHT_MIN;
const MAP_MAX_COORD_Y = document.querySelector(`.map__overlay`).offsetTop + MAP_HEIGHT_MAX;
const MAP_MIN_COORD_X = document.querySelector(`.map__overlay`).offsetLeft;
const MAP_MAX_COORD_X = document.querySelector(`.map__overlay`).offsetLeft + document.querySelector(`.map__overlay`).offsetWidth;
const MAP_PIN_MAIN_INITIAL_X = parseInt(document.querySelector(`.map__pin--main`).offsetLeft, 10);
const MAP_PIN_MAIN_INITIAL_Y = parseInt(document.querySelector(`.map__pin--main`).offsetTop, 10);

const mapPinMain = document.querySelector(`.map__pin--main`);

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

  if (posY <= (MAP_MIN_COORD_Y - PIN_HEIGHT - PIN_TAIL)) {
    posY = MAP_MIN_COORD_Y - PIN_HEIGHT - PIN_TAIL;
  } else if (posY >= MAP_MAX_COORD_Y - PIN_HEIGHT - PIN_TAIL) {
    posY = MAP_MAX_COORD_Y - PIN_HEIGHT - PIN_TAIL;
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


