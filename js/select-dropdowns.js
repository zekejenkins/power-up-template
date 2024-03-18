/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

document.getElementById('save').addEventListener('click', function(){
  var fruit = document.getElementById('fruit').value;
  var vegetable = document.getElementById('vegetable').value;

  return t.set('board', 'shared', 'selectedFruit', fruit)
    .then(function(){
      return t.set('board', 'shared', 'selectedVegetable', vegetable);
    })
    .then(function(){
      t.closePopup();
    });
});
