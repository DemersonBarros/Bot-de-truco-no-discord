const Truco = require('../../../Truco.js');

function test() {
  const truco = new Truco();
  const hand = truco.generateHand();
  for (let i = 0; i < hand.length; i++) {
    if (hand.length !== 3) return 'fail';
    const card = hand[i];
    if (!card.name && !card.value) {
      return 'fail!';
    }
  }
  return 'pass!';
}

console.log(test());
