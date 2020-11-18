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
  if (!game) return;
  if (
    game.started &&
    game.trucado &&
    !game.trucoAccepted &&
    msg.author.id === game.playerOfTheTime.user.id
  ) {
    game.trucoAccepted = true;
    game.trucado = false;
    game.channel
      .send(
        `${game.playerOfTheTime.opponent.user}, ${game.playerOfTheTime.user} aceitou o seu pedido de truco!`
      )
      .catch(console.error);
    game.channel
      .send(`Agora a partida está valendo ${game.roundValue} pontos`)
      .catch(console.error);

    game.playerOfTheTime =
      game.round % 2 !== 0 ? game.challenger : game.opponent;
    clearTimeout(game.selfDestroyCountdown);
    game.selfDestroyCountdown = setTimeout(() => {
      game.channel
        .send(
          `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
        )
        .catch(console.error);
      game = null;
    }, 60000);
    return;
  }

  if (game.started || msg.author.id !== game.opponent.user.id) {
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
  if (!game) return;

  if (
    game.started &&
    game.trucado &&
    !game.trucoAccepted &&
    msg.author.id === game.playerOfTheTime.user.id
  ) {
    game.channel.send(
      `${game.playerOfTheTime.user}, não aceitou o pedido de truco do ${game.playerOfTheTime.opponent.user}`
    );

    game.roundValue = game.roundValue === 3 ? 1 : game.roundValue - 3;
    clearTimeout(game.selfDestroyCountdown);
    game.selfDestroyCountdown = setTimeout(() => {
      game.channel
        .send(
          `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
        )
        .catch(console.error);
      game = null;
    }, 60000);
    game.trucoAccepted = false;
    game.trucado = false;
    game.startRound(game.playerOfTheTime.opponent);
    return;
  }

  if (game.started || msg.author.id !== game.opponent.user.id) {
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

exports.truco = function (msg) {
  if (
    !game ||
    !game.started ||
    game.trucoAccepted ||
    msg.author.id !== game.playerOfTheTime.user.id ||
    game.roundValue === 12
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

  const optionalNumber = Math.floor(msg.content.split(' ')[1]);

  if (!game.trucado && (optionalNumber === 3 || Number.isNaN(optionalNumber))) {
    game.roundValue = 3;
    game.trucado = true;
    game.channel.send(
      `${game.playerOfTheTime.opponent.user}, ${game.playerOfTheTime.user} está pedindo truco vai aceitar?`
    );
    game.playerOfTheTime = game.playerOfTheTime.opponent;
    return;
  }

  if (
    Number.isNaN(optionalNumber) ||
    optionalNumber % 3 !== 0 ||
    optionalNumber !== game.roundValue + 3
  ) {
    msg.reply('por favor, responda com um número válido.');
    return;
  }

  game.roundValue += 3;
  game.playerOfTheTime = game.playerOfTheTime.opponent;
  game.channel.send(
    `${game.playerOfTheTime.user}, ${game.playerOfTheTime.opponent.user} está pedindo ${game.roundValue}, vai aceitar?`
  );
};

exports.familia = function (msg) {
  if (!game || !game.started || game.turn !== 0) return;

  const player =
    msg.author.id === game.challenger.user.id ? game.challenger : game.opponent;

  if (player.selectedCard) return;

  clearTimeout(game.selfDestroyCountdown);
  game.selfDestroyCountdown = setTimeout(() => {
    game.channel
      .send(
        `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
      )
      .catch(console.error);
    game = null;
  }, 60000);

  let weakCardsQuantity = 0;

  if (game.familyQuantity < 3) {
    for (const card of player.hand) {
      if (card.value < 6 || card.value === 7) {
        weakCardsQuantity++;
      }
    }

    if (weakCardsQuantity === 3) {
      game.channel
        .send(`${player.user} discartou as cartas:`)
        .catch(console.error);
      player.hand.forEach((card, index) => {
        if (card.name === 'coringa') {
          game.channel.send(`${index + 1}. ${card.name}`).catch(console.error);
        } else {
          game.channel
            .send(`${index + 1}. ${card.name} de ${card.pip}`)
            .catch(console.error);
        }
      });

      game.familyQuantity++;
      player.hand = game.generateHand();
      game.sendHand(player);
      if (game.familyQuantity === 3) {
        game.channel
          .send('Não pode ser feito mais nenhum pedido de família.')
          .catch(console.error);
        return;
      }
      game.channel
        .send(`Ainda podem ser feitas ${3 - game.familyQuantity} famílias.`)
        .catch(console.error);
      return;
    }

    game.channel.send(`${player.user}, você não pode pedir família.`);
  }
};

exports.família = exports.familia;

exports.selecionar = function (msg) {
  if (
    !game ||
    !game.started ||
    msg.author.id !== game.playerOfTheTime.user.id ||
    game.trucado ||
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
    if (game.challenger.roundPoints > 11 || game.opponent.roundPoints > 11) {
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
