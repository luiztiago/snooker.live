(function (window, $) {
  var SnookerLiveServerClient = function () {
    this.setDOMItems();
    this.connect();
  };

  SnookerLiveServerClient.prototype.setDOMItems = function () {
    this.container = $("#container");
    this.ranking = $("#ranking");
    this.snooker = $("#snooker");
    this.timerArea = $('#timer-area');
    this.statusMessage = $(".status-message");
  };

  SnookerLiveServerClient.prototype.connect = function () {
    var instance = this;

    this.socket = io.connect(SNOOKER_CONFIG.address);

    instance.socket.emit('whoami', {type: 'server'});

    instance.socket.on('welcome', function (data) {
      if (data.status) {
        instance.handlers();
        instance.updateRanking();
      }
    });
  };

  SnookerLiveServerClient.prototype.handlers = function () {
    var instance = this;

    instance.socket.on('createPlayer', function (data) {
      instance.createPlayer(data);
    });

    instance.socket.on('movePlayer', function (data) {
      if (!$('#player-' + data.playerId).length) {
        instance.createPlayer(data);
      }

      instance.movePlayer(data);
    });

    instance.socket.on('disconnectPlayer', function (data) {
      instance.disconnectPlayer(data.playerId);
    });

    instance.socket.on('newQuestion', function (data) {
      instance.newQuestion(data);
    });

    instance.socket.on('timeout', function () {
      instance.onTimeout();
    });
  };

  SnookerLiveServerClient.prototype.onTimeout = function (data) {
    var instance = this;

    instance.timerArea.text('Resposta correta: ' + instance.question.opts[instance.question.answer]);
    instance.timerArea.show();

    $('.hole.one', '.hole.two', '.hole.three', '.hole.four').html('');

    instance.updateRanking();
  };

  SnookerLiveServerClient.prototype.newQuestion = function (data) {
    var instance = this;
    var q = data.question;

    instance.question = q;

    instance.timerArea.text(q.question);
    instance.timerArea.show();

    $('.hole.one').html(q.opts[0]);
    $('.hole.two').html(q.opts[1]);
    $('.hole.three').html(q.opts[2]);
    $('.hole.four').html(q.opts[3]);

    $('.player').css({top: '50%', left: '50%'});
  };

  SnookerLiveServerClient.prototype.createPlayer = function(data) {
    var instance = this,
        userTemplate = Handlebars.compile($('#tpl-player').html());

    instance.snooker.append(userTemplate({
      id: data.playerId
    }));

    instance.updateRanking();
    instance.movePlayer({playerId: data.playerId, xy: [45 - (Math.random() + (Math.random() * 8)) + '%', (Math.random() + (Math.random() * 10)) + 44 + '%']})
  };

  SnookerLiveServerClient.prototype.updateRanking = function (data) {
    var instance = this;

    instance.socket.emit('updateRanking');

    instance.socket.on('updateRanking', function (data) {
      var items = '';

      $.each(data, function (index, item) {
        items += '<li>' + index + '</li>';
      });

      instance.ranking.find('ul').html(items);
    });
  };

  SnookerLiveServerClient.prototype.movePlayer = function (data) {
    var instance = this;

    $('#player-' + data.playerId).css({
      left: data.xy[0],
      top: data.xy[1]
    })
  };

  SnookerLiveServerClient.prototype.disconnectPlayer = function (playerId) {
    var instance = this;

    $('#player-' + playerId).remove();

    instance.updateRanking();
  };

  SnookerLiveServerClient.prototype.start = function () {
    this.socket.emit('serverStart');
  };

  SnookerLiveServerClient.prototype.timeout = function () {
    this.socket.emit('serverTimeout');
  };

  window.SnookerLiveServerClient = new SnookerLiveServerClient();
})(window, Zepto);