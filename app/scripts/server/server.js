var config = require('../config.js').SNOOKER_CONFIG,
    io = require('socket.io').listen(config.port),
    log = require("cli-log").init({ prefix: '[SnookerLive]', prefixColor: 'cyan', prefixBgColor: 'bgCyan' }),
    STORAGE = {};

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
    io.sockets.in('server').emit('movePlayer', {playerId: data.playerId, xy: data.xy});
  });

  socket.on('disconnect', function () {
    io.sockets.in('server').emit('disconnectPlayer', {playerId: socket.id});

    log.warn('User disconnected with ID: ' + socket.id);
  });
};

SnookerLiveServer.prototype.setupUser = function (socket, data) {
  var instance = this;

  if (data.type == 'server') {
    socket.join('server');

    log.info("New server window started with ID: " + socket.id);
  }
  else {
    socket.join('user');

    io.sockets.in('server').emit('createPlayer', {id: socket.id});

    log.info("New user connected in user's channel width ID: " + socket.id);
  }

  socket.emit('welcome', {status: true, id: socket.id});
};

new SnookerLiveServer(config);