'use strict';

(function () {
  var COMMENTS_MAX = 5;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImgBlock = bigPicture.querySelector('.big-picture__img');
  var bigPictureImg = bigPictureImgBlock.querySelector('img');
  var bigPictureLikesCount = bigPicture.querySelector('.likes-count');
  var bigPictureDescription = bigPicture.querySelector('.social__caption');
  var bigPictureCommentCount = bigPicture.querySelector('.social__comment-count');
  var bigPictureCommentsLoader = bigPicture.querySelector('.social__comments-loader');
  var bigPictureCommentsList = document.querySelector('.social__comments');
  var bigPictureCancel = document.getElementById('picture-cancel');
  var picture = {};
  var arrayComments = [];
  var countIndexComments = 0;

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

    for (var i = 0; i < object.length; i++) {
      var commentsItem = createComment(object[i]);
      bigPictureCommentsList.appendChild(commentsItem);
    }
  };


  var showBigPicture = function (object) {
    picture = object;
    bigPictureImg.src = object.url;
    bigPictureLikesCount.textContent = object.likes;
    bigPictureDescription.textContent = object.description;
    loadNewComments();
    // Сравнивает общее количество комментариев и показанных
    if (picture.comments.length <= (countIndexComments)) {
      bigPictureCommentsLoader.classList.add('visually-hidden');
    }
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
    resetComments();
    window.util.hideElement(bigPicture);
    document.removeEventListener('keydown', onBigPictuteEscPress);
  };

  bigPictureCancel.addEventListener('click', function () {
    closeBigPicture();
  });

  // Очищает счетчик комментариев
  var resetComments = function () {
    arrayComments = [];
    countIndexComments = 0;
    bigPictureCommentsLoader.classList.remove('visually-hidden');
  };

  // Загружает новые комментарии
  var loadNewComments = function () {
    var partComments = picture.comments.slice(countIndexComments, countIndexComments + COMMENTS_MAX);
    for (var i = 0; i < partComments.length; i++) {
      arrayComments.push(partComments[i]);
    }
    addCommentToList(arrayComments);
    countIndexComments += COMMENTS_MAX;

    var allComments = picture.comments.length;
    var openComments = bigPictureCommentsList.childNodes.length;
    bigPictureCommentCount.innerHTML = openComments + ' из <span class="comments-count">' + allComments + '</span> комментариев</div>';
  };

  var commentsLoaderClickHandler = function () {
    loadNewComments();
    // Сравнивает общее количество комментариев и показанных
    if (picture.comments.length <= (countIndexComments)) {
      bigPictureCommentsLoader.classList.add('visually-hidden');
    }
  };

  // Подставляет адрес маленькой картинки в большую
  var addThumbnailClickHandler = function (thumbnail, pic) {
    thumbnail.addEventListener('click', function () {
      openBigPicture();
      showBigPicture(pic);
    });
  };

  // Перебирает два массива и передает в addThumbnailClickHandler
  var pickUpBigPicture = function (thumbnails, pictures) {
    for (var j = 0; j < thumbnails.length; j++) {
      addThumbnailClickHandler(thumbnails[j], pictures[j]);
    }
  };

  bigPictureCommentsLoader.addEventListener('click', commentsLoaderClickHandler);
  window.pickUpBigPicture = pickUpBigPicture;
})();
