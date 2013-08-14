 var config = require('../config.js').SNOOKER_CONFIG,
    io = require('socket.io').listen(config.port),
    log = require("cli-log").init({ prefix: '[SnookerLive]', prefixColor: 'cyan', prefixBgColor: 'bgCyan' }),
    TOTAL_PLAYERS = 0,
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

SnookerLiveServer.prototype.handlers = function (socket) {
  var instance = this;

  socket.on('whoami', function (data) {
    instance.setupUser(socket, data);
  });

  socket.on('movePlayer', function (data) {
    io.sockets.in('server').emit('movePlayer', data);
  });

  socket.on('chooseOption', function (data) {
    io.sockets.in('server').emit('chooseOption', data);
  });

  socket.on('updateRanking', function () {
    instance.updateRanking();
  });

  socket.on('disconnect', function () {
    io.sockets.in('server').emit('disconnectPlayer', {playerId: socket.player_id});

    delete GAME_STORAGE[socket.player_id];

    log.warn('User disconnected with ID: ' + socket.player_id);
  });
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

  socket.emit('welcome', {status: true, id: PLAYER_ID});
};

new SnookerLiveServer(config);