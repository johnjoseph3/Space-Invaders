/*jshint esversion: 6 */

import {moveUserShip, updateBullets, moveBadGuys} from './utils.js';

const gameArea = {
	canvas: document.createElement('canvas'),
	init: function(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.context = this.canvas.getContext('2d');
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	updateGameArea: function (userShip, badGuys, destroyedBadGuyBullets) {
		gameArea.clear();
		moveUserShip(userShip);
		updateBullets(userShip.bullets, userShip);
		moveBadGuys(badGuys);
		updateBullets(destroyedBadGuyBullets);
		userShip.destroyIfHitByBullet(destroyedBadGuyBullets);
		badGuys.forEach(function(badGuy, index) {
			updateBullets(badGuy.bullets, badGuy);
			badGuy.destroyIfHitByBullet(userShip.bullets, badGuys, index);
			userShip.destroyIfHitByBullet(badGuy.bullets);
		});
	}
};

export {gameArea};
