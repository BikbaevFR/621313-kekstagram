'use strict';

(function () {
  var сontainerPictures = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture').content;

  var pictures = window.data.getRandomArrayPicture();

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

  window.picture = {
    pictures: pictures
  };
})();
