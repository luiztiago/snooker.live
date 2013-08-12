(function (window, socket) {
  var SnookerLiveServerClient = function (socket) {
    this.socket = socket;

    this.connect();
  };

  SnookerLiveServerClient.prototype.connect = function () {
    var instance = this;

    socket.emit('whoami', {type: 'server'});
    socket.on('welcome', function (data) {
      if (data.status) {
        instance.handlers();
      }
    });
  };

  SnookerLiveServerClient.prototype.handlers = function () {
    var instance = this;
  };

  new SnookerLiveServerClient(socket);
})(window, socket);