/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

function fetchAndDisplayIndependentCards() {
  t.cards('all')
    .then(function(cards) {
      const independentCardPromises = cards.map(card =>
        t.get(card.id, 'shared', 'dependencyType')
          .then(dependencyType => dependencyType === 'independent' ? card : null)
      );

      return Promise.all(independentCardPromises);
    })
    .then(function(filteredCards) {
      const independentCards = filteredCards.filter(card => card !== null);
      
      const select = document.getElementById('independentCards');
      select.innerHTML = ''; // Clear existing options

      if(document.getElementById('dependency').value === 'dependent' && independentCards.length > 0) {
        independentCards.forEach(card => {
          const option = document.createElement('option');
          option.value = card.id; // Use card ID as the value
          option.textContent = card.name; // Use card name as the text content
          select.appendChild(option);
        });

        document.getElementById('independentCardsSection').style.display = 'block'; // Ensure this is 'block' to show
      } else {
        document.getElementById('independentCardsSection').style.display = 'none';
      }
    });
}

document.getElementById('dependency').addEventListener('change', function() {
  if(this.value === 'dependent') {
    fetchAndDisplayIndependentCards();
  } else {
    document.getElementById('independentCardsSection').style.display = 'none';
  }
});

document.getElementById('save').addEventListener('click', function() {
  const dependency = document.getElementById('dependency').value;
  const independentCardId = dependency === 'dependent' ? document.getElementById('independentCards').value : null; // Get the ID of the selected independent card only if 'dependent' is selected

  t.set('card', 'shared', 'dependencyType', dependency) // Ensure the key matches what's being used to check card types
    .then(() => {
      if(dependency === 'dependent' && independentCardId) {
        return t.set('card', 'shared', 'independentCardId', independentCardId);
      }
    })
    .then(() => t.closePopup());
});
