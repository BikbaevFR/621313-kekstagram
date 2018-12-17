'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

// Общее количество картинок на главной стр.
var QUANTITY_PICTURES = 25;

// Выдает рандомное число
var getRandomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);

  return rand;
};

// Выдает массив с рандомным, неповторяющимся порядком чисел
var getMixArrays = function (array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// Выдает массив с номерами
var getArrayNumber = function () {
  var array = [];

  for (var i = 1; i <= QUANTITY_PICTURES; i++) {
    array.push(i);
    getMixArrays(array);
  }

  return array;
};

// Выдает массив с адресами картинок
var getArrayUrlPicture = function () {
  var array = [];
  var arrayUrlPicture = [];

  for (var i = 1; i <= QUANTITY_PICTURES; i++) {
    array.push(i);
    getMixArrays(array);
  }

  for (var j = 0; j < array.length; j++) {
    arrayUrlPicture.push('photos/' + array[j] + '.jpg');
  }

  return arrayUrlPicture;
};

// Выдает массив с комментариями
var getArrayComments = function (array) {
  var arrayComments = [];
  var numberComments = getRandomInteger(1, 2);

  for (var i = 1; i <= numberComments; i++) {
    var randomCommentIndex = getRandomInteger(0, array.length - 1);
    var indexCommentsArray = COMMENTS[randomCommentIndex];

    arrayComments.push(indexCommentsArray);
  }

  return arrayComments;
};

// Выдает массив с рандомными объектами. В каждой 4 ключа(1. Url 2. Likes 3. Comments 4. Description)
var getRandomArrayPicture = function (array1, array2) {
  var randomArrayPicture = [];

  // Получаем массив с рандомными адресами картинок
  var numberUrlPicture = getArrayNumber();
  numberUrlPicture = getArrayUrlPicture();

  for (var i = 0; i < QUANTITY_PICTURES; i++) {
    // Рандомное количество лайков
    var randomNumberLikes = getRandomInteger(15, 200);

    // Создает массив комментарией длиной 1 или 2
    var commentsArray = getArrayComments(array1);

    // Рандомный номер массива описаний
    var randomDescriptionIndex = getRandomInteger(0, array2.length - 1);

    var newPicture = {
      url: numberUrlPicture[i],
      likes: randomNumberLikes,
      comments: commentsArray,
      description: DESCRIPTIONS[randomDescriptionIndex]
    };

    randomArrayPicture.push(newPicture);
  }

  return randomArrayPicture;
};

var pictures = getRandomArrayPicture(COMMENTS, DESCRIPTIONS);

// Находим контейнер, в который будем вставлять картинки
var сontainerPictures = document.querySelector('.pictures');

// Находим шаблон, который будем копировать
var similarPictureTemplate = document.querySelector('#picture').content;

// Отдает рандомную картинку созданную на основе шаблона
var renderPicture = function (picture) {
  // Копируем шаблон
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}
сontainerPictures.appendChild(fragment);

// ПЕРЕХОДИМ В ПОЛНОЭКРАННЫЙ РЕЖИМ

// Показываем блок фотографии в полноэкранном режиме
var bigPicture = document.querySelector('.big-picture');
var bigPictureImgBlock = bigPicture.querySelector('.big-picture__img');
var bigPictureImg = bigPictureImgBlock.querySelector('img');
var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
var bigPictureDescription = bigPicture.querySelector('.social__caption');
var bigPictureCommentCount = bigPicture.querySelector('.social__comment-count');
var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');
var bigPictureCommentsList = document.querySelector('.social__comments');

// Создает элемент
var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

// Создает рандомный комментарий
var createComment = function (comment) {
  var listItem = makeElement('li', 'social__comment');

  var avatar = makeElement('img', 'social__picture');
  avatar.src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
  avatar.alt = 'Аватар комментатора фотографии';
  listItem.appendChild(avatar);

  var textComments = makeElement('p', 'social__text', comment);
  listItem.appendChild(textComments);

  return listItem;
};

// Удаляет и добавляет комментарии в список
var addCommentToList = function (object) {
  // Удаляет дочерние элементы
  while (bigPictureCommentsList.firstChild) {
    bigPictureCommentsList.removeChild(bigPictureCommentsList.firstChild);
  }

  for (var index = 0; index < object.comments.length; index++) {
    var commentsItem = createComment(object.comments[index]);
    bigPictureCommentsList.appendChild(commentsItem);
  }
};

var drawBigPicture = function (object) {
  // Меняем адрес картинки
  bigPictureImg.src = object.url;

  // Меняем количество лайков картинки
  bigPictureLikesCount.textContent = object.likes;

  addCommentToList(object);

  // Меняем описание картинки
  bigPictureDescription.textContent = object.description;

  // Прячем блок счётчика комментариев
  bigPictureCommentCount.classList.add('visually-hidden');

  // Прячем блок загрузки новых комментариев
  bigPictureCommentsLoader.classList.add('visually-hidden');
};

// ==========================4-ОЕ ЗАДАНИЕ "ПОДРОБНОСТИ"===================================

var ESC_KEYCODE = 27;
// var SPACE_KEYCODE = 32;

var imgUploady = document.querySelector('.img-upload');
var uploadFile = document.getElementById('upload-file');
var uploadCancel = document.getElementById('upload-cancel');
var imgUploadOverlay = imgUploady.querySelector('.img-upload__overlay');

// Закрывает по нажатию на esc
var onUploadOverlayEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeImgUploadOverlay();
  }
};

// Открывает блок загрузки и редактирования картинок
var openImgUploadOverlay = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onUploadOverlayEscPress);
};

// Закрывает блок загрузки и редактирования картинок
var closeImgUploadOverlay = function () {
  imgUploadOverlay.classList.add('hidden');
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

// ==================================================================

// Эффекты превьюшки

var effectsList = document.querySelector('.effects__list');
var previewPhoto = document.querySelector('.img-upload__preview');

// переменная для хранения текущего эффекта
var currentEffect = '';

effectsList.addEventListener('change', function (evt) {
  var button = evt.target;
  var effectName = button.value;

  previewPhoto.classList.remove('effects__preview--' + currentEffect);
  previewPhoto.classList.add('effects__preview--' + effectName);

  currentEffect = effectName;
});

// ==================================================================

// Открытие картинок в полноэкранном режиме

var thumbnails = document.querySelectorAll('.picture__img');
var bigPictureCancel = document.getElementById('picture-cancel');

// Закрывает по нажатию на esc
var onBigPictuteEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPicture();
  }
};

// Открывает в полноэкранном режиме картинку
var openBigPicture = function () {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictuteEscPress);
};

// Закрывает картинку в полноэкранном режиме
var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictuteEscPress);
};

bigPictureCancel.addEventListener('click', function () {
  closeBigPicture();
});

// Подставляет адрес маленькой картинки в большую
var addThumbnailClickHandler = function (thumbnail, picture) {
  thumbnail.addEventListener('click', function () {
    openBigPicture();
    drawBigPicture(picture);
  });
};

// Перебирает два массива и передает addThumbnailClickHandler
for (var indexArr = 0; indexArr < thumbnails.length; indexArr++) {
  addThumbnailClickHandler(thumbnails[indexArr], pictures[indexArr]);
}

// ==================================================================

// Хэш-теги

var MAX_HASHTAGS = 5;
var MAX_LENGTH_HASHTAG = 20;

var inputHashTags = document.querySelector('input[name="hashtags"]');

// Проверяет наличие одинаковых элементов в массиве
var hasRepeatedTags = function (arr) {
  var repeatedTags = false;
  if (arr.length > 1) {
    for (var n = 0; n < arr.length; n++) {
      for (var j = n + 1; j < arr.length; j++) {
        if (arr[j] === arr[n]) {
          repeatedTags = true;
        }
      }
    }
  }
  return repeatedTags;
};

// Проверка на валидность хэштегов
var checkHashtagsForValidations = function (arrayHashTags) {
  for (var elem = 0; elem < arrayHashTags.length; elem++) {
    var elementArray = arrayHashTags[elem];
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

    for (var index = 1; index < elementArray.length; index++) {
      if (elementArray[index] === '#') {
        inputHashTags.setCustomValidity('Хэштеги нужно разделяться пробелом');
        return;
      }
    }
  }
  if (hasRepeatedTags(arrayHashTags)) {
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

// ==================================================================

// Пин

var effectLevelLine = imgUploady.querySelector('.effect-level__line');
var effectLevelDepth = imgUploady.querySelector('.effect-level__depth');
var effectLevelPin = imgUploady.querySelector('.effect-level__pin');

effectLevelPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var sliderPinWidth = effectLevelPin.offsetWidth;
  var sliderLineWidth = effectLevelLine.offsetWidth;
  var initialPinPosition = effectLevelPin.offsetLeft - sliderPinWidth / 2;
  var startCoordsMouseX = evt.clientX;

  var sliderPinMouseMoveHandler = function (evtMouseMove) {
    evtMouseMove.preventDefault();

    var shift = startCoordsMouseX - evtMouseMove.clientX;
    startCoordsMouseX = evtMouseMove.clientX;

    var newPinPosition = initialPinPosition - shift;
    initialPinPosition = newPinPosition;

    var newPinPositionInPercent = Math.round(newPinPosition * 100 / sliderLineWidth);

    if (newPinPositionInPercent <= 100 && newPinPositionInPercent >= 0) {
      effectLevelPin.style.left = newPinPositionInPercent + '%';
      effectLevelDepth.style.width = newPinPositionInPercent + '%';
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
