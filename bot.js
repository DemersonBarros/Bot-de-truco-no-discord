'use strict';

const Discord = require('discord.js');
const process = require('process');
const commands = require('./commands.js');
const config = require('./config.json');

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
    let commandName = msg.content.split(' ')[0].slice(config.prefix.length);
    commandName = commandName.toLowerCase();
    if (!commands[commandName]) {
      reject(new Error('Invalid command'));
    }
    resolve(commandName);
  });
}

const matches = {};

client.on('message', (msg) => {
  if (msg.author.id === client.user.id) return;

  if (msg.content.indexOf(config.prefix) === 0) {
    filterCommandName(msg)
      .then((commandName) => {
        commands[commandName](msg, matches);
      })
      .catch((error) => {
        if (error.message !== 'Invalid command') {
          process.exit(1);
        }
        msg.reply('por favor, só envie comandos válidos.').catch(console.error);
      });
  }
});

const TOKEN = config.TOKEN;
client
  .login(TOKEN)
  .then(() => {
    console.log('The bot is running');
  })
  .catch(console.error);
