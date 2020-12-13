const Discord = require('discord.js');
const Truco = require('../../../Truco.js');

let clients = [];
let challenger;
let opponent;

beforeAll(() => {
  const client = new Discord.Client({});
  challenger = new Discord.User(client, {});
  opponent = new Discord.User(client, {});
  const channel = new Discord.TextChannel(new Discord.Guild(client, {}), {});
  clients.push(client);

  truco = new Truco(client, challenger, opponent, channel);
});

afterAll(() => {
  clients.forEach((client) => {
    client.destroy();
  });
});

test('Truco.sendHand()', () => {
  let send = function () {
    return new Promise((resolve, reject) => {
      resolve('sent');
    });
  };
  challenger.send = jest.fn(send);
  opponent.send = jest.fn(send);
  truco.sendHand(truco.challenger);
  truco.sendHand(truco.opponent);
  expect(challenger.send).toHaveBeenCalledTimes(1);
  expect(challenger.send).toHaveBeenCalledTimes(1);
});
