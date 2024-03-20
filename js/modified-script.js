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
        t.get('card', 'shared', 'independentCardId').then(function(independentCardId) {
          fetchAndDisplayIndependentCards(independentCardId);
        });
        // Display duration options for dependent cards
        document.getElementById('dependentOptions').style.display = 'block';
        // Fetch and set saved options for dependent cards
        t.get('card', 'shared', 'dependentOptions').then(function(dependentOptions) {
          if (dependentOptions) {
            document.getElementById('startCondition').value = dependentOptions.startCondition;
            document.getElementById('duration').value = dependentOptions.duration;
          }
        });
      } else {
        document.getElementById('independentCardsSection').style.display = 'none';
        document.getElementById('dependentOptions').style.display = 'none';
      }
    }
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
    .then(() => t.closePopup());
});

// Listen for changes in the completion status of the independent card
t.render(() => {
  t.card('id', 'name', 'dueComplete')
    .then((card) => {
      if (card.dueComplete && card.name === 'Name of the independent card') {
        // Get the dependent card ID and its saved options
        t.get('card', 'shared', 'dependentOptions')
          .then(dependentOptions => {
            if (dependentOptions) {
              // Calculate start and due dates based on options and completion date of the independent card
              const startDate = // Calculate start date based on options and completion date of the independent card
              const dueDate = // Calculate due date based on start date and duration from options
              // Update the dependent card's start and due dates
              t.set(cardId, 'due', dueDate);
              // Assuming you have a custom field for start date, update that too
              t.set(cardId, 'custom', 'Start Date', startDate);
            }
          });
      }
    });
});

initializeForm();
