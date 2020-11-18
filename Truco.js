const deck = require('./deck.json');

class Truco {
  constructor(client, challenger, opponent, channel) {
    this.client = client;
    this.channel = channel;
    this.deck = deck;
    this.randomizedDeck = this.randomizeDeck(deck);
    this.round = 1;
    this.turn = 0;
    this.turnValue = 1;
    this.roundValue = 1;
    this.familyQuantity = 0;
    this.createPlayers(challenger, opponent);
    this.challenger.opponent = this.opponent;
    this.opponent.opponent = this.challenger;
    this.playerOfTheTime = this.challenger;
    this.dealer = this.opponent;
    this.secondToSelectCard = null;
    this.firstTurnWinner = null;
    this.trucado = false;
    this.trucoAccepted = false;
    this.started = false;
  }

  createPlayers(...args) {
    const players = ['challenger', 'opponent'];

    for (let i = 0; i < 2; i++) {
      this[players[i]] = {
        user: args[i],
        hand: this.generateHand(),
        selectedCard: null,
        turnPoints: 0,
        roundPoints: 0,
      };
    }
  }

  validatePlayers() {
    return new Promise((resolve, reject) => {
      if (this.challenger.user.id === this.opponent.user.id) {
        reject('The challenger and opponent is the same person');
      } else if (this.opponent.user.id === this.client.user.id) {
        reject('The opponent is the bot');
      } else if (this.opponent.user.presence.status === 'offline') {
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
    for (let i = 0; i < player.hand.length; i++) {
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

  startTurn() {
    this.turn++;
    this.familyQuantity = 0;
    const opponentCard = this.opponent.selectedCard;
    const challengerCard = this.challenger.selectedCard;

    const getTurnWinner = (opponentCard, challengerCard) => {
      if (opponentCard.value === challengerCard.value) return;
      return opponentCard.value > challengerCard.value
        ? this.opponent
        : this.challenger;
    };

    const winner = getTurnWinner(opponentCard, challengerCard);
    if (!winner) {
      if (this.turn === 1) {
        this.channel
          .send('O jogo foi cangado! Joguem suas cartas mais fortes.')
          .catch(console.error);
        this.sendHand(this.playerOfTheTime);
        this.playerOfTheTime = this.secondToSelectCard;
        this.channel
          .send(`${this.playerOfTheTime.user} é a sua vez de jogar.`)
          .catch(console.error);
        this.turnValue = 2;
      } else if (this.turn === 2) {
        if (this.turnValue !== 2) {
          this.startRound(this.firstTurnWinner);
          return;
        }
        this.channel
          .send('O jogo foi cangado, de novo! Joguem suas cartas mais fortes.')
          .catch(console.error);
        this.sendHand(this.playerOfTheTime);
        this.playerOfTheTime = this.secondToSelectCard;
        this.channel
          .send(`${this.playerOfTheTime.user} é a sua vez de jogar.`)
          .catch(console.error);
      } else if (this.turn === 3) {
        if (this.turnValue === 2) {
          this.channel
            .send('O jogo foi cangado, pela terceira vez!')
            .catch(console.error);
          this.startRound(this.dealer);
          return;
        }
        this.startRound(this.firstTurnWinner);
        return;
      }
      this.challenger.selectedCard = null;
      this.opponent.selectedCard = null;
      return;
    }

    if (winner.selectedCard.name === 'coringa') {
      this.channel
        .send(
          `${winner.user} ganhou o turno com um ${winner.selectedCard.name}!`
        )
        .catch(console.error);
    } else {
      this.channel
        .send(
          `${winner.user} ganhou o turno com um ${winner.selectedCard.name} de ${winner.selectedCard.pip}`
        )
        .catch(console.error);
    }

    winner.turnPoints += this.turnValue;
    if (winner.turnPoints === 2) {
      this.startRound(winner);
      return;
    }
    this.challenger.selectedCard = null;
    this.opponent.selectedCard = null;
    this.firstTurnWinner = winner;
    this.sendHand(this.playerOfTheTime);
    this.playerOfTheTime = winner;
    this.channel
      .send(`${this.playerOfTheTime.user} é a sua vez de jogar.`)
      .catch(console.error);
  }

  startRound(winner) {
    winner.roundPoints += this.roundValue;
    this.round++;
    if (winner.roundPoints > 11) {
      this.channel
        .send(`${winner.user} ganhou o jogo, parabéns!`)
        .catch(console.error);
      return;
    }
    this.channel
      .send(`${winner.user} ganhou a rodada, parabéns!`)
      .catch(console.error);
    this.turn = 0;
    this.turnValue = 1;
    this.opponent.turnPoints = 0;
    this.challenger.turnPoints = 0;
    this.challenger.selectedCard = null;
    this.opponent.selectedCard = null;
    this.secondToSelectCard = null;
    this.randomizedDeck = this.randomizeDeck();
    this.challenger.hand = this.generateHand();
    this.sendHand(this.challenger);
    this.opponent.hand = this.generateHand();
    this.sendHand(this.opponent);
    this.playerOfTheTime =
      this.round % 2 !== 0 ? this.challenger : this.opponent;
    this.dealer = this.playerOfTheTime.opponent;
    this.channel
      .send(`${this.playerOfTheTime.user} é a sua vez de jogar.`)
      .catch(console.error);
  }

  start() {
    this.started = true;
    this.sendHand(this.challenger);
    this.sendHand(this.opponent);
    this.channel
      .send(`${this.playerOfTheTime.user} é a sua vez de jogar.`)
      .catch();
    console.log('Game started');
  }
}

module.exports = Truco;
