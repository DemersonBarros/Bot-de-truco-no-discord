'use strict';

const fs = require('fs');
const Discord = require('discord.js');
const Truco = require('./Truco.js');
const { prefix } = require('./config.json');

const client = new Discord.Client();

client.on('ready', () => {
  client.user
    .setPresence({
      activity: {
        name: 'um joguinho de cartas',
      },
    })
    .then(() => {
      console.log("The bot's presence has been successfully changed");
    })
    .catch(console.error);
});

let game;

client.on('message', (msg) => {
  if (msg.author === client.user) return;
  if (msg.content.startsWith(`${prefix}desafiar`)) {
    game = new Truco(
      client,
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
  }
  if (!game) return;
  if (!game.started) {
    if (msg.author.id !== game.opponent.user.id) return;
    switch (msg.content) {
      case 'sim':
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
        break;
      case 'nao':
      case 'não':
        game.channel
          .send(
            `${game.challenger.user}, infelizmente ${game.opponent.user} não aceitou.`
          )
          .catch(console.error);
        game = null;
        break;
    }
    return;
  }

  if (
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

  const cardIndex = Math.floor(msg.content) - 1;
  if (
    cardIndex > game.playerOfTheTime.hand.length ||
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
});

const TOKEN = fs.readFileSync('./token.txt', {
  encoding: 'utf-8',
});

client
  .login(TOKEN)
  .then(() => {
    console.log('The bot is running');
  })
  .catch(console.error);
