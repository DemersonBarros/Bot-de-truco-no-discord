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

  start() {
    this.started = true;
    console.log('Game started');
  }
}

module.exports = Truco;
