'use strict';

const URL_GET = `https://21.javascript.pages.academy/keksobooking/data`;
const URL_POST = `https://21.javascript.pages.academy/keksobooking`;
const TIMEOUT_IN_MS = 10000;
const DEBOUNCE_INTERVAL = 500;

const StatusCode = {
  OK: 200
};

/* функция получения данных с сервера:
 параметр1: обработчик при загрузке данных,
 параметр2: обработчик при ошибке
*/
const load = (onLoad, onLoadError) => {
  let xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  const onCheckIfErrors = () => {
    if (xhr.status === StatusCode.OK) {
      onLoad(xhr.response);
    } else {
      onLoadError(`Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
    }
  };

  xhr.addEventListener(`load`, onCheckIfErrors);

  xhr.addEventListener(`error`, function () {
    onLoadError(`Произошла ошибка соединения`);
  });
  xhr.addEventListener(`timeout`, function () {
    onLoadError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
  });

  xhr.open(`GET`, URL_GET);
  xhr.timeout = TIMEOUT_IN_MS;
  xhr.send();
};

const save = (data, onSave, onSaveError) => {
  let xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  const onCheckIfErrors = () => {
    if (xhr.status === StatusCode.OK) {
      onSave(xhr.response);
    } else {
      onSaveError(`Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
    }
  };

  xhr.addEventListener(`load`, onCheckIfErrors);

  xhr.addEventListener(`error`, function () {
    onSaveError(`Произошла ошибка соединения`);
  });
  xhr.addEventListener(`timeout`, function () {
    onSaveError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
  });

  xhr.open(`POST`, URL_POST);
  xhr.timeout = TIMEOUT_IN_MS;
  xhr.send(data);
};

// функция установки таймаута для устранения дребезга
const debounce = (cb) => {
  let lastTimeout = null;

  return (...parameters) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(() => {
      cb(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
};

window.backend = {
  load,
  save,
  debounce
};
