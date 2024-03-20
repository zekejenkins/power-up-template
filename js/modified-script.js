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

      document.getElementById('independentCardsSection').style.display = independentCards.length > 0 && document.getElementById('dependency').value === 'dependent' ? 'block' : 'none';
    });
}

function initializeForm() {
  t.get('card', 'shared', 'dependencyType').then(function(dependencyType) {
    if(dependencyType) {
      document.getElementById('dependency').value = dependencyType;
      if(dependencyType === 'dependent') {
        t.get('card', 'shared', 'independentCardId', 'dependentOptions').then(function(sharedData) {
          fetchAndDisplayIndependentCards(sharedData.independentCardId);
          // Display duration options for dependent cards
          document.getElementById('dependentOptions').style.display = 'block';
          document.getElementById('startCondition').style.display = 'block';
          document.getElementById('duration').style.display = 'block';
          // Set saved options for dependent cards
          const dependentOptions = sharedData.dependentOptions || {};
          document.getElementById('startCondition').value = dependentOptions.startCondition || 'start';
          document.getElementById('duration').value = dependentOptions.duration || '';
        });
      } else {
        document.getElementById('independentCardsSection').style.display = 'none';
        document.getElementById('dependentOptions').style.display = 'none';
        // Hide start condition and duration for independent cards
        document.getElementById('startCondition').style.display = 'none';
        document.getElementById('duration').style.display = 'none';
      }
    }
  });
}

document.getElementById('dependency').addEventListener('change', function() {
  if(this.value === 'dependent') {
    fetchAndDisplayIndependentCards();
    document.getElementById('dependentOptions').style.display = 'block';
    document.getElementById('startCondition').style.display = 'block';
    document.getElementById('duration').style.display = 'block';
  } else {
    document.getElementById('independentCardsSection').style.display = 'none';
    document.getElementById('dependentOptions').style.display = 'none';
    // Hide start condition and duration for independent cards
    document.getElementById('startCondition').style.display = 'none';
    document.getElementById('duration').style.display = 'none';
  }
});

document.getElementById('save').addEventListener('click', function() {
  const dependency = document.getElementById('dependency').value;
  const independentCardId = dependency === 'dependent' ? document.getElementById('independentCards').value : null;

  t.set('card', 'shared', 'dependencyType', dependency)
    .then(() => {
      if(dependency === 'dependent' && independentCardId) {
        return t.set('card', 'shared', 'independentCardId', independentCardId);
      }
    })
    .then(() => {
      if(dependency === 'dependent') {
        // Save the options for dependent cards
        const startCondition = document.getElementById('startCondition').value;
        const duration = document.getElementById('duration').value;
        return t.set('card', 'shared', 'dependentOptions', { startCondition, duration });
      }
    })
    .then(() => t.closePopup());
});

initializeForm();
