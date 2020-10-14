const Truco = require('../../../Truco.js');

function pass() {
  const client = {
    user: {
      id: 0,
    },
  };
  const challenger = {
    id: 1,
  };
  const opponent = {
    id: 2,
    presence: {
      status: 'online',
    },
  };
  const truco = new Truco(client, challenger, opponent);
  console.log('Pass function running:');
  truco
    .validatePlayers()
    .then(() => {
      console.log('Success!');
    })
    .catch((err) => {
      console.log('Something went wrong!');
      console.error(err);
    });
}

function fail(condition) {
  let truco;
  let client;
  let challenger;
  let opponent;
  console.log(`Fail function running with codition ${condition}:`);
  switch (condition) {
    case 'challenger = opponent':
      client = {
        user: {
          id: 0,
        },
      };
      challenger = {
        id: 1,
      };
      opponent = {
        id: 1,
        presence: {
          status: 'online',
        },
      };
      truco = new Truco(client, challenger, opponent);
      truco
        .validatePlayers()
        .then(() => {
          console.log('Something went super wrong');
        })
        .catch((err) => {
          if (err !== 'The challenger and opponent is the same person') {
            console.log('Something went wrong');
            return;
          }
          console.log('failed successfully');
        });
      break;
    case 'opponent = bot':
      console.log(`Fail function running with codition ${condition}:`);
      client = {
        user: {
          id: 1,
        },
      };
      challenger = {
        user: {
          id: 0,
        },
      };
      opponent = {
        id: 1,
        presence: {
          status: 'online',
        },
      };
      truco = new Truco(client, challenger, opponent);
      truco
        .validatePlayers()
        .then(() => {
          console.log('Something went super wrong');
        })
        .catch((err) => {
          if (err !== 'The opponent is the bot') {
            console.log('Something went wrong');
            return;
          }
          console.log('failed successfully');
        });
      break;
    case 'opponent is offline':
      console.log(`Fail function running with codition ${condition}:`);
      client = {
        user: {
          id: 0,
        },
      };
      challenger = {
        id: 1,
      };
      opponent = {
        id: 2,
        presence: {
          status: 'offline',
        },
      };
      truco = new Truco(client, challenger, opponent);
      truco
        .validatePlayers()
        .then(() => {
          console.log('Something went super wrong');
        })
        .catch((err) => {
          if (err !== 'The opponent is offline') {
            console.log('Something went wrong');
            return;
          }
          console.log('failed successfully');
        });
      break;
  }
}

pass();
setTimeout(() => {
  fail('challenger = opponent');
}, 0);
setTimeout(() => {
  fail('opponent = bot');
}, 0);
setTimeout(() => {
  fail('opponent is offline');
}, 0);
