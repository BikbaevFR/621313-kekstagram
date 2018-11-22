'use strict';

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var quantityPictures = 25;

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

var numberUrlPicture = [];

for (var indexUrl = 1; indexUrl <= quantityPictures; indexUrl++) {
  numberUrlPicture.push(indexUrl);
  getMixArrays(numberUrlPicture);
}

// Выдает рандомное число
var getRandomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

// Выдает рандомный массив с параметрами картинок
var getRandomObjectPicture = function (array1, array2) {
  var randomObjectPicture = [];

  for (var index = 0; index < quantityPictures; index++) {
    var randomNumberLikes = getRandomInteger(15, 200);

    var randomCommentIndex = getRandomInteger(0, array1.length - 1);
    var randomDescriptionIndex = getRandomInteger(0, array2.length - 1);

    var newPicture = {
      url: numberUrlPicture[index].toString(),
      likes: randomNumberLikes,
      comments: comments[randomCommentIndex],
      description: descriptions[randomDescriptionIndex]
    };

    randomObjectPicture.push(newPicture);
  }

  return randomObjectPicture;
};

var pictures = getRandomObjectPicture(comments, descriptions);

// Находим контейнер, в который будем вставлять картинки
var сontainerPictures = document.querySelector('.pictures');

// Находим шаблон, который будем копировать
var similarPictureTemplate = document.querySelector('#picture').content;

var renderPicture = function (picture) {
  // Копируем шаблон
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = 'photos/' + picture.url + '.jpg';
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}
сontainerPictures.appendChild(fragment);
