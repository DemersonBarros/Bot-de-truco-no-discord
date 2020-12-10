const Discord = require('discord.js');
const Truco = require('../../../Truco.js');

const clients = [];

afterAll(() => {
  clients.forEach((client) => {
    client.destroy();
  });
});

describe('new Truco()', () => {
  test('create new Truco instance', () => {
    const client = new Discord.Client({});
    const challenger = new Discord.User(client, {});
    const opponent = new Discord.User(client, {});
    const channel = new Discord.TextChannel(new Discord.Guild(client, {}), {});
    clients.push(client);

    expect(new Truco(client, challenger, opponent, channel)).toBeInstanceOf(
      Truco
    );

    client.destroy();
  });

  describe('throw an InvalidParameter error', () => {
    test('because of the client parameter', () => {
      const client = new Discord.Client({});
      const challenger = new Discord.User(client, {});
      const opponent = new Discord.User(client, {});
      const channel = new Discord.TextChannel(
        new Discord.Guild(client, {}),
        {}
      );
      clients.push(client);

      expect(() => {
        new Truco(undefined, challenger, opponent, channel);
      }).toThrowError();
    });

    test('because of challenger parameter', () => {
      const client = new Discord.Client({});
      const opponent = new Discord.User(client, {});
      const channel = new Discord.TextChannel(
        new Discord.Guild(client, {}),
        {}
      );
      clients.push(client);

      expect(() => {
        new Truco(client, undefined, opponent, channel);
      }).toThrowError();
    });

    test('because of opponent parameter', () => {
      const client = new Discord.Client({});
      const challenger = new Discord.User(client, {});
      const channel = new Discord.TextChannel(
        new Discord.Guild(client, {}),
        {}
      );
      clients.push(client);

      expect(() => {
        new Truco(client, challenger, undefined, channel);
      }).toThrowError();
    });

    test('because of channel parameter', () => {
      const client = new Discord.Client({});
      const challenger = new Discord.User(client, {});
      const opponent = new Discord.User(client, {});
      clients.push(client);

      expect(() => {
        new Truco(client, challenger, opponent, undefined);
      }).toThrowError();
    });
  });
});
