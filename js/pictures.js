'use strict';

var mixArrays = function (array) {
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

for (var i = 1; i <= 25; i++) {
  numberUrlPicture.push(i);
  mixArrays(numberUrlPicture);
}
