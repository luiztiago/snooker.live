(function (window, $) {
  var SnookerLiveServerClient = function () {
    this.bootstrap();
  };

  SnookerLiveServerClient.prototype.bootstrap = function () {
    this.setDOMItems();
    this.checkForStart();
  };

  SnookerLiveServerClient.prototype.checkForStart = function () {
    if (SNOOKER_CONFIG.autoStart) {
      this.connect();
    }
    else {
      this.statusMessage.html(SNOOKER_CONFIG.messages.welcome_message);

      setTimeout(function () {
        window.location.href = '';
      }, SNOOKER_CONFIG.timers.startup);
    }
  };

  SnookerLiveServerClient.prototype.setDOMItems = function () {
    this.container = $("#container");
    this.ranking = $("#ranking");
    this.snooker = $("#snooker");
    this.statusMessage = $(".status-message");
  };

  SnookerLiveServerClient.prototype.connect = function () {
    var instance = this;

    this.socket = io.connect(SNOOKER_CONFIG.address);

    instance.socket.emit('whoami', {type: 'server'});

    instance.socket.on('welcome', function (data) {
      if (data.status) {
        instance.handlers();
        instance.prepareStage();
      }
    });
  };

  SnookerLiveServerClient.prototype.handlers = function () {
    var instance = this;

    instance.socket.on('createPlayer', function (data) {
      instance.createPlayer(data);
    });

    instance.socket.on('movePlayer', function (data) {
      instance.movePlayer(data.playerId, data.xy);
    });

    instance.socket.on('disconnectPlayer', function (data) {
      instance.disconnectPlayer(data.playerId);
    });
  };

  SnookerLiveServerClient.prototype.prepareStage = function () {
    var instance = this;

    instance.container.removeClass('disabled');
    instance.statusMessage.hide();
  };

  SnookerLiveServerClient.prototype.createPlayer = function(data) {
    var instance = this,
        userTemplate = Handlebars.compile($('#tpl-player').html());

    instance.snooker.append(userTemplate({
      id: data.id
    }));
  };

  SnookerLiveServerClient.prototype.movePlayer = function (playerId, xy) {
    var instance = this;

    $('#player-' + playerId).animate({
      left: xy[0],
      top: xy[1]
    }, 300, 'ease-out');
  };

  SnookerLiveServerClient.prototype.disconnectPlayer = function (playerId) {
    var instance = this;
    console.log('bye' + playerId, $('#player-' + playerId));

    $('#player-' + playerId).remove();
  };

  new SnookerLiveServerClient();
})(window, Zepto);