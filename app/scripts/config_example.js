 (function(global) {
  var CONFIG = {
    address: '//192.168.0.33:4000',
    autoStart: true,
    minPlayers: 5,
    port: 4000,
    timers: {
      startup: 5000,
      question: 20,
      newGame: 30000
    },

    messages: {
      welcome_message: 'Waiting to start..'
    },

    questions: [
      {
        question: 'Who is the boss?',
        answer: 0,
        opts: [
          'Djalma',
          'Magal',
          'Lucas',
          'Lulinha',
          'Romero'
        ]
      },
      {
        question: 'Quem descobriu o brazil? Pedro alvares ca..',
        answer: 0,
        opts: [
          'Brau',
          'Briu',
          'Brou',
          'Bruu',
          'bral'
        ]
      },
      {
        question: 'Quem foi joão do pulo?',
        answer: 2,
        opts: [
          'Cara legal',
          'Tenista',
          'Corredor',
          'Pulador',
          'Palhaço'
        ]
      }
    ]
  };

  global.SNOOKER_CONFIG = CONFIG;
})(typeof global === "undefined" ? window : exports);