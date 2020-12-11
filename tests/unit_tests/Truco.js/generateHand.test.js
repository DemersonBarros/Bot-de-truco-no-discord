const Discord = require('discord.js');
const Truco = require('../../../Truco.js');

const clients = [];
let truco;

beforeAll(() => {
  const client = new Discord.Client({});
  const challenger = new Discord.User(client, {});
  const opponent = new Discord.User(client, {});
  const channel = new Discord.TextChannel(new Discord.Guild(client, {}), {});
  clients.push(client);

  truco = new Truco(client, challenger, opponent, channel);
});

afterAll(() => {
  clients.forEach((client) => {
    client.destroy();
  });
});

describe('Truco.generateHand()', () => {
  let oldHand;

  test('return a hand', () => {
    truco.randomizedDeck = truco.randomizeDeck();

    const hand = truco.generateHand();
    oldHand = hand;
    expect(hand.length).toBe(3);
    for (const card of hand) {
      expect(typeof card.name).toBe('string');
      expect(typeof card.value).toBe('number');
      expect(truco.deck).toContain(card);
    }
  });

  test('return a new hand', () => {
    truco.randomizedDeck = truco.randomizeDeck();

    const newHand = truco.generateHand();

    expect(newHand).not.toMatchObject(oldHand);
  });
});
