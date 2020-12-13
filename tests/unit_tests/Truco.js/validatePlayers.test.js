const Discord = require('discord.js');
const Truco = require('../../../Truco.js');

const clients = [];

let client;
let channel;

beforeAll(() => {
  client = new Discord.Client();
  let clientUser = new Discord.ClientUser(client, {
    id: Discord.SnowflakeUtil.generate(),
    bot: true,
  });
  client.user = clientUser;
  channel = new Discord.TextChannel(new Discord.Guild(client, {}), {});
  clients.push(client);
});

afterAll(() => {
  clients.forEach((client) => {
    client.destroy();
  });
});

describe('Truco.validatePlayers()', () => {
  test('resolve nothing', async () => {
    let challenger = new Discord.User(client, {
      id: Discord.SnowflakeUtil.generate(),
    });

    let opponent = new Discord.User(client, {
      id: Discord.SnowflakeUtil.generate(),
    });

    Object.defineProperties(opponent, {
      presence: {
        get: function () {
          let presence = new Discord.Presence(client, {
            user: opponent,
            status: 'idle',
          });
          return presence;
        },
      },
    });

    let truco = new Truco(client, challenger, opponent, channel);
    await expect(truco.validatePlayers()).resolves.toBeUndefined();
  });

  describe('reject the reason why it failed', () => {
    test('because the challenger and opponent are the same person', async () => {
      let challenger = new Discord.User(client, {
        id: Discord.SnowflakeUtil.generate(),
      });

      let opponent = new Discord.User(client, {
        id: challenger.id,
      });

      Object.defineProperties(opponent, {
        presence: {
          get: function () {
            let presence = new Discord.Presence(client, {
              user: opponent,
              status: 'online',
            });
            return presence;
          },
        },
      });

      let truco = new Truco(client, challenger, opponent, channel);
      await expect(truco.validatePlayers()).rejects.toBe(
        'The challenger and opponent is the same person'
      );
    });

    test('because of the opponent and the bot are the same person', async () => {
      let challenger = new Discord.User(client, {
        id: Discord.SnowflakeUtil.generate(),
      });

      let opponent = new Discord.User(client, {
        id: client.user.id,
      });

      Object.defineProperties(opponent, {
        presence: {
          get: function () {
            let presence = new Discord.Presence(client, {
              user: opponent,
              status: 'online',
            });
            return presence;
          },
        },
      });

      let truco = new Truco(client, challenger, opponent, channel);
      await expect(truco.validatePlayers()).rejects.toBe(
        'The opponent is the bot'
      );
    });

    test('because the opponent is offline', async () => {
      let challenger = new Discord.User(client, {
        id: Discord.SnowflakeUtil.generate(),
      });

      let opponent = new Discord.User(client, {
        id: Discord.SnowflakeUtil.generate(),
      });

      Object.defineProperties(opponent, {
        presence: {
          get: function () {
            let presence = new Discord.Presence(client, {
              user: opponent,
              status: 'offline',
            });
            return presence;
          },
        },
      });

      let truco = new Truco(client, challenger, opponent, channel);
      await expect(truco.validatePlayers()).rejects.toBe(
        'The opponent is offline'
      );
    });
  });
});
