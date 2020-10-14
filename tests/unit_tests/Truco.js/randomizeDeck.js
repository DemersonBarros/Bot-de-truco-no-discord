const Truco = require('../../../Truco.js');

function test() {
  const truco = new Truco();
  const newDeck = truco.randomizeDeck();
  if (newDeck.length !== 28) return 'failed!';
  let amountOfSameCards = 0;
  for (let i = 0; i < 28; i++) {
    const newDeckCard = newDeck[i];
    const deckCard = truco.deck[i];
    if (newDeckCard === deckCard) {
      amountOfSameCards++;
    }
  }
  if (amountOfSameCards > 14) return 'failed!';
  return 'passed!';
}

console.log(test());
