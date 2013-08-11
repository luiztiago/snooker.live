var config = require('../config.js').CONFIG,
    io = require('socket.io').listen(4000),
    log = require("cli-log").init({ prefix: '[SnookerLive]', prefixColor: 'cyan', prefixBgColor: 'bgCyan' }),
    STORAGE = {};

var SnookerLiveServer = function (config) {
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

  this.bootstrap();
};

SnookerLiveServer.prototype.bootstrap = function () {
  var instance = this;

  io.sockets.on('connection', function (socket) {
    instance.whoAreYou(socket);
    instance.handlers(socket);
  });
};

SnookerLiveServer.prototype.handlers = function (socket) {
  var instance = this;

  socket.on('whoami', function (data) {
    instance.setupUser(socket, data);
  });
};

SnookerLiveServer.prototype.whoAreYou = function (socket) {
  var instance = this;

  socket.emit('whoami', {status: true});
};

SnookerLiveServer.prototype.setupUser = function (socket, data) {
  var instance = this;

  if (data.type == 'server') {
    socket.set('live', true);
    socket.join('server');

    log.info("New server window started with ID: " + socket.id);
  }
  else if (data.type == 'user') {
    socket.set('live', true);
    socket.join('user');

    log.info("New user connected in user's channel width ID: " + socket.id);
  }
};

new SnookerLiveServer(config);