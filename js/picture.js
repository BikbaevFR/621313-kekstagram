'use strict';

(function () {
  var сontainerPictures = document.querySelector('.pictures');
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

  var renderPictures = function (arrayPictures, length) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < length; i++) {
      fragment.appendChild(renderPicture(arrayPictures[i]));
    }
    сontainerPictures.appendChild(fragment);
    var thumbnails = document.querySelectorAll('.picture__img');
    window.showBigPicture(thumbnails, arrayPictures);
  };

  // Успешное выполнение запроса
  var succsessDownloadHandler = function (picturesData) {
    renderPictures(picturesData, picturesData.length);
  };

  // Неуспешное выполнение запроса
  var errorDownloadHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '20px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.downLoad(succsessDownloadHandler, errorDownloadHandler);
})();
