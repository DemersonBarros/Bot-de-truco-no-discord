'use strict';

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  client.user.setPresence({
      activity: {
        name: 'um joguinho de cartas'
      }
    })
    .then(() => {
      console.log("The bot's presence has been successfully changed")
    })
    .catch(console.error);
});

const TOKEN = fs.readFileSync('./token.txt', {
  encoding: 'utf-8'
});

client.login(TOKEN)
  .then(token => {
    console.log('The bot is running');
  })
  .catch(console.error);