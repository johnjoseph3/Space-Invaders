import {gameArea} from './game-area.js';

function moveUserShip (userShip) {
	if (gameArea.key) {
		if (gameArea.key == 37) {userShip.speedX = -2; userShip.direction = "left";}
		if (gameArea.key == 39) {userShip.speedX = 2; userShip.direction = "right";}
		userShip.stopIfAtEdgeOfCanvas();
	}
	else {
		userShip.stopMove();
	}
	userShip.newPosition();
	userShip.update();
}

function moveBullet(bullet) {
	bullet.newPosition();
	bullet.update();
}

function removeBullet(userShip, index) {
	userShip.bullets.splice(index, 1);
}

function updateBullets (bullets, ship) {
	if (bullets.length){
		bullets.forEach(function(bullet, index){
			moveBullet(bullet);
			if(ship) {
				if(bullet.y < 1) {
					removeBullet(ship, index);
				}
			}
		});
	}
}

function updateExplosionAnimations(explosionAnimations) {
	explosionAnimations.forEach(function(animation, index) {
		if(animation.updateCyclesCompleted <= animation.numberOfUpdateCyclesBeforeRemoval) {
			animation.update();
		}
	});
}

function moveBadGuys (badGuys) {
	badGuys.forEach(function(badGuy, index) {
		badGuy.changeDirectionsIfAtEdgeOfCanvas(badGuys.length, index);
		badGuy.newPosition();
		badGuy.update();
	});
}

export {moveUserShip, updateBullets, moveBadGuys, updateExplosionAnimations};
