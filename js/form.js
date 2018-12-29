'use strict';

(function () {
  var MAX_HASHTAGS = 5;
  var MAX_LENGTH_HASHTAG = 20;
  var DEFAULT_EFFECT_LEVEL = '100%';
  var MULTIPLICAND = 100;

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

  var currentEffect;
  var effectClassName;

  // Закрывает по нажатию на esc
  var onUploadOverlayEscPress = function (evt) {
    if (evt.keyCode === window.util.Keycode.ESC) {
      closeImgUploadOverlay();
    }
  };

  // Открывает блок загрузки и редактирования картинок
  var openImgUploadOverlay = function () {
    window.util.showElement(imgUploadOverlay);
    window.util.hideElement(sliderEffectLevel);
    document.addEventListener('keydown', onUploadOverlayEscPress);
  };

  // Закрывает блок загрузки и редактирования картинок
  var closeImgUploadOverlay = function () {
    window.util.hideElement(imgUploadOverlay);
    imgPreview.classList.remove(effectClassName);
    document.removeEventListener('keydown', onUploadOverlayEscPress);

    // TODO: Доделать очистку поля при закрытии
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
    for (var i = 0; i < arrayHashTags.length; i++) {
      var elementArray = arrayHashTags[i];
      var lengthHashtag = elementArray.length;
      var firstSign = elementArray[0];

      if (firstSign !== '#') {
        inputHashTags.setCustomValidity('Хэштег начинается со знака "#"(решётка)');
        return;
      }
      if (lengthHashtag === 1) {
        inputHashTags.setCustomValidity('Хэштег не может состоять только из одной "#"(решётки)');
        return;
      }
      if (lengthHashtag > MAX_LENGTH_HASHTAG) {
        inputHashTags.setCustomValidity('Введено больше 25 символов для одного хэштэга');
        return;
      }

      for (var j = 1; j < elementArray.length; j++) {
        if (elementArray[j] === '#') {
          inputHashTags.setCustomValidity('Хэштеги нужно разделяться пробелом');
          return;
        }
      }
    }
    if (window.util.checksArrayForIdenticalElements(arrayHashTags)) {
      inputHashTags.setCustomValidity('Нельзя использовать два одинаковых хэштега');
      return;
    }
    if (arrayHashTags.length > MAX_HASHTAGS) {
      inputHashTags.setCustomValidity('Введено больше пяти хэштегов');
      return;
    }

    inputHashTags.setCustomValidity('');
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
    var effectLevel = ((currentEffect.max - currentEffect.min) * sliderEffectLevelValue.value / MULTIPLICAND) + currentEffect.min;
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

      var newPinPositionInPercent = Math.round(newPinPosition * MULTIPLICAND / sliderLineWidth);

      if (newPinPositionInPercent <= MULTIPLICAND && newPinPositionInPercent >= 0) {
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
    var effectType = evt.target.value;
    var effectTypeToUpperCase = effectType.toUpperCase();
    currentEffect = Effects[effectTypeToUpperCase];
    changeEffectType(effectType);
  };

  effectsList.addEventListener('click', effectsListClickHandler);
})();
