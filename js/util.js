'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  // Показывает элемент
  var showElement = function (element) {
    element.classList.remove('hidden');
  };

  // Скрывает элемент
  var hideElement = function (element) {
    element.classList.add('hidden');
  };

  // Выдает рандомное число
  var getRandomInteger = function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);

    return rand;
  };

  // Создает элемент
  var makeElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    element.classList.add(className);
    if (text) {
      element.textContent = text;
    }
    return element;
  };

  // Проверяет наличие одинаковых элементов в массиве
  var checksArrayForIdenticalElements = function (arr) {
    var identicalElements = false;
    if (arr.length > 1) {
      for (var n = 0; n < arr.length; n++) {
        for (var j = n + 1; j < arr.length; j++) {
          if (arr[j] === arr[n]) {
            identicalElements = true;
          }
        }
      }
    }
    return identicalElements;
  };

  window.util = {
    showElement: showElement,
    hideElement: hideElement,
    getRandomInteger: getRandomInteger,
    makeElement: makeElement,
    checksArrayForIdenticalElements: checksArrayForIdenticalElements,
    isEscEvent: isEscEvent
  };
})();
