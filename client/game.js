/*jshint esversion: 6 */

import {UserShip} from './user-ship.js';
import {gameArea} from './game-area.js';
import {generateBadGuys} from './generate-bad-guys.js';
import $ from 'jquery';
let userShip, badGuys, gameUpdateInterval;
let gameIsRunning = false;
let destroyedBadGuyBullets = [];
let userLives = 3;

$(document).on('keydown', function (e) {
	e.preventDefault();
	gameArea.key = e.keyCode;
	if(e.keyCode === 32) {
		userShip.fireBullet();
	}
});
$(document).on('keyup', function (e) {
	e.preventDefault();
	gameArea.key = false;
});

$(document).on('badGuyDestroyed',function(e, data){
	badGuys = data.badGuys;
	if (badGuys.length) {
		for(let bullet of data.destroyedBadGuy.bullets) {
			destroyedBadGuyBullets.push(bullet);
		}
	} else {
		alert('You win!');
		restartGame();
	}
	clearInterval(data.destroyedBadGuy.fireIntervalId);
});

$(document).on('userShipHit',function(e, data){
	$('.user-lives').text(data.userLives);
});

$(document).on('userShipDestroyed',function(e){
	alert('You lose!');
	restartGame();
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

function drawGameArea() {
	$('.user-lives').text(userLives);
	gameArea.init(900, 200);
	userShip = new UserShip(30, 30,
		gameArea.canvas.width/2 - 15,
		gameArea.canvas.height - 30,
		gameArea,
		userLives
	);
	badGuys = generateBadGuys(gameArea);
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
		gameArea.updateGameArea(userShip, badGuys, destroyedBadGuyBullets);
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
