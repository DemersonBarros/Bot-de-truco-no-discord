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
        game.channel
          .send(
            `${game.challenger.user}, infelizmente não foi possível desafiar o seu oponente.`
          )
          .catch(console.err);
      });
    return;
  }
  if (!game) return;
  if (!game.started) {
    if (msg.author.id !== game.opponent.user.id) return;
    switch (msg.content) {
      case 'sim':
        game.start();
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
