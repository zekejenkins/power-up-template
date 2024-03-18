/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// Function to fetch and display independent cards
function updateIndependentCardsDisplay() {
  if (document.getElementById('dependency').value === 'dependent') {
    console.log("Fetching independent cards...");

    t.cards('all')
      .then(function(cards) {
        // Map each card to a promise that resolves to either the card (if independent) or null
        const cardPromises = cards.map(card =>
          t.get(card.id, 'shared', 'dependencyType')
            .then(dependencyType => dependencyType === 'independent' ? card : null)
        );

        // Wait for all promises to resolve
        return Promise.all(cardPromises);
      })
      .then(function(cardsOrNulls) {
        // Filter out the nulls, leaving only independent cards
        var independentCards = cardsOrNulls.filter(card => card !== null);

        console.log("Independent cards: ", independentCards);

        var select = document.getElementById('independentCards');
        select.innerHTML = ''; // Clear current options

        independentCards.forEach(function(card) {
          var option = document.createElement('option');
          option.value = card.id;
          option.textContent = card.name;
          select.appendChild(option);
        });

        document.getElementById('independentCardsSection').style.display = independentCards.length > 0 ? '' : 'none';
      })
      .catch(function(err) {
        console.error("Error fetching cards: ", err);
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

