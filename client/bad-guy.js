import $ from 'jquery';
import {Bullet} from './bullet.js';
import {gameArea} from './game-area.js';

const badGuyImage = document.getElementById("bad-guy");
let direction = 1;

function BadGuy (width, height, x, y) {
	this.width = width;
	this.height = height;
	this.speedX = 1;
	this.x = x;
	this.y = y;
	this.type = 'bad-guy';
	let ctx = gameArea.context;
	setTimeout(() => {ctx.drawImage(badGuyImage, this.x, this.y, this.width, this.height);});
	this.newPosition = function() {
		this.x += this.speedX;
	};
	this.update = function() {
		let ctx = gameArea.context;
		ctx.drawImage(badGuyImage, this.x, this.y, this.width, this.height);
	};
	this.stopMove = function() {
		this.speedX = 0;
	};
	this.changeDirectionsIfAtEdgeOfCanvas = function(badGuysLength, index) {
		if(index === 0 && this.x < 1) {
			direction = 1;
		}
		if ((index+ 1 === badGuysLength) && (this.x + this.width >= gameArea.canvas.width)) {
			direction = -1;
		}
		this.speedX = direction;
	};
	this.bullets = [];
	this.fireBullet = function() {
		this.bullets.push(new Bullet(this));
	};
	this.destroyIfHitByBullet = function(userShipBullets, badGuys, badGuyIndex) {
		let self = this;
		userShipBullets.forEach(function(bullet, bulletIndex){
			if((bullet.x >= self.x) && (bullet.x <= self.x + width) && (bullet.y <= (self.y + self.height)) && (bullet.y >= self.y)) {
				userShipBullets.splice(bulletIndex, 1);
				badGuys.splice(badGuyIndex, 1);
				$(document).trigger('badGuyDestroyed', {badGuys: badGuys, destroyedBadGuy: self});
			}
		});
	};
}

export {BadGuy};
