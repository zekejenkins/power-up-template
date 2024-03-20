/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

function fetchAndDisplayIndependentCards(selectedCardId) {
  t.cards('all')
    .then(function(cards) {
      const independentCardPromises = cards.map(card =>
        t.get(card.id, 'shared', ['dependencyType', 'startCondition'])
          .then(data => ({ card, startCondition: data.startCondition }))
      );

      return Promise.all(independentCardPromises);
    })
    .then(function(filteredCards) {
      const independentCards = filteredCards.filter(({ card }) => card.dependencyType === 'independent');
      
      const select = document.getElementById('independentCards');
      select.innerHTML = ''; // Clear existing options

      independentCards.forEach(({ card, startCondition }) => {
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
  t.get('card', 'shared', ['dependencyType', 'independentCardId', 'startCondition', 'duration'])
    .then(function(cardData) {
      const dependencyType = cardData.dependencyType;
      if(dependencyType) {
        document.getElementById('dependency').value = dependencyType;
        if(dependencyType === 'dependent') {
          const independentCardId = cardData.independentCardId;
          fetchAndDisplayIndependentCards(independentCardId);
          // Display duration options for dependent cards
          document.getElementById('dependentOptions').style.display = 'block';
          // Display and set saved options for dependent cards
          document.getElementById('startCondition').value = cardData.startCondition || 'start';
          document.getElementById('duration').value = cardData.duration || '';
        } else {
          document.getElementById('independentCardsSection').style.display = 'none';
          document.getElementById('dependentOptions').style.display = 'none';
        }
      }
    })
    .catch(function(err) {
      console.error('Error initializing form:', err);
    });
}

document.getElementById('dependency').addEventListener('change', function() {
  if(this.value === 'dependent') {
    fetchAndDisplayIndependentCards();
    document.getElementById('dependentOptions').style.display = 'block';
  } else {
    document.getElementById('independentCardsSection').style.display = 'none';
    document.getElementById('dependentOptions').style.display = 'none';
  }
});

document.getElementById('save').addEventListener('click', function() {
  const dependency = document.getElementById('dependency').value;
  const independentCardId = dependency === 'dependent' ? document.getElementById('independentCards').value : null;
  const startCondition = document.getElementById('startCondition').value;
  const duration = document.getElementById('duration').value;

  t.set('card', 'shared', 'dependencyType', dependency)
    .then(() => {
      if(dependency === 'dependent' && independentCardId) {
        return t.set('card', 'shared', 'independentCardId', independentCardId);
      }
    })
    .then(() => {
      if(dependency === 'dependent') {
        // Save the options for dependent cards
        return t.set('card', 'shared', 'dependentOptions', { startCondition, duration });
      }
    })
    .then(() => t.closePopup())
    .catch(function(err) {
      console.error('Error saving data:', err);
    });
});

initializeForm();
