'use strict';

(function () {
  var сontainerPictures = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture').content;

  var filtersSection = document.querySelector('.img-filters');
  var filterPopular = document.querySelector('#filter-popular');
  var filterNew = document.querySelector('#filter-new');
  var filterDiscussed = document.querySelector('#filter-discussed');
  var filterActiveClassName = 'img-filters__button--active';
  var currentFilter = filterPopular;

  var picturesArray = [];
  var picturesArrayCopy = [];

  // Отдает рандомную картинку созданную на основе шаблона
  var renderPicture = function (picture) {
    // Копируем шаблон
    var pictureElement = similarPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  };

  var renderPictures = function (arrayPictures) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayPictures.length; i++) {
      fragment.appendChild(renderPicture(arrayPictures[i]));
    }
    сontainerPictures.appendChild(fragment);
    var thumbnails = document.querySelectorAll('.picture__img');
    window.pickUpBigPicture(thumbnails, arrayPictures);
  };

  // Успешное выполнение запроса
  var succsessDownloadHandler = function (picturesData) {
    renderPictures(picturesData);
    filtersSection.classList.remove('img-filters--inactive');
    filterPopular.classList.add(filterActiveClassName);
    picturesArray = picturesData;
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

  var showFilterActive = function (elem) {
    elem.classList.add(filterActiveClassName);
  };

  var hideFilterActive = function (elem) {
    elem.classList.remove(filterActiveClassName);
  };

  // Удаляем картинки
  var deletePictures = function () {
    var deletedPictures = сontainerPictures.querySelectorAll('.picture');
    for (var i = 0; i < deletedPictures.length; i++) {
      сontainerPictures.removeChild(deletedPictures[i]);
    }
  };

  // Получаем рандомный массив (10 элементов)
  var getRandomArray = function (array, n) {
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

    var shortenedArray = array.slice(0, n);
    return shortenedArray;
  };

  filterPopular.addEventListener('click', function () {
    if (currentFilter) {
      hideFilterActive(currentFilter);
    }
    showFilterActive(filterPopular);
    currentFilter = filterPopular;
    deletePictures();
    renderPictures(picturesArray);
  });

  filterNew.addEventListener('click', function () {
    if (currentFilter) {
      hideFilterActive(currentFilter);
    }
    showFilterActive(filterNew);
    currentFilter = filterNew;
    deletePictures();
    picturesArrayCopy = picturesArray.slice();
    renderPictures(getRandomArray(picturesArrayCopy, 10));
  });

  filterDiscussed.addEventListener('click', function () {
    if (currentFilter) {
      hideFilterActive(currentFilter);
    }
    showFilterActive(filterDiscussed);
    currentFilter = filterDiscussed;
    deletePictures();
    picturesArrayCopy = picturesArray.slice();
    picturesArrayCopy.sort(function (first, second) {
      if (first.comments < second.comments) {
        return 1;
      } else if (first.comments > second.comments) {
        return -1;
      } else {
        return 0;
      }
    });
    renderPictures(picturesArrayCopy);
  });
})();
