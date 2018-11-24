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
    // Рандомное количество лайков
    var randomNumberLikes = getRandomInteger(15, 200);

    // Создает массив комментарией длиной 1 или 2
    var numberComments = getRandomInteger(1, 2);
    var commentsArray = [];

    if (numberComments === 2) {
      var randomCommentIndex1 = getRandomInteger(0, array1.length - 1);
      var randomCommentIndex2 = getRandomInteger(0, array1.length - 1);

      if (randomCommentIndex1 !== randomCommentIndex2) {
        var indexCommentsArray1 = COMMENTS[randomCommentIndex1];
        var indexCommentsArray2 = COMMENTS[randomCommentIndex2];

        commentsArray.push(indexCommentsArray1);
        commentsArray.push(indexCommentsArray2);
      } else {
        indexCommentsArray1 = COMMENTS[randomCommentIndex1];
        commentsArray.push(indexCommentsArray1);
      }
    } else {
      var randomCommentIndex = getRandomInteger(0, array1.length - 1);
      var indexCommentsArray = COMMENTS[randomCommentIndex];

      commentsArray.push(indexCommentsArray);
    }
    // Рандомный номер массива описаний
    var randomDescriptionIndex = getRandomInteger(0, array2.length - 1);

    var newPicture = {
      url: numberUrlPicture[index].toString(),
      likes: randomNumberLikes,
      comments: commentsArray,
      description: DESCRIPTIONS[randomDescriptionIndex]
    };

    randomObjectPicture.push(newPicture);
  }

  return randomObjectPicture;
};

var pictures = getRandomObjectPicture(COMMENTS, DESCRIPTIONS);

// Находим контейнер, в который будем вставлять картинки
var сontainerPictures = document.querySelector('.pictures');

// Находим шаблон, который будем копировать
var similarPictureTemplate = document.querySelector('#picture').content;

var renderPicture = function (picture) {
  // Копируем шаблон
  var pictureElement = similarPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = 'photos/' + picture.url + '.jpg';
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
  var objectBigPicture = pictures[0];
}
сontainerPictures.appendChild(fragment);
















// Показываем блок фотографии в полноэкранном режиме
var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

var bigPictureImgBlock = bigPicture.querySelector('.big-picture__img');
var bigPictureImg = bigPictureImgBlock.querySelector('img');
bigPictureImg.src = 'photos/' + objectBigPicture.url + '.jpg';

var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
bigPictureLikesCount.textContent = objectBigPicture.likes;

var bigPictureDescription = bigPicture.querySelector('.social__caption');
bigPictureDescription.textContent = objectBigPicture.description;

var bigPictureCommentsList = bigPicture.querySelector('.social__comments');
// Удаляем дочерние элементы
while (bigPictureCommentsList.firstChild) {
  bigPictureCommentsList.removeChild(bigPictureCommentsList.firstChild);
}

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

for (var indexArrayComments = 0; indexArrayComments < objectBigPicture.comments.length; indexArrayComments++) {
  var commentsItem = createComment(objectBigPicture.comments[indexArrayComments]);
  bigPictureCommentsList.appendChild(commentsItem);
}

// Прячем блок счётчика комментариев
var bigPictureCommentCount = bigPicture.querySelector('.social__comment-count');
bigPictureCommentCount.classList.add('visually-hidden');

// Прячем блок загрузки новых комментариев
var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');
bigPictureCommentsLoader.classList.add('visually-hidden');
