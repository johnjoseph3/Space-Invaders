/*jshint esversion: 6 */

import {UserShip} from './user-ship.js';
import {gameArea} from './game-area.js';
import {generateBadGuys} from './generate-bad-guys.js';
import {ExplosionAnimation} from './explosion-animation.js';
import $ from 'jquery';
let userShip, badGuys, gameUpdateInterval;
let gameIsRunning = false;
let destroyedBadGuyBullets = [];
let explosionAnimations = [];
const userLives = 3;
const canvasWidth = $(window).width() * 0.85;
let canvasHeight = 300;
let moveLeftTimeoutId;
let moveRightTimeoutId;

$(document).on('keydown', function (e) {
	e.preventDefault();
	gameArea.key = e.keyCode;
	if(e.keyCode === 32) {
		userShip.fireBullet();
	}
});

$('.move-left').on('mousedown touchstart', function (e) {
	moveLeftTimeoutId = setTimeout(function(){gameArea.key = 37;}, 20);
}).on('mouseup mouseleave touchend', function() {
	clearTimeout(moveLeftTimeoutId);
	gameArea.key = null;
});

$('.move-right').on('mousedown touchstart', function (e) {
	moveRightTimeoutId = setTimeout(function(){gameArea.key = 39;}, 20);
}).on('mouseup mouseleave touchend', function() {
	clearTimeout(moveRightTimeoutId);
	gameArea.key = null;
});

$('.fire').on('click touchstart', function (e) {
	e.preventDefault();
	userShip.fireBullet();
});

$('.restart').on('click', function (e) {
	e.preventDefault();
	restartGame();
});

$(document).on('keyup', function (e) {
	e.preventDefault();
	gameArea.key = false;
});

$(document).on('badGuyDestroyed',function(e, data){
	let destroyedBadGuy = data.destroyedBadGuy;
	explosionAnimations.push(new ExplosionAnimation(destroyedBadGuy));
	badGuys = data.badGuys;
	if (badGuys.length) {
		for(let bullet of destroyedBadGuy.bullets) {
			destroyedBadGuyBullets.push(bullet);
		}
	} else {
		pauseGame();
		$('#winLoseMessage').text("You Win!");
		$('#modal').modal('open');
	}
	clearInterval(destroyedBadGuy.fireIntervalId);
});

$(document).on('userShipHit',function(e, data){
	let userShip = data.userShip;
	explosionAnimations.push(new ExplosionAnimation(userShip));
	$('.user-lives').text(userShip.lives);
});

$(document).on('userShipDestroyed',function(e){
	pauseGame();
	$('#winLoseMessage').text("Sorry, you lost. Try again!");
	$('#modal').modal('open');
});

const $playPauseButton = $('.play-pause');

$playPauseButton.on('click', function (e) {
	if(gameIsRunning) {
		pauseGame();
		$(this).text('Play');
	} else {
		startGame();
		$(this).text('Pause');
	}
	gameIsRunning =! gameIsRunning;
});

if ($(window).height() < 400) {
	canvasHeight = $(window).height() * 0.6;
	$('button').css('display', 'inline');
	$('.lives-container').css('display', 'inline');
}

function drawGameArea() {
	$('.user-lives').text(userLives);
	gameArea.init(canvasWidth, canvasHeight);
	userShip = new UserShip(30, 30,
		gameArea.canvas.width/2 - 15,
		gameArea.canvas.height - 30,
		userLives
	);
	badGuys = generateBadGuys();
}

function setEnemyFireInterval(badGuy) {
	let fireInterval = (Math.floor(Math.random() * 10) + 1) * 1000;
	let fireIntervalId = setInterval(function() {
		badGuy.fireBullet();
	}, fireInterval);
	badGuy.fireIntervalId = fireIntervalId;
}

function startGame() {
	for(let badGuy of badGuys) {
		setEnemyFireInterval(badGuy);
	}
	gameUpdateInterval = setInterval(function() {
		gameArea.updateGameArea(userShip, badGuys, destroyedBadGuyBullets, explosionAnimations);
	}, 20);
}

function stopIntervals() {
	for(let badGuy of badGuys) {
		clearInterval(badGuy.fireIntervalId);
	}
	clearInterval(gameUpdateInterval);
}

function pauseGame() {
	stopIntervals();
}

function restartGame() {
	stopIntervals();
	gameIsRunning = false;
	$playPauseButton.text('Play');
	destroyedBadGuyBullets = [];
	drawGameArea();
	$('.user-lives').text(userLives);
	setTimeout(() => {gameArea.clear(); drawGameArea();} );
}

drawGameArea();
