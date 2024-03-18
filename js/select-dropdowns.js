/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// Initialize the dropdowns with saved values for the specific card
t.render(function() {
  return Promise.all([
    t.get('card', 'shared', 'selectedFruit'),
    t.get('card', 'shared', 'selectedVegetable')
  ])
  .then(function([savedFruit, savedVegetable]) {
    if(savedFruit) {
      document.getElementById('fruit').value = savedFruit;
    }
    if(savedVegetable) {
      document.getElementById('vegetable').value = savedVegetable;
    }
  })
  .then(function(){
    t.sizeTo('#content').done();
  });
});

// Listen for the save button click to store the selections specific to this card
document.getElementById('save').addEventListener('click', function(){
  var fruitValue = document.getElementById('fruit').value;
  var vegetableValue = document.getElementById('vegetable').value;

  return Promise.all([
    t.set('card', 'shared', 'selectedFruit', fruitValue),
    t.set('card', 'shared', 'selectedVegetable', vegetableValue)
  ])
  .then(function(){
    t.closePopup();
  });
});
