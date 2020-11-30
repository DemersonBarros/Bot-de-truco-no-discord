const { findMatch } = require('../../../matchesMethods.js');

function test() {
  const matches = { user1: 1 };
  return new Promise((resolve, reject) => {
    const match = findMatch(matches, 'user1');
    if (!match) reject('Test failed.');

    resolve('Test passed.');
  });
}

test().then(console.log).catch(console.log);
