 var config = require('../config.js').SNOOKER_CONFIG,
    io = require('socket.io').listen(config.port),
    log = require("cli-log").init({ prefix: '[SnookerLive]', prefixColor: 'cyan', prefixBgColor: 'bgCyan' }),

    TIMER_STARTUP = null,
    TIMER_QUESTION = null,
    TOTAL_PLAYERS = 0,
    GAME_SETTINGS = {
      started: false,
      question: 0
    },
    GAME_STORAGE = {};

var SnookerLiveServer = function (config) {
  this.applyConfig()
  this.bootstrap();
};

SnookerLiveServer.prototype.applyConfig = function () {
  io.configure('production', function() {
    io.enable('browser client minification');
    io.enable('browser client etag');
    io.set('log level', 1);

    io.set('transports', [
        'websocket'
      , 'flashsocket'
      , 'htmlfile'
      , 'xhr-polling'
      , 'jsonp-polling'
    ]);
  });

  io.configure('development', function() {
    io.set('transports', ['websocket']);
  });
};

SnookerLiveServer.prototype.bootstrap = function () {
  var instance = this;

  io.sockets.on('connection', function (socket) {
    instance.handlers(socket);
  });
};

SnookerLiveServer.prototype.startGame = function () {
  var instance = this;

  var question = instance.generateQuestion();

  GAME_SETTINGS.started = true;
  GAME_SETTINGS.question = question;

  instance.newQuestion(question);

  log.success("Game Started with the question: " + question.question);
};

SnookerLiveServer.prototype.newQuestion = function (question) {
 var instance = this;

  io.sockets.in('user').emit('newQuestion', {question: question});
  io.sockets.in('server').emit('newQuestion', {question: question});
};

SnookerLiveServer.prototype.generateQuestion = function () {
  var instance = this;
  var total = config.questions.length;
  var randomQuestion = Math.floor(Math.random() * (total - 1));

  return config.questions[randomQuestion];
};

SnookerLiveServer.prototype.handlers = function (socket) {
  var instance = this;

  socket.on('whoami', function (data) {
    instance.setupUser(socket, data);
  });

  socket.on('movePlayer', function (data) {
    if (GAME_SETTINGS.started) {
      io.sockets.in('server').emit('movePlayer', data);
    }
  });

  socket.on('getAnswer', function (data) {
    var answer = data.answer;
    var player = data.playerId;

    instance.logRanking();

    if (GAME_SETTINGS.question.answer === answer) {
      GAME_STORAGE[player] += 1;
    }
  });

  socket.on('updateRanking', function () {
    instance.updateRanking();
  });

  socket.on('disconnect', function () {
    io.sockets.in('server').emit('disconnectPlayer', {playerId: socket.player_id});

    delete GAME_STORAGE[socket.player_id];

    log.warn('User disconnected with ID: ' + socket.player_id);
  });

  socket.on('serverStart', function () {
    instance.startGame();
  });

  socket.on('serverTimeout', function () {
    io.sockets.in('user').emit('timeout', {status: true});
    io.sockets.in('server').emit('timeout', {status: true});
  });
};

SnookerLiveServer.prototype.logRanking = function () {
  var instance = this;

  for (index in GAME_STORAGE) {
    log.info(index + ' - ' + GAME_STORAGE[index]);
  }
};

SnookerLiveServer.prototype.updateRanking = function () {
  var instance = this;

  io.sockets.in('server').emit('updateRanking', GAME_STORAGE);
};

SnookerLiveServer.prototype.setupUser = function (socket, data) {
  var instance = this;

  if (data.type == 'server') {
    socket.join('server');

    log.info("New server window started with ID: " + socket.id);
  }
  else {

    var PLAYER_ID = ++TOTAL_PLAYERS;

    socket.join('user');
    socket.player_id = PLAYER_ID;

    GAME_STORAGE[PLAYER_ID] = 0;

    io.sockets.in('server').emit('createPlayer', {playerId: PLAYER_ID});

    log.info("New user connected in user's channel width ID: " + PLAYER_ID);
  }

  socket.emit('welcome', {status: true, id: PLAYER_ID, settings: GAME_SETTINGS});
};

new SnookerLiveServer(config);