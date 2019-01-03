'use strict';

(function () {
  var Url = {
    DOWNLOAD: 'https://js.dump.academy/kekstagram/data',
    UPLOAD: 'https://js.dump.academy/kekstagram/'
  };

  var StatusCode = {
    SUCCESS: 200,
    REQUEST_ERROR: 400,
    NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500
  };

  var createRequest = function (url, method, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    var timeout = 10000;
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case StatusCode.SUCCESS:
          onLoad(xhr.response);
          break;
        case StatusCode.REQUEST_ERROR:
          error = 'Неверный запрос';
          break;
        case StatusCode.NOT_FOUND_ERROR:
          error = 'Ничего не найдено';
          break;
        case StatusCode.SERVER_ERROR:
          error = 'Внутренняя ошибка сервера';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + '' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = timeout;

    xhr.open(method, url);
    xhr.send(data);
  };

  // Получаем данные с сервера
  var downLoad = function (onLoad, onError) {
    createRequest(Url.DOWNLOAD, 'GET', onLoad, onError);
  };

  // Отправляем данные на сервер
  var upLoad = function (data, onLoad, onError) {
    createRequest(Url.UPLOAD, 'POST', onLoad, onError, data);
  };

  window.backend = {
    downLoad: downLoad,
    upLoad: upLoad
  };
})();
