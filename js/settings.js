/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var dependencySelector = document.getElementById('Dependency');
var vegetableSelector = document.getElementById('vegetable');

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'Dependency'),
    t.get('board', 'private', 'vegetable')
  ])
  .spread(function(savedDependency){
    if(savedFruit && /[a-z]+/.test(savedDependency)){
      dependencySelector.value = savedDependcy;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  return t.set('board', 'private', 'Dependency', dependencySelector.value)
  .then(function(){
    return t.set('board', 'shared', 'vegetable', vegetableSelector.value);
  })
  .then(function(){
    t.closePopup();
  })
})
