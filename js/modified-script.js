/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// Function to fetch and display independent cards
function updateIndependentCardsDisplay() {
  // Only fetch and show if 'dependent' is selected
  if (document.getElementById('dependency').value === 'dependent') {
    t.cards('all')
      .then(function(cards) {
        // Filter for independent cards based on a stored attribute or any logic you define
        var independentCards = cards.filter(function(card) {
          // Example logic, replace with your actual logic to determine if a card is independent
          return card.name.startsWith("Independent");
        });

        var select = document.getElementById('independentCards');
        select.innerHTML = ''; // Clear current options
        independentCards.forEach(function(card) {
          var option = document.createElement('option');
          option.value = card.id;
          option.textContent = card.name;
          select.appendChild(option);
        });

        document.getElementById('independentCardsSection').style.display = '';
      });
  } else {
    document.getElementById('independentCardsSection').style.display = 'none';
  }
}

// Event listener for dependency select change
document.getElementById('dependency').addEventListener('change', updateIndependentCardsDisplay);

// Render function to initialize UI based on saved values
t.render(function() {
  return t.get('card', 'shared', 'dependency')
    .then(function(savedDependency) {
      if(savedDependency) {
        document.getElementById('dependency').value = savedDependency;
        updateIndependentCardsDisplay(); // Update display based on saved value
      }
    })
    .then(function() {
      if (document.getElementById('dependency').value === 'dependent') {
        // Assuming you have a way to save which independent card was selected
        return t.get('card', 'shared', 'selectedIndependentCard');
      }
    })
    .then(function(selectedIndependentCard) {
      if(selectedIndependentCard) {
        document.getElementById('independentCards').value = selectedIndependentCard;
      }
    })
    .then(function(){
      t.sizeTo('#content').done();
    });
});

// Save button functionality
document.getElementById('save').addEventListener('click', function(){
  var dependency = document.getElementById('dependency').value;
  var selectedIndependentCard = document.getElementById('independentCards').value;

  return t.set('card', 'shared', 'dependency', dependency)
    .then(function(){
      if(dependency === 'dependent') {
        return t.set('card', 'shared', 'selectedIndependentCard', selectedIndependentCard);
      }
    })
    .then(function(){
      t.closePopup();
    });
});

