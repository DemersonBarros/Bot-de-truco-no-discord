const deck = require('./deck.json');

class Truco {
  constructor(client, challenger, opponent, channel) {
    this.client = client;
    this.channel = channel;
    this.challenger = {
      user: challenger,
    };
    this.opponent = {
      user: opponent,
    };
    this.deck = deck;
    this.randomizedDeck = this.randomizeDeck(deck);
    this.started = false;
  }

  validatePlayers() {
    return new Promise((resolve, reject) => {
      if (this.challenger.user.id === this.opponent.user.id) {
        reject('The challenger and opponent is the same person');
      } else if (this.opponent.user.id === this.client.user.id) {
        reject('The opponent is the bot');
      } else if (this.opponent.user.presence.status !== 'online') {
        reject('The opponent is offline');
      }
      resolve();
    });
  }

  randomizeDeck() {
    function copyDeck(deck) {
      const newDeck = [];
      Object.assign(newDeck, deck);
      return newDeck;
    }

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const newDeck = copyDeck(this.deck);
    const randomizedDeck = [];
    for (let i = 0; i < 28; i++) {
      const integer = getRandomInt(newDeck.length);
      randomizedDeck.push(newDeck[integer]);
      newDeck.splice(integer, 1);
    }
    return randomizedDeck;
  }

  start() {
    this.started = true;
    console.log('Game started');
  }
}

module.exports = Truco;
