/* global TrelloPowerUp */
TrelloPowerUp.initialize({
  'board-buttons': function(t, options) {
    return [{
      icon: GRAY_ICON, // Your icon path here
      text: 'Show Completed Cards',
      callback: function(t) {
        showCompletedCards(t);
      }
    }];
  },
  // Add other capabilities as needed
});

function showCompletedCards(t) {
  t.cards('all')
    .then(function(cards) {
      const completedCards = cards.filter(card => card.dueComplete);
      console.log("Completed Cards:", completedCards);
      alert(`Completed Cards: ${completedCards.map(card => card.name).join(', ')}`);
    })
    .catch(function(error) {
      console.error("Failed to fetch completed cards:", error);
    });
}

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
        // Retrieve and set the independentCardId
        t.get('card', 'shared', 'independentCardId').then(function(independentCardId) {
          fetchAndDisplayIndependentCards(independentCardId);
        });

        // Retrieve and set the startCondition and duration
        t.get('card', 'shared', 'dependentOptions').then(function(dependentOptions) {
          if(dependentOptions) {
            if(dependentOptions.startCondition) {
              document.getElementById('startCondition').value = dependentOptions.startCondition;
            }
            if(dependentOptions.duration) {
              document.getElementById('duration').value = dependentOptions.duration;
            }
          }
        });

        // Display the dependent options section
        document.getElementById('dependentOptions').style.display = 'block';
      } else {
        // Hide the dependent options section and independent cards section
        document.getElementById('independentCardsSection').style.display = 'none';
        document.getElementById('dependentOptions').style.display = 'none';
      }
    }
  });
}


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
        const dependentOptions = { startCondition, duration };
        return t.set('card', 'shared', 'dependentOptions', dependentOptions);
      }
    })
    .then(() => t.closePopup());
});


initializeForm();
