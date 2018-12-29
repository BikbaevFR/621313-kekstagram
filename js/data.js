'use strict';

(function () {
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

  var QUANTITY_PICTURES = 25;

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
    var numberComments = window.util.getRandomInteger(1, 2);

    for (var i = 1; i <= numberComments; i++) {
      var randomCommentIndex = window.util.getRandomInteger(0, array.length - 1);
      var indexCommentsArray = COMMENTS[randomCommentIndex];

      arrayComments.push(indexCommentsArray);
    }

    return arrayComments;
  };

  // Выдает массив с рандомными объектами. В каждой 4 ключа(1. Url 2. Likes 3. Comments 4. Description)
  var getRandomArrayPicture = function () {
    var randomArrayPicture = [];

    // Получаем массив с рандомными адресами картинок
    var numberUrlPicture = getArrayNumber();
    numberUrlPicture = getArrayUrlPicture();

    for (var i = 0; i < QUANTITY_PICTURES; i++) {
      // Рандомное количество лайков
      var randomNumberLikes = window.util.getRandomInteger(15, 200);

      // Создает массив комментарией длиной 1 или 2
      var commentsArray = getArrayComments(COMMENTS);

      // Рандомный номер массива описаний
      var randomDescriptionIndex = window.util.getRandomInteger(0, DESCRIPTIONS.length - 1);

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

  window.data = {
    getRandomArrayPicture: getRandomArrayPicture
  };
})();
