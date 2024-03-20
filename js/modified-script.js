/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

function fetchAndDisplayIndependentCards(selectedCardId) {
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

      independentCards.forEach(card => {
        const option = document.createElement('option');
        option.value = card.id; // Use card ID as the value
        option.textContent = card.name; // Use card name as the text content
        select.appendChild(option);
        if (card.id === selectedCardId) {
          option.selected = true;
        }
      });

      document.getElementById('independentCardsSection').style.display = independentCards.length > 0 ? 'block' : 'none';
    });
}

function initializeForm() {
  t.get('card', 'shared', ['dependencyType', 'independentCardId', 'dependentOptions']).then(function(data) {
    const { dependencyType, independentCardId, dependentOptions } = data;

    if (dependencyType) {
      document.getElementById('dependency').value = dependencyType;
      if (dependencyType === 'dependent' && independentCardId) {
        fetchAndDisplayIndependentCards(independentCardId);
        // Display duration options for dependent cards
        document.getElementById('dependentOptions').style.display = 'block';
        document.getElementById('startCondition').value = dependentOptions.startCondition || 'start';
        document.getElementById('duration').value = dependentOptions.duration || '';
      } else {
        document.getElementById('independentCardsSection').style.display = 'none';
        document.getElementById('dependentOptions').style.display = 'none';
      }
    }
  });
}

document.getElementById('save').addEventListener('click', function() {
  const dependency = document.getElementById('dependency').value;
  const independentCardId = dependency === 'dependent' ? document.getElementById('independentCards').value : null;
  const startCondition = document.getElementById('startCondition').value;
  const duration = document.getElementById('duration').value;

  const dependentOptions = dependency === 'dependent' ? { startCondition, duration } : {};

  t.set('card', 'shared', {
    dependencyType: dependency,
    independentCardId: independentCardId,
    dependentOptions: dependentOptions
  }).then(() => t.closePopup());
});

initializeForm();
