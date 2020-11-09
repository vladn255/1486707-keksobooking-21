'use strict';
(function () {
  const URL_GET = `https://21.javascript.pages.academy/keksobooking/data`;
  const URL_POST = `https://21.javascript.pages.academy/keksobooking`;
  const TIMEOUT_IN_MS = 10000;

  const StatusCode = {
    OK: 200
  };
  const DEBOUNCE_INTERVAL = 500;

  /* функция проверки наличия ошибок при загрузке:
    параметр1: XMLHttpRequest,
    параметр2: обработчик при загрузке данных,
    параметр3: обработчик при ошибке
  */
  const checkIfErrors = (request, onLoadSuccess, onError) => {
    request.addEventListener(`load`, function () {
      if (request.status === StatusCode.OK) {
        onLoadSuccess(request.response);
      } else {
        onError(`Статус ответа: ` + request.status + ` ` + request.statusText);
      }
    });

    request.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
    });
    request.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ` + request.timeout + `мс`);
    });
  };

  /* функция получения данных с сервера:
    параметр1: обработчик при загрузке данных,
    параметр2: обработчик при ошибке
   */
  const load = (onLoad, onLoadError) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    checkIfErrors(xhr, onLoad, onLoadError);

    xhr.open(`GET`, URL_GET);
    xhr.timeout = TIMEOUT_IN_MS;
    xhr.send();
  };

  const save = (data, onSave, onSaveError) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    checkIfErrors(xhr, onSave, onSaveError);

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
})();
