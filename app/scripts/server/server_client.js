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
      this.socket = io.connect(SNOOKER_CONFIG.address);
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

    socket.emit('whoami', {type: 'server'});

    socket.on('welcome', function (data) {
      if (data.status) {
        instance.handlers();
        instance.prepareStage();
      }
    });
  };

  SnookerLiveServerClient.prototype.handlers = function () {
    var instance = this;
  };

  SnookerLiveServerClient.prototype.prepareStage = function () {
    var instance = this;

    instance.container.removeClass('disabled');
    instance.statusMessage.hide();
  };

  new SnookerLiveServerClient();
})(window, Zepto);