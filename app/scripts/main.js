var Snooker = (function(){
	'use_strict'
	var /*
		 * Settings
		 */
		maxBeta = 180,
		maxGamma = 90,
		alpha,
		beta,
		gamma,
		posX,
		poxY;

	return {
		setup: function(){
			if (window.DeviceOrientationEvent) {
				// Listen for the deviceorientation event and handle the raw data
				window.addEventListener('deviceorientation', this.deviceOrientationHandler);
			} else {
				alert("DeviceOrientation not supported");
			}
			this.deviceOrientationHandler({beta: 90, gamma: 50});
		},
		deviceOrientationHandler: function(e){
			console.log(e);
			alpha = Math.round(e.alpha);
			beta = Math.round(e.beta);
			gamma = Math.round(e.gamma);

			document.getElementById("a").innerHTML = alpha;
			document.getElementById("b").innerHTML = beta;
			document.getElementById("g").innerHTML = gamma;

			posX = (gamma + maxGamma) / (maxGamma * 2) * 100;
			posY = (beta + maxBeta) / (maxBeta * 2) * 100;

			posX = (posX > 100) ? 100 : posX;
			posX = (posX < 0) ? 0 : posX;
			posY = (posY > 100) ? 100 : posY;
			posY = (posY < 0) ? 0 : posY;

			document.getElementsByClassName('ball')[0].style.left = posX + "%";
			document.getElementsByClassName('ball')[0].style.top = posY + "%";
		}
	};
})();

Snooker.setup();