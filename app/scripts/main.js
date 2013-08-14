var Snooker = (function(){
	'use_strict'
	var /*
		 * Settings
		 */
		maxBeta = 180,
		maxGamma = 90,
		ballSize = 50,
		factorX,
		factorY,
		alpha,
		beta,
		gamma,
		posX,
		poxY,
		oldPosX,
		oldPosY,
		screenWidth,
		screenHeight;

	return {
		setup: function(){
			if (window.DeviceOrientationEvent) {
				window.addEventListener('deviceorientation', this.deviceOrientationHandler);
			} else {
				alert("DeviceOrientation not supported");
			}
			screenWidth = document.documentElement.clientWidth / 2;
			screenHeight = document.documentElement.clientHeight / 2;

			factorX = parseInt(screenWidth * 2 / maxBeta, 10);
			factorY = parseInt(screenHeight * 2 / maxBeta, 10);
		},
		deviceOrientationHandler: function(e){
			beta = Math.round(e.beta);
			gamma = Math.round(e.gamma);

			oldPosX = parseInt(document.getElementsByClassName('ball')[0].style.marginLeft.replace('px',''), 10) || 0;
			oldPosY = parseInt(document.getElementsByClassName('ball')[0].style.marginTop.replace('px',''), 10) || 0;

			posX = (gamma * factorX) + oldPosX;
			posY = (beta * factorY) + oldPosY;

			posX = (posX >= (screenWidth - ballSize)) ? screenWidth - ballSize : posX;
			posX = (posX <= -(screenWidth - ballSize)) ? -(screenWidth) : posX;

			posY = (posY >= (screenHeight - ballSize)) ? screenHeight - ballSize : posY;
			posY = (posY <= -(screenHeight - ballSize)) ? -(screenHeight) : posY;

			document.getElementsByClassName('ball')[0].style.marginLeft = parseInt(posX, 10) + "px";
			document.getElementsByClassName('ball')[0].style.marginTop = parseInt(posY, 10) + "px";

		},
		waitDialog: function(type){
			if(type == 'show') {
				document.querySelector('.wait').style.display = 'block';
			} else {
				document.querySelector('.wait').style.display = 'none';
			}
		}
	};
})();

Snooker.setup();