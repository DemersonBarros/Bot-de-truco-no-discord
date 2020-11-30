const { deleteMatch } = require('../../../matchesMethods.js');

function test() {
  const matches = { challenger: {}, opponent: {} };
  return new Promise((resolve, reject) => {
    deleteMatch(matches, 'challenger', 'opponent');
    if (matches.challenger || matches.opponent) reject('Test failed.');

    resolve('Test passed.');
  });
}

test().then(console.log).catch(console.log);
