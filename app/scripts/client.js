var SnookerLiveClient = (function(){

	var interval,
		screenWidth = document.documentElement.clientWidth,
		screenHeight = document.documentElement.clientHeight;

	return {
		connect: function(){
			var _self = this;

			_self.interval = setInterval(function(){ _self.emitPosition() }, 2000);

			_self.socket = io.connect(SNOOKER_CONFIG.address);

			_self.socket.emit('whoami', {type: 'user'});

			_self.socket.on('welcome', function (data) {
				_self.id = data.id;
			});
		},
		emitPosition: function(){
			var _self = this;

			var x, y;

			x = parseFloat(document.querySelector('.ball').offsetLeft / screenWidth * 100).toFixed(2) + "%";
			y = parseFloat(document.querySelector('.ball').offsetTop / screenWidth * 100).toFixed(2) + "%";

			_self.socket.emit('movePlayer', { playerId: _self.id, xy: [x, y] });
		}
	}

})();

SnookerLiveClient.connect();