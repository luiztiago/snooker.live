(function (window, $) {
  var SnookerLiveClient = function () {
    this.bootstrap();
  };

  SnookerLiveClient.prototype.bootstrap = function () {
    this.checkForStart();
  };

  SnookerLiveClient.prototype.checkForStart = function () {
    if (SNOOKER_CONFIG.autoStart) {
      this.connect();
    }
    else {
      setTimeout(function () {
        window.location.href = '';
      }, SNOOKER_CONFIG.timers.startup);
    }
  };

  SnookerLiveClient.prototype.connect = function () {
    var instance = this;

    instance.socket = io.connect(SNOOKER_CONFIG.address);

    instance.socket.emit('whoami', {type: 'user'});

    instance.socket.on('welcome', function (data) {
      instance.id = data.id;

      setInterval(function () {
        x = Math.floor(Math.random()*99) + '%';
        y = Math.floor(Math.random()*99) + '%';

        console.log('Moving....', x, y, instance.id);
        instance.socket.emit('movePlayer', {playerId: instance.id, xy: [x,y]})
      }, 2000);

      $('#output').text('User: ' + data.id);
    });
  };

  new SnookerLiveClient();
})(window, Zepto);