const Truco = require('./Truco.js');

let game;

exports.desafiar = function (msg) {
  game = new Truco(
    msg.client,
    msg.author,
    msg.mentions.users.first(),
    msg.channel
  );
  game
    .validatePlayers()
    .then(() => {
      game.channel
        .send(
          `${game.opponent.user}, ${game.challenger.user} está te desafiando, vai aceitar? (Responda com sim ou não).`
        )
        .catch(console.error);
      game.selfDestroyCountdown = setTimeout(() => {
        game.channel
          .send(
            `${game.opponent.user} não respondeu, então a partida não vai iniciar.`
          )
          .catch(console.error);
        game = null;
      }, 60000);
    })
    .catch((err) => {
      switch (err) {
        case 'The challenger and opponent is the same person':
          msg
            .reply(`não tem como você jogar com você mesmo`)
            .catch(console.error);
          break;
        case 'The opponent is the bot':
          msg
            .reply(
              `você não pode jogar comigo, por favor escolha um oponente válido.`
            )
            .catch(console.error);
          break;
        case 'The opponent is offline':
          msg
            .reply(`o ${game.opponent.user} está offline.`)
            .catch(console.error);
          break;
      }
      game = null;
    });
  return;
};

exports.aceitar = function (msg) {
  if (!game || game.started || msg.author.id !== game.opponent.user.id) {
    return;
  }

  game.start();
  clearTimeout(game.selfDestroyCountdown);
  game.selfDestroyCountdown = setTimeout(() => {
    game.channel
      .send(
        `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
      )
      .catch(console.error);
    game = null;
  }, 60000);
};

exports.negar = function (msg) {
  if (!game || game.started || msg.author.id !== game.opponent.user.id) {
    return;
  }

  game.channel
    .send(
      `${game.challenger.user}, infelizmente ${game.opponent.user} não aceitou.`
    )
    .catch(console.error);
  clearTimeout(game.selfDestroyCountdown);
  game = null;
};

exports.selecionar = function (msg) {
  if (
    !game ||
    !game.started ||
    msg.author.id !== game.playerOfTheTime.user.id ||
    msg.channel.type !== 'dm'
  ) {
    return;
  }

  clearTimeout(game.selfDestroyCountdown);
  game.selfDestroyCountdown = setTimeout(() => {
    game.channel
      .send(
        `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
      )
      .catch(console.error);
    game = null;
  }, 60000);

  const cardIndex = Math.floor(msg.content.split(' ')[1]) - 1;
  if (
    cardIndex > game.playerOfTheTime.hand.length - 1 ||
    cardIndex < 0 ||
    Number.isNaN(cardIndex)
  ) {
    game.playerOfTheTime.user
      .send('Por favor, envie uma carta válida.')
      .catch(console.error);
    return;
  }

  const card = game.playerOfTheTime.hand[cardIndex];
  game.playerOfTheTime.selectedCard = card;
  game.playerOfTheTime.hand.splice(cardIndex, 1);
  if (card.name === 'coringa') {
    game.channel
      .send(`${game.playerOfTheTime.user} enviou a carta ${card.name}!`)
      .catch(console.error);
  } else {
    game.channel
      .send(
        `${game.playerOfTheTime.user} enviou a carta ${card.name} de ${card.pip}`
      )
      .catch(console.error);
  }

  if (game.opponent.selectedCard && game.challenger.selectedCard) {
    game.startTurn();
    if (
      game.challenger.roundPoints === 12 ||
      game.opponent.roundPoints === 12
    ) {
      clearTimeout(game.selfDestroyCountdown);
      game = null;
    }
    return;
  }

  if (game.playerOfTheTime.hand.length !== 0) {
    game.sendHand(game.playerOfTheTime);
  }

  game.secondToSelectCard = game.playerOfTheTime.opponent;
  game.playerOfTheTime = game.playerOfTheTime.opponent;
  game.channel
    .send(`${game.playerOfTheTime.user} é a sua vez de jogar.`)
    .catch(console.error);
};
