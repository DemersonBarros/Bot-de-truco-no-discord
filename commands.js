'use strict';

const Discord = require('discord.js');
const Truco = require('./Truco.js');
const { prefix } = require('./config.json');

let game;

exports.comojogar = function (msg) {
  const embed = new Discord.MessageEmbed()
    .setColor('#f5f5f5')
    .setTitle(`\`${prefix}comojogar\``)
    .setDescription(`Truco é um jogo, que originalmente é jogado por 4 jogadores, porém o bot, por enquanto, só suporta 2 jogadores.
  Cada jogador recebe uma mão com 3 cartas. Caso as cartas dos jogadores forem muito fracas, eles podem pedir \`${prefix}família\` antes de selecionar uma carta que o bot vai dar uma nova mão(máximo de três pedidos de família no início da primeiro rodada).
  Os jogadores vão disputar uma partida com 3 rodadas(melhor de 3). Para ganhar uma rodada o jogador vai ter que jogar uma carta mais forte do que a do outro jogador.
  O jogador da vez pode pedir \`${prefix}truco\` para aumentar a quantidade de pontos que o vencedor vai ganhar no final das três rodadas.
  Para ganhar o jogo, é necessário que um dos jogadores tenha mais que 12 pontos.
  Caso você não saiba qual é o baralho digite \`${prefix}baralho\` para mostrar o baralho na ordem da carta mais forte para a carta mais fraca.
  Caso você não saiba quais são as cartas que você precisa ter para poder pedir família digite \`${prefix}cartasfracas\` para mostrar quais são as cartas fracas na ordem da mais forte para a mais fraca.`);

  msg.channel.send(embed).catch(console.error);
};

exports.ajuda = function (msg) {
  const embed = new Discord.MessageEmbed()
    .setColor('#f5f5f5')
    .setTitle(`\`${prefix}ajuda\``)
    .setDescription('Mostra todos os comandos e o que eles fazem.')
    .addFields([
      {
        name: `\`${prefix}desafiar <membro>\``,
        value: 'Desafia o `<membro>` para um 1v1 de truco.',
      },
      {
        name: `\`${prefix}truco <número>\``,
        value:
          'O `<número>` pode ser 3, 6, 9 ou 12,\nCaso o `<número>` for 3 ou nenhum, você pede truco.\nCaso o `<número>` for maior que a quantidade de pontos que o round estiver valendo, você aumenta o tanto de pontos que o vencedor do round vai ganhar.',
      },
      {
        name: `\`${prefix}aceitar\``,
        value: `Aceita algum tipo de desafio, poder ser tanto \`${prefix}truco\` quanto \`${prefix}desafiar\`.`,
      },
      {
        name: `\`${prefix}negar\``,
        value: `Nega algum tipo de desafio, poder ser tanto \`${prefix}truco\` quanto \`${prefix}desafiar\`.`,
      },
      {
        name: `\`${prefix}família\``,
        value: `Caso suas cartas forem fracas, você pode pedir \`${prefix}família\` para receber uma nova mão.`,
      },
      {
        name: `\`${prefix}selecionar <indicador>\``,
        value:
          'Seleciona a carta que estiver no `<indicador>` para jogar na mesa.\n`<indicador>` é o numero que fica do lado da carta.',
      },
      {
        name: `\`${prefix}comojogar\``,
        value: 'Ensina como jogar o jogo.',
      },
      {
        name: `\`${prefix}baralho\``,
        value:
          'Mostra o baralho em ordem da carta mais forte para a mais fraca.',
      },
      {
        name: `\`${prefix}cartasfracas\``,
        value: `Mostra as cartas que você tem que ter para poder pedir \`${prefix}família\`.`,
      },
    ]);

  msg.channel.send(embed).catch(console.error);
};

exports.baralho = function (msg) {
  const embed = new Discord.MessageEmbed()
    .setColor('#f5f5f5')
    .setTitle(`\`${prefix}baralho\``)
    .addFields([
      { name: '4 de paus', value: 'A carta mais forte.' },
      {
        name: '7 de copas',
        value: 'Segunda carta mais forte.',
      },
      {
        name: 'A de espadas',
        value: 'Terceira carta mais forte.',
      },
      {
        name: '7 de ouros',
        value: 'Quarta carta mais forte.',
      },
      {
        name: 'Coringa',
        value: 'Quinta carta mais forte.',
      },
      {
        name: '3 de qualquer naipe',
        value: 'Sexta carta mais forte.',
      },
      {
        name: '2 de qualquer naipe',
        value: 'Sétima carta mais forte.',
      },
      {
        name: 'Qualquer A menos o de espadas',
        value: 'Oitava carta mais forte.',
      },
      {
        name: 'K de qualquer naipe',
        value: 'Nona carta mais forte.',
      },
      {
        name: 'Q de qualquer naipe',
        value: 'Décima carta mais forte.',
      },
      {
        name: 'J de qualquer naipe',
        value: 'Décima primeira carta mais forte.',
      },
    ]);

  msg.channel.send(embed).catch(console.error);
};

exports.cartasfracas = function (msg) {
  const embed = new Discord.MessageEmbed()
    .setColor('#f5f5f5')
    .setTitle(`\`${prefix}cartasfracas\``)
    .addFields([
      {
        name: 'Coringa',
        value: 'Quinta carta mais forte.',
      },
      {
        name: 'Qualquer A menos o de espadas',
        value: 'Oitava carta mais forte.',
      },
      {
        name: 'K de qualquer naipe',
        value: 'Nona carta mais forte.',
      },
      {
        name: 'Q de qualquer naipe',
        value: 'Décima carta mais forte.',
      },
      {
        name: 'J de qualquer naipe',
        value: 'Décima primeira carta mais forte.',
      },
    ]);

  msg.channel.send(embed).catch(console.error);
};

exports.desafiar = function (msg) {
  game = new Truco(
    msg.client,
    msg.author,
    msg.mentions.users.first(),
    msg.channel
  );
  game
    .validatePlayers()
    .then(() => {
      const embed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setDescription(
          `**${game.opponent.user}, você está sendo desafiado por ${game.challenger.user}.**`
        )
        .addFields(
          {
            name: 'Como aceitar?',
            value: `Digite \`${prefix}aceitar\``,
            inline: true,
          },
          {
            name: 'Como negar?',
            value: `Digite \`${prefix}negar\``,
            inline: true,
          }
        );
      game.channel.send(embed).catch(console.error);
      game.selfDestroyCountdown = setTimeout(() => {
        game.channel
          .send(
            `${game.opponent.user} não respondeu, então a partida não vai iniciar.`
          )
          .catch(console.error);
        game = null;
      }, 60000);
    })
    .catch((err) => {
      switch (err) {
        case 'The challenger and opponent is the same person':
          msg
            .reply(`não tem como você jogar com você mesmo`)
            .catch(console.error);
          break;
        case 'The opponent is the bot':
          msg
            .reply(
              `você não pode jogar comigo, por favor escolha um oponente válido.`
            )
            .catch(console.error);
          break;
        case 'The opponent is offline':
          msg
            .reply(`o ${game.opponent.user} está offline.`)
            .catch(console.error);
          break;
      }
      game = null;
    });
  return;
};

exports.aceitar = function (msg) {
  if (!game) return;
  if (
    game.started &&
    game.trucado &&
    !game.trucoAccepted &&
    msg.author.id === game.playerOfTheTime.user.id
  ) {
    game.trucoAccepted = true;
    game.trucado = false;
    game.channel
      .send(
        `${game.playerOfTheTime.opponent.user}, ${game.playerOfTheTime.user} aceitou o seu pedido de truco!`
      )
      .catch(console.error);
    game.channel
      .send(`Agora a partida está valendo ${game.roundValue} pontos`)
      .catch(console.error);

    game.playerOfTheTime =
      game.round % 2 !== 0 ? game.challenger : game.opponent;
    clearTimeout(game.selfDestroyCountdown);
    game.selfDestroyCountdown = setTimeout(() => {
      game.channel
        .send(
          `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
        )
        .catch(console.error);
      game = null;
    }, 60000);
    return;
  }

  if (game.started || msg.author.id !== game.opponent.user.id) {
    return;
  }

  game.start();
  clearTimeout(game.selfDestroyCountdown);
  game.selfDestroyCountdown = setTimeout(() => {
    game.channel
      .send(
        `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
      )
      .catch(console.error);
    game = null;
  }, 60000);
};

exports.negar = function (msg) {
  if (!game) return;

  if (
    game.started &&
    game.trucado &&
    !game.trucoAccepted &&
    msg.author.id === game.playerOfTheTime.user.id
  ) {
    game.channel
      .send(
        `${game.playerOfTheTime.user}, não aceitou o pedido de truco do ${game.playerOfTheTime.opponent.user}`
      )
      .catch(console.error);

    game.roundValue = game.roundValue === 3 ? 1 : game.roundValue - 3;
    clearTimeout(game.selfDestroyCountdown);
    game.selfDestroyCountdown = setTimeout(() => {
      game.channel
        .send(
          `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
        )
        .catch(console.error);
      game = null;
    }, 60000);
    game.trucoAccepted = false;
    game.trucado = false;
    game.startRound(game.playerOfTheTime.opponent);
    return;
  }

  if (game.started || msg.author.id !== game.opponent.user.id) {
    return;
  }

  game.channel
    .send(
      `${game.challenger.user}, infelizmente ${game.opponent.user} não aceitou.`
    )
    .catch(console.error);
  clearTimeout(game.selfDestroyCountdown);
  game = null;
};

exports.truco = function (msg) {
  if (
    !game ||
    !game.started ||
    game.trucoAccepted ||
    msg.author.id !== game.playerOfTheTime.user.id ||
    game.roundValue === 12
  ) {
    return;
  }

  clearTimeout(game.selfDestroyCountdown);
  game.selfDestroyCountdown = setTimeout(() => {
    game.channel
      .send(
        `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
      )
      .catch(console.error);
    game = null;
  }, 60000);

  const optionalNumber = Math.floor(msg.content.split(' ')[1]);
  const embed = new Discord.MessageEmbed().setColor('#f5f5f5').addFields(
    {
      name: 'Como aceitar?',
      value: `Digite \`${prefix}aceitar\``,
      inline: true,
    },
    {
      name: 'Como negar?',
      value: `Digite \`${prefix}negar\``,
      inline: true,
    }
  );

  if (!game.trucado && (optionalNumber === 3 || Number.isNaN(optionalNumber))) {
    game.roundValue = 3;
    game.trucado = true;
    embed.setDescription(
      `**${game.playerOfTheTime.opponent.user}, ${game.playerOfTheTime.user} está pedindo truco vai aceitar?**`
    );
    game.channel.send(embed).catch(console.error);
    game.playerOfTheTime = game.playerOfTheTime.opponent;
    return;
  }

  if (
    Number.isNaN(optionalNumber) ||
    optionalNumber % 3 !== 0 ||
    optionalNumber !== game.roundValue + 3
  ) {
    msg.reply('por favor, responda com um número válido.');
    return;
  }

  game.roundValue += 3;
  game.playerOfTheTime = game.playerOfTheTime.opponent;
  embed.setDescription(
    `${game.playerOfTheTime.user}, ${game.playerOfTheTime.opponent.user} está pedindo ${game.roundValue}, vai aceitar?`
  );
  game.channel.send(embed).catch(console.error);
};

exports.familia = function (msg) {
  if (!game || !game.started || game.turn !== 0) return;

  const player =
    msg.author.id === game.challenger.user.id ? game.challenger : game.opponent;

  if (player.selectedCard) return;

  clearTimeout(game.selfDestroyCountdown);
  game.selfDestroyCountdown = setTimeout(() => {
    game.channel
      .send(
        `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
      )
      .catch(console.error);
    game = null;
  }, 60000);

  let weakCardsQuantity = 0;

  if (game.familyQuantity < 3) {
    for (const card of player.hand) {
      if (card.value < 6 || card.value === 7) {
        weakCardsQuantity++;
      }
    }

    if (weakCardsQuantity === 3) {
      game.familyQuantity++;
      let description = '';
      player.hand.forEach((card, index) => {
        if (card.name === 'coringa') {
          description += `${index + 1}. ${card.name}\n`;
        } else {
          description += `${index + 1}. ${card.name} de ${card.pip}\n`;
        }
      });

      if (game.familyQuantity === 3) {
        description += '\n*Não pode ser feito mais nenhum pedido de família.*';
      } else {
        description += `\n*Ainda podem ser pedidas ${
          3 - game.familyQuantity
        } famílias.*`;
      }

      const embed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setTitle(`${player.user.username} discartou as cartas:`)
        .setDescription(description);

      player.hand = game.generateHand();
      game.sendHand(player);

      game.channel.send(embed);
      return;
    }

    game.channel
      .send(`${player.user}, você não pode pedir família.`)
      .catch(console.error);
  }
};

exports.família = exports.familia;

exports.selecionar = function (msg) {
  if (
    !game ||
    !game.started ||
    msg.author.id !== game.playerOfTheTime.user.id ||
    game.trucado ||
    msg.channel.type !== 'dm'
  ) {
    return;
  }

  clearTimeout(game.selfDestroyCountdown);
  game.selfDestroyCountdown = setTimeout(() => {
    game.channel
      .send(
        `${game.playerOfTheTime.user} não respondeu, então a partida está encerrada.`
      )
      .catch(console.error);
    game = null;
  }, 60000);

  const cardIndex = Math.floor(msg.content.split(' ')[1]) - 1;
  if (
    cardIndex > game.playerOfTheTime.hand.length - 1 ||
    cardIndex < 0 ||
    Number.isNaN(cardIndex)
  ) {
    game.playerOfTheTime.user
      .send('Por favor, envie uma carta válida.')
      .catch(console.error);
    return;
  }

  const card = game.playerOfTheTime.hand[cardIndex];
  game.playerOfTheTime.selectedCard = card;
  game.playerOfTheTime.hand.splice(cardIndex, 1);
  if (card.name === 'coringa') {
    game.channel
      .send(`${game.playerOfTheTime.user} enviou a carta ${card.name}!`)
      .catch(console.error);
  } else {
    game.channel
      .send(
        `${game.playerOfTheTime.user} enviou a carta ${card.name} de ${card.pip}`
      )
      .catch(console.error);
  }

  if (game.opponent.selectedCard && game.challenger.selectedCard) {
    game.startTurn();
    if (game.challenger.roundPoints > 11 || game.opponent.roundPoints > 11) {
      clearTimeout(game.selfDestroyCountdown);
      game = null;
    }
    return;
  }

  if (game.playerOfTheTime.hand.length !== 0) {
    game.sendHand(game.playerOfTheTime);
  }

  game.secondToSelectCard = game.playerOfTheTime.opponent;
  game.playerOfTheTime = game.playerOfTheTime.opponent;
  game.channel
    .send(`${game.playerOfTheTime.user} é a sua vez de jogar.`)
    .catch(console.error);
};
