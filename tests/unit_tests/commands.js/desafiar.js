const { desafiar } = require('../../../commands.js');
const Truco = require('../../../Truco.js');

function createUser(name) {
  return {
    id: name === 'challenger' ? 1 : 2,
    presence: { status: 'online' },
    username: name,
  };
}

function test(msg) {
  const matches = {};

  return new Promise(function (resolve, reject) {
    desafiar(msg, matches);

    setTimeout(() => {
      if (
        matches.challenger instanceof Truco &&
        matches.opponent instanceof Truco
      ) {
        const game = matches.challenger;
        clearTimeout(game.selfDestroyCountdown);

        if (msg.author.id !== game.challenger.user.id) {
          reject('Test failed: Message author is not equal to challenger.');
        } else if (msg.mentions.users.first().id !== game.opponent.user.id) {
          reject('Test failed: Mentioned user is not equal to opponent.');
        } else if (msg.client.user.id !== game.client.user.id) {
          reject('Test failed: Message client is not equal to game client.');
        } else if (msg.channel.id !== game.channel.id) {
          reject('Test failed: Message channel is not equal to game channel.');
        }

        resolve('Test passed.');
      }
      reject('Test failed: New Truco instances was not created on matches.');
    }, 0);
  });
}

function inputChange(typeOfTest, input) {
  function copyObject(object) {
    const copiedInput = {};
    for (const property of Object.keys(object)) {
      if (typeof object[property] === 'object') {
        copiedInput[property] = copyObject(object[property]);
      } else {
        copiedInput[property] = object[property];
      }
    }
    return copiedInput;
  }

  const copiedInput = copyObject(input);

  if (typeOfTest === 'pass') {
    return copiedInput;
  } else if (typeOfTest === 'fail') {
    copiedInput.mentions.users.first = function () {
      const output = createUser('opponent');
      output.id = 1;
      return output;
    };
    return copiedInput;
  }
}

const input = {
  client: {
    user: { id: 3 },
  },
  author: createUser('challenger'),
  mentions: {
    users: {
      first: function () {
        return createUser('opponent');
      },
    },
  },
  channel: {
    id: 4,
    send: function () {
      return new Promise((resolve) => {
        resolve('sent');
      });
    },
  },
  reply: function () {
    return new Promise((resolve) => {
      resolve('sent');
    });
  },
};

function outputMessage(typeOfTest, output) {
  if (typeOfTest === 'pass' || typeOfTest === 'fail') {
    console.log(`This test should ${typeOfTest}:\n${output}`);
  } else {
    throw new Error(`type of test should not be ${typeOfTest}`);
  }
}

exports.run = function () {
  let msg = inputChange('pass', input);
  test(msg)
    .then((output) => {
      outputMessage('pass', output);
    })
    .catch((err) => {
      outputMessage('pass', err);
    });
  msg = inputChange('fail', input);
  test(msg)
    .then((output) => {
      outputMessage('fail', output);
    })
    .catch((err) => {
      outputMessage('fail', err);
    });
};

exports.run();
