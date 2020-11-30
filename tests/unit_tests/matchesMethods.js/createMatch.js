const { createMatch } = require('../../../matchesMethods.js');

function test() {
  const matches = {};
  const game = {};
  return new Promise((resolve, reject) => {
    createMatch(matches, game, 'challenger', 'opponent');
    if (matches.challenger && matches.opponent) resolve('Test passed.');

    reject('Test failed.');
  });
}

test().then(console.log).catch(console.log);
