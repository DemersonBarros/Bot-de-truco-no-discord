'use strict';

const fs = require('fs');
const Discord = require('discord.js');
const commands = require('./commands.js');
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

function filterCommandName(msg) {
  return new Promise(function (resolve, reject) {
    let commandName = msg.content.split(' ')[0].slice(prefix.length);
    commandName = commandName.toLowerCase();
    if (!commands[commandName]) {
      reject(new Error('Invalid command'));
    }
    resolve(commandName);
  });
}

client.on('message', (msg) => {
  if (msg.author.id === client.user.id) return;

  if (msg.content.indexOf(prefix) === 0) {
    filterCommandName(msg)
      .then((commandName) => {
        commands[commandName](msg);
      })
      .catch(() => {
        msg.reply('por favor, só envie comandos válidos.').catch(console.error);
      });
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
