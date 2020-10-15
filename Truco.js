const deck = require('./deck.json');

class Truco {
  constructor(client, challenger, opponent, channel) {
    this.client = client;
    this.channel = channel;
    this.deck = deck;
    this.randomizedDeck = this.randomizeDeck(deck);
    this.challenger = {
      user: challenger,
      hand: this.generateHand(),
    };
    this.opponent = {
      user: opponent,
      hand: this.generateHand(),
    };
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

  generateHand() {
    const hand = [];
    for (let i = 0; i < 3; i++) {
      hand.push(this.randomizedDeck.pop());
    }
    return hand;
  }

  sendHand(player) {
    player.user.send('Essa é a sua mão:').catch(console.error);
    for (let i = 0; i < 3; i++) {
      const card = player.hand[i];
      if (card.name === 'coringa') {
        player.user
          .send(
            `${i + 1}. ${
              card.name[0].toUpperCase() + card.name.slice(1, card.name.length)
            }`
          )
          .catch(console.error);
        continue;
      }
      player.user
        .send(`${i + 1}. ${card.name} de ${card.pip}`)
        .catch(console.error);
    }
  }

  start() {
    this.started = true;
    this.sendHand(this.challenger);
    this.sendHand(this.opponent);
    console.log('Game started');
  }
}

module.exports = Truco;
