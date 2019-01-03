'use strict';

(function () {
  var MAX_HASHTAGS = 5;
  var MAX_LENGTH_HASHTAG = 20;
  var DEFAULT_EFFECT_LEVEL = '100%';
  var PERCENT_MULTIPLICAND = 100;

  var Effects = {
    CHROME: {
      filterType: 'grayscale',
      min: 0,
      max: 1,
      unit: ''
    },
    SEPIA: {
      filterType: 'sepia',
      min: 0,
      max: 1,
      unit: ''
    },
    MARVIN: {
      filterType: 'invert',
      min: 0,
      max: 100,
      unit: '%'
    },
    PHOBOS: {
      filterType: 'blur',
      min: 0,
      max: 3,
      unit: 'px'
    },
    HEAT: {
      filterType: 'brightness',
      min: 1,
      max: 3,
      unit: ''
    }
  };

  var imgUploady = document.querySelector('.img-upload');
  var uploadFile = document.getElementById('upload-file');
  var uploadCancel = document.getElementById('upload-cancel');
  var imgUploadOverlay = imgUploady.querySelector('.img-upload__overlay');
  var effectsList = imgUploadOverlay.querySelector('.effects__list');
  var previewPhoto = imgUploadOverlay.querySelector('.img-upload__preview');
  var imgPreview = previewPhoto.querySelector('img');
  var inputHashTags = document.querySelector('input[name="hashtags"]');
  var sliderEffectLevel = imgUploadOverlay.querySelector('.effect-level');
  var sliderEffectLevelValue = sliderEffectLevel.querySelector('.effect-level__value');
  var sliderLine = sliderEffectLevel.querySelector('.effect-level__line');
  var sliderDepth = sliderEffectLevel.querySelector('.effect-level__depth');
  var sliderPin = sliderEffectLevel.querySelector('.effect-level__pin');
  var form = document.querySelector('.img-upload__form');
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success');
  var success = successTemplate.content.querySelector('.success');
  var errorTemplate = document.querySelector('#error');
  var error = errorTemplate.content.querySelector('.error');
  var currentEffect;
  var effectClassName;

  // Закрывает по нажатию на esc
  var onUploadOverlayEscPress = function (evt) {
    window.util.isEscEvent(evt, closeImgUploadOverlay);
  };

  // Открывает блок загрузки и редактирования картинок
  var openImgUploadOverlay = function () {
    window.util.showElement(imgUploadOverlay);
    window.util.hideElement(sliderEffectLevel);
    document.addEventListener('keydown', onUploadOverlayEscPress);
  };

  // Закрывает блок загрузки и редактирования картинок
  var closeImgUploadOverlay = function () {
    uploadFile.value = '';
    window.util.hideElement(imgUploadOverlay);
    imgPreview.style.filter = '';
    imgPreview.classList.remove(effectClassName);
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    form.reset();
  };

  // Обработчики событий
  uploadFile.addEventListener('change', function () {
    openImgUploadOverlay();
  });

  uploadCancel.addEventListener('click', function () {
    closeImgUploadOverlay();
  });

  // Проверка на валидность хэштегов
  var checkHashtagsForValidations = function (arrayHashTags) {
    var message = '';

    for (var i = 0; i < arrayHashTags.length; i++) {
      var elementArray = arrayHashTags[i];
      var lengthHashtag = elementArray.length;
      var firstSign = elementArray[0];

      if (firstSign !== '#') {
        message = 'Хэштег начинается со знака "#"(решётка)';
      }
      if (lengthHashtag === 1) {
        message = 'Хэштег не может состоять только из одной "#"(решётки)';
      }
      if (lengthHashtag > MAX_LENGTH_HASHTAG) {
        message = 'Введено больше 25 символов для одного хэштэга';
      }

      for (var j = 1; j < elementArray.length; j++) {
        if (elementArray[j] === '#') {
          message = 'Хэштеги нужно разделяться пробелом';
        }
      }
    }
    if (window.util.checksArrayForIdenticalElements(arrayHashTags)) {
      message = 'Нельзя использовать два одинаковых хэштега';
    }
    if (arrayHashTags.length > MAX_HASHTAGS) {
      message = 'Введено больше пяти хэштегов';
    }

    inputHashTags.setCustomValidity(message);
    if (message) {
      inputHashTags.classList.add('text__hashtags--invalid');
    } else {
      inputHashTags.classList.remove('text__hashtags--invalid');
    }
  };

  inputHashTags.addEventListener('input', function (evt) {
    var arrayHashTags = evt.target.value.trim().toLowerCase().split(' ');
    checkHashtagsForValidations(arrayHashTags);
  });

  inputHashTags.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  });

  inputHashTags.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadOverlayEscPress);
  });

  // Изменяет уровень эффекта
  var changeEffectLevel = function (type, level, unit) {
    imgPreview.style.filter = type + '(' + level + unit + ')';
  };

  // Переводит значение позиции пина в уровень эффекта
  var transformPinPositionToEffectLevel = function () {
    sliderEffectLevelValue.value = parseInt(sliderPin.style.left, 10);
    var effectLevel = ((currentEffect.max - currentEffect.min) * sliderEffectLevelValue.value / PERCENT_MULTIPLICAND) + currentEffect.min;
    return effectLevel;
  };

  sliderPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var sliderPinWidth = sliderPin.offsetWidth;
    var sliderLineWidth = sliderLine.offsetWidth;
    var initialPinPosition = sliderPin.offsetLeft - sliderPinWidth / 2;
    var startCoordsMouseX = evt.clientX;

    var sliderPinMouseMoveHandler = function (evtMouseMove) {
      evtMouseMove.preventDefault();

      var shift = startCoordsMouseX - evtMouseMove.clientX;
      startCoordsMouseX = evtMouseMove.clientX;

      var newPinPosition = initialPinPosition - shift;
      initialPinPosition = newPinPosition;

      var newPinPositionInPercent = Math.round(newPinPosition * PERCENT_MULTIPLICAND / sliderLineWidth);

      if (newPinPositionInPercent <= PERCENT_MULTIPLICAND && newPinPositionInPercent >= 0) {
        sliderPin.style.left = newPinPositionInPercent + '%';
        sliderDepth.style.width = newPinPositionInPercent + '%';
        changeEffectLevel(currentEffect.filterType, transformPinPositionToEffectLevel(), currentEffect.unit);
      }
    };

    var sliderPinMouseUpHandler = function (evtMouseUp) {
      evtMouseUp.preventDefault();

      document.removeEventListener('mousemove', sliderPinMouseMoveHandler);
      document.removeEventListener('mouseup', sliderPinMouseUpHandler);
    };

    document.addEventListener('mousemove', sliderPinMouseMoveHandler);
    document.addEventListener('mouseup', sliderPinMouseUpHandler);
  });

  // Сбрасывает на дефолтные значение положение пина и уровень эффекта
  var resetSliderValuesToDefault = function () {
    sliderPin.style.left = DEFAULT_EFFECT_LEVEL;
    sliderDepth.style.width = DEFAULT_EFFECT_LEVEL;
    imgPreview.className = '';
    imgPreview.style.filter = '';
  };

  // Удаляет слайдер у оригинала и добавляет класс выбранного фильтра
  var changeEffectType = function (effect) {
    resetSliderValuesToDefault();
    if (effect !== 'none') {
      window.util.showElement(sliderEffectLevel);
    } else {
      window.util.hideElement(sliderEffectLevel);
    }
    effectClassName = 'effects__preview--' + effect;
    imgPreview.classList.add(effectClassName);
  };

  var effectsListClickHandler = function (evt) {
    if (evt.target.tagName === 'INPUT') {
      var effectType = evt.target.value;
      var effectTypeToUpperCase = effectType.toUpperCase();
      currentEffect = Effects[effectTypeToUpperCase];
      changeEffectType(effectType);
    }
  };

  // Отправка данных на сервер
  var closeSuccess = function () {
    main.removeChild(document.querySelector('.success'));
  };

  var closeError = function () {
    main.removeChild(document.querySelector('.error'));
    document.addEventListener('keydown', onUploadOverlayEscPress);
  };

  var successEscKeydownHandler = function (evt) {
    window.util.isEscEvent(evt, closeSuccess);
  };

  var errorEscKeydownHandler = function (evt) {
    window.util.isEscEvent(evt, closeError);
  };

  var uploadSubmitClickHandler = function (evt) {
    window.backend.upLoad(new FormData(form), succsessUploadHandler, errorUploadHandler);
    evt.preventDefault();
  };

  var succsessUploadHandler = function () {
    closeImgUploadOverlay();
    var successMessage = success.cloneNode(true);

    main.appendChild(successMessage);
    document.querySelector('.success__button').addEventListener('click', closeSuccess);
    document.addEventListener('keydown', successEscKeydownHandler);
    document.querySelector('.success').addEventListener('click', closeSuccess);
  };

  var errorUploadHandler = function () {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    var errorMessage = error.cloneNode(true);

    main.appendChild(errorMessage);
    document.querySelector('.error__button--again').addEventListener('click', closeError);
    document.querySelector('.error__button--other').addEventListener('click', closeImgUploadOverlay);
    document.addEventListener('keydown', errorEscKeydownHandler);
    document.querySelector('.error').addEventListener('click', closeError);
  };

  effectsList.addEventListener('click', effectsListClickHandler);
  form.addEventListener('submit', uploadSubmitClickHandler);
})();
