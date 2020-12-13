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

function howManyCardsAreTheSame(newDeck, oldDeck) {
  let amountOfTheSameCards = 0;
  for (let i = 0; i < 28; i++) {
    const newDeckCard = newDeck[i];
    const deckCard = oldDeck[i];
    if (Object.is(newDeckCard, deckCard)) {
      amountOfTheSameCards++;
    }
  }
  return amountOfTheSameCards;
}

test('Truco.randomizeDeck()', () => {
  let newDeck;
  let oldDeck;
  for (let i = 0; i < 3; i++) {
    if (!newDeck) {
      newDeck = truco.randomizeDeck();
      oldDeck = truco.deck;
    } else {
      oldDeck = newDeck;
      newDeck = truco.randomizeDeck();
    }
    expect(newDeck.length).toEqual(28);
    const amountOfTheSameCards = howManyCardsAreTheSame(newDeck, oldDeck);
    expect(amountOfTheSameCards).toBeLessThan(14);
  }
});
