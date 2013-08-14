var SnookerLiveClient = (function(){

	var interval,
		screenWidth = document.documentElement.clientWidth,
		screenHeight = document.documentElement.clientHeight;

	return {
		connect: function(){
			var _self = this;

			_self.socket = io.connect(SNOOKER_CONFIG.address);

			_self.socket.emit('whoami', {type: 'user'});

			_self.socket.on('welcome', function (data) {
				_self.id = data.id;
				document.querySelector('#id').innerHTML = _self.id;
			});

			_self.socket.on('newQuestion', function (data) {
				Snooker.waitDialog('hidden');
				_self.interval = setInterval(function(){ _self.emitPosition() }, 2000);
			});

			_self.socket.on('timeout', function (data) {
				clearInterval(_self.interval);
				_self.emitQuestion();
				Snooker.waitDialog('show');
			});

			// document.querySelector('#width').innerHTML = screenWidth;
			// document.querySelector('#height').innerHTML = screenHeight;
		},
		getXY: function(){

			var _self = this;

			var x, y;

			x = parseFloat(document.querySelector('.ball').offsetLeft / screenWidth * 100).toFixed(2);
			y = parseFloat(document.querySelector('.ball').offsetTop / screenHeight * 100).toFixed(2);

			// document.querySelector('#posX').innerHTML = x;
			// document.querySelector('#posY').innerHTML = y;

			return {x: x, y: y}
		},
		emitPosition: function(){
			var _self = this,
				xy = _self.getXY();

			_self.socket.emit('movePlayer', { playerId: _self.id, xy: [xy.x + "%", xy.y + "%"] });
		},
		emitQuestion: function(){
			var _self = this,
				xy = _self.getXY(),
				answer;

			if(xy.x <= 5 && xy.y <= 5) {
				answer = 0
			}else if(xy.x >= 80 && xy.y <= 5) {
				answer = 1
			}else if(xy.x <= 5 && xy.y >= 80) {
				answer = 2
			}else if(xy.x >= 80 && xy.y >= 80) {
				answer = 3
			}else{
				answer = null;
			}

			// document.querySelector('#answer').innerHTML = answer;

			_self.socket.emit('getAnswer', { playerId: _self.id, answer: answer });
		}
	}

})();

SnookerLiveClient.connect();