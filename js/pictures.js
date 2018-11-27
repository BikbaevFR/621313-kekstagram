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
var objectBigPicture = pictures[0];

// Показываем блок фотографии в полноэкранном режиме
var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

// Меняем адрес картинки
var bigPictureImgBlock = bigPicture.querySelector('.big-picture__img');
var bigPictureImg = bigPictureImgBlock.querySelector('img');
bigPictureImg.src = objectBigPicture.url;

// Меняем количество лайков картинки
var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
bigPictureLikesCount.textContent = objectBigPicture.likes;

// Меняем описание картинки
var bigPictureDescription = bigPicture.querySelector('.social__caption');
bigPictureDescription.textContent = objectBigPicture.description;

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
var addCommentToList = function () {
  var bigPictureCommentsList = bigPicture.querySelector('.social__comments');

  // Удаляет дочерние элементы
  while (bigPictureCommentsList.firstChild) {
    bigPictureCommentsList.removeChild(bigPictureCommentsList.firstChild);
  }

  for (var index = 0; index < objectBigPicture.comments.length; index++) {
    var commentsItem = createComment(objectBigPicture.comments[index]);
    bigPictureCommentsList.appendChild(commentsItem);
  }
};

addCommentToList();

// Прячем блок счётчика комментариев
var bigPictureCommentCount = bigPicture.querySelector('.social__comment-count');
bigPictureCommentCount.classList.add('visually-hidden');

// Прячем блок загрузки новых комментариев
var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');
bigPictureCommentsLoader.classList.add('visually-hidden');
