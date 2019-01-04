'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImgBlock = bigPicture.querySelector('.big-picture__img');
  var bigPictureImg = bigPictureImgBlock.querySelector('img');
  var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
  var bigPictureDescription = bigPicture.querySelector('.social__caption');
  var bigPictureCommentCount = bigPicture.querySelector('.social__comment-count');
  var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');
  var bigPictureCommentsList = document.querySelector('.social__comments');
  var bigPictureCancel = document.getElementById('picture-cancel');

  // Создает рандомный комментарий
  var createComment = function (comment) {
    var listItem = window.util.makeElement('li', 'social__comment');

    var avatar = window.util.makeElement('img', 'social__picture');
    avatar.src = comment.avatar;
    avatar.alt = 'Аватар комментатора фотографии';
    listItem.appendChild(avatar);

    var textComments = window.util.makeElement('p', 'social__text', comment.message);
    listItem.appendChild(textComments);

    return listItem;
  };

  // Удаляет и добавляет комментарии в список
  var addCommentToList = function (object) {
    // Удаляет дочерние элементы
    while (bigPictureCommentsList.firstChild) {
      bigPictureCommentsList.removeChild(bigPictureCommentsList.firstChild);
    }

    for (var i = 0; i < object.comments.length; i++) {
      var commentsItem = createComment(object.comments[i]);
      bigPictureCommentsList.appendChild(commentsItem);
    }
  };

  var drawBigPicture = function (object) {
    bigPictureImg.src = object.url;
    bigPictureLikesCount.textContent = object.likes;
    addCommentToList(object);
    bigPictureDescription.textContent = object.description;
    bigPictureCommentCount.classList.add('visually-hidden');
    bigPictureCommentsLoader.classList.add('visually-hidden');
  };

  // Закрывает по нажатию на esc
  var onBigPictuteEscPress = function (evt) {
    window.util.isEscEvent(evt, closeBigPicture);
  };

  // Открывает в полноэкранном режиме картинку
  var openBigPicture = function () {
    window.util.showElement(bigPicture);
    document.addEventListener('keydown', onBigPictuteEscPress);
  };

  // Закрывает картинку в полноэкранном режиме
  var closeBigPicture = function () {
    window.util.hideElement(bigPicture);
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
  var showBigPicture = function (thumbnails, pictures) {
    for (var j = 0; j < thumbnails.length; j++) {
      addThumbnailClickHandler(thumbnails[j], pictures[j]);
    }
  };

  window.showBigPicture = showBigPicture;
})();
