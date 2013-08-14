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

			this.waitDialog('show');
		},
		deviceOrientationHandler: function(e){
			beta = Math.round(e.beta);
			gamma = Math.round(e.gamma);

			oldPosX = parseInt(document.querySelector('.ball').style.marginLeft.replace('px',''), 10) || 0;
			oldPosY = parseInt(document.querySelector('.ball').style.marginTop.replace('px',''), 10) || 0;

			posX = (gamma * factorX) + oldPosX;
			posY = (beta * factorY) + oldPosY;

			posX = (posX >= (screenWidth - ballSize)) ? screenWidth - ballSize : posX;
			posX = (posX <= -(screenWidth - ballSize)) ? -(screenWidth) : posX;

			posY = (posY >= (screenHeight - ballSize)) ? screenHeight - ballSize : posY;
			posY = (posY <= -(screenHeight - ballSize)) ? -(screenHeight) : posY;

			document.querySelector('.ball').style.marginLeft = parseInt(posX, 10) + "px";
			document.querySelector('.ball').style.marginTop = parseInt(posY, 10) + "px";

		},
		waitDialog: function(type){
			if(type == 'show') {
				document.querySelector('.wait').style.display = 'block';
				document.querySelector('.ball').style.visibility = 'hidden';
			} else {
				document.querySelector('.wait').style.display = 'none';
				document.querySelector('.ball').style.visibility = 'visible';
			}
		}
	};
})();

Snooker.setup();