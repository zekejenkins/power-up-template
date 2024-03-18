/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// Function to fetch and display independent cards
function updateIndependentCardsDisplay() {
  if (document.getElementById('dependency').value === 'dependent') {
    console.log("Fetching independent cards...");

    t.cards('all')
      .then(function(cards) {
        console.log("Total cards fetched: ", cards.length);
        
        var independentCards = cards.filter(function(card) {
          // Make sure this logic accurately reflects how you're identifying independent cards
          return card.name.startsWith("Independent"); // Example logic
        });

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

