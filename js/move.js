'use strict';

(function () {
  const map = document.querySelector(`.map`);
  const mapPinMain = document.querySelector(`.map__pin--main`);
  const mapBlockHeight = document.querySelector(`.map`).offsetHeight;
  const mapBlockWidth = document.querySelector(`.map`).offsetWidth;

  const PIN_WIDTH = window.pin.PIN_WIDTH;
  const PIN_HEIGHT = window.pin.PIN_HEIGHT;
  const mapMinCoordY = map.offsetTop;
  const mapMaxCoordY = map.offsetTop + mapBlockHeight;
  const mapMinCoordX = map.offsetLeft;
  const mapMaxCoordX = map.offsetLeft + mapBlockWidth;

  let startCoords = {
    x: 0,
    y: 0
  };

  // Проверка того, что заданный элемент находится в пределах блока "карта"
  const checkIfCursorInsideMap = (posX, posY) => {
    let check;
    if ((posY < mapMinCoordY) || (posY > mapMaxCoordY) || (posX < mapMinCoordX) || (posX > mapMaxCoordX)) {
      check = true;
    }
    return check;
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

    let mapPinMainStyleTop = mapPinMain.offsetTop - shift.y;
    let mapPinMainStyleLeft = mapPinMain.offsetLeft - shift.x;

    if (checkIfCursorInsideMap(startCoords.x, startCoords.y)) {
      return;
    }

    mapPinMain.style.top = `${mapPinMainStyleTop}px`;
    mapPinMain.style.left = `${mapPinMainStyleLeft}px`;
  };

  // обработчик передвижения нажатой мышки
  const onTraceMainPin = (evt, listener) => {
    evt.preventDefault();
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const onMouseMove = (moveEvt) => {
      moveMouse(moveEvt);
      window.form.setAddressValue(mapPinMain, PIN_WIDTH, PIN_HEIGHT);
      mapPinMain.removeEventListener(`mousedown`, listener);
    };

    const onMouseUp = () => {
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    document.addEventListener(`mousemove`, onMouseMove);

    document.addEventListener(`mouseup`, onMouseUp);
  };

  window.move = {
    onTraceMainPin
  };

})();
