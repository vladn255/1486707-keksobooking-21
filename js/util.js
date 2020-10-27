'use strict';
(function () {
  const generateRandomInt = (min, max) => {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  const getRandomSingleData = (array) => {
    return array[window.util.generateRandomInt(0, array.length - 1)];
  };

  const getRandomArrayData = (array) => {
    let randomArray = [];
    let arrayEntriesNumber = window.util.generateRandomInt(0, array.length - 1);
    for (let i = 0; i <= arrayEntriesNumber; i++) {
      randomArray.push(window.util.getRandomSingleData(array));
    }
    return randomArray;
  };

  window.util = {
    generateRandomInt,
    getRandomSingleData,
    getRandomArrayData
  };
})();
