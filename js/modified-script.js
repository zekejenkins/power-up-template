/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

function fetchAndDisplayIndependentCards() {
  t.cards('all')
    .then(function(cards) {
      // Filter and fetch to identify independent cards
      const independentCardPromises = cards.map(card => 
        t.get(card.id, 'shared', 'dependencyType')
          .then(dependencyType => dependencyType === 'independent' ? card : null)
      );

      return Promise.all(independentCardPromises);
    })
    .then(function(filteredCards) {
      const independentCards = filteredCards.filter(card => card !== null);
      
      // Assuming 'independentCardsSection' should only be displayed for dependent cards
      if(document.getElementById('dependency').value === 'dependent' && independentCards.length > 0) {
        const select = document.getElementById('independentCards');
        select.innerHTML = ''; // Clear existing options
        independentCards.forEach(card => {
          const option = document.createElement('option');
          option.value = card.id;
          option.textContent = card.name;
          select.appendChild(option);
        });

        // Display the section
        document.getElementById('independentCardsSection').style.display = '';
      } else {
        document.getElementById('independentCardsSection').style.display = 'none';
      }
    });
}

// Event listener for changes in the primary selection
document.getElementById('dependency').addEventListener('change', function() {
  if(this.value === 'dependent') {
    fetchAndDisplayIndependentCards(); // Only fetch if "Dependent" is selected
  } else {
    document.getElementById('independentCardsSection').style.display = 'none';
  }
});

// Initialization and save logic as previously outlined
