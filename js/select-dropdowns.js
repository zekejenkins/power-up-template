/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// This part is responsible for initializing the dropdowns with saved values
t.render(function() {
  return t.get('board', 'shared', 'selectedFruit')
    .then(function(savedFruit) {
      if(savedFruit) {
        document.getElementById('fruit').value = savedFruit;
      }
    })
    .then(function() {
      return t.get('board', 'shared', 'selectedVegetable');
    })
    .then(function(savedVegetable) {
      if(savedVegetable) {
        document.getElementById('vegetable').value = savedVegetable;
      }
    })
    .then(function(){
      t.sizeTo('#content').done();
    });
});

// This part listens for the save button click to store the selections
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
