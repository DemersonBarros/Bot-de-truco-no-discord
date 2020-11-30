exports.createMatch = function (matches, game, challenger, opponent) {
  matches[challenger] = game;
  matches[opponent] = game;
};

exports.deleteMatch = function (matches, challenger, opponent) {
  delete matches[challenger];
  delete matches[opponent];
};

exports.findMatch = function (matches, playerName) {
  return matches[playerName];
};
