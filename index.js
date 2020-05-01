// subhojits
// width and height of the board

width = 10;
height = 9;

var hasWon = false;
var currentPlayerTurn = 0;

// drawing the board first
var board = [];

var position = 0;
var darkBox = false;

//two players
var Players = [{
	id: 1,
	name: playerText_1,
	position: 0,
	color: "#00FF80"
}, {
	id: 2,
	name: playerText_2,
	position: 0,
	color: "#FFFF00"
}];

// initializing the ladder
var ladders = [{
	start: 3,
	end: 27,
}, {
	start: 74,
	end: 7
}, {
	start: 21,
	end: 62
}, {
	start: 57,
	end: 12
}, {
	start: 25,
	end: 92
}, {
	start: 89,
	end: 48
}];

// set flag to play game condition
var playGame = false;
var playerText_1 = '';
var playerText_2 = '';
var inputFieldsDiv = document.getElementById('inputFieldsDiv');
var gamePartDiv = document.getElementById('gamePartDiv');
var errorOneDiv = document.getElementById('errorOneDiv');
var errorTwoDiv = document.getElementById('errorTwoDiv');
var onSubmitPlay = document.getElementById('onSubmit_25042020');
var onSubmitPlayers = document.getElementById('onSubmit_01052020');
var playerOneId = document.getElementById('playerOneId');
var playerTwoId = document.getElementById('playerTwoId');
var playerRolled = document.getElementById('playerRolled');
var rolledText = document.getElementById('rolledText');

// add event listeners to the respective fields
playerOneId.addEventListener('change', updateInputOne);
playerTwoId.addEventListener('change', updateInputTwo);
onSubmitPlay.addEventListener('click', submitPlay);
onSubmitPlayers.addEventListener('click', submitPlayers);

function updateInputOne(e) {
	console.log(e.target.value);
	playerText_1 = '';
	if(e.target.value && e.target.value != '') {
		let pattern = /^[A-Za-z]+$/;
		errorOneDiv.innerHTML = 'Only Text is allowed!';
		if(pattern.test(e.target.value)) {
			playerText_1 = e.target.value;
			playerOneId.value = playerText_1;
			errorOneDiv.innerHTML = '';
			mapPlayer(playerText_1, 1);
			handleButtonDisabled(playerText_1, playerText_2);
		}
	}

	
}

function updateInputTwo(e) {
	console.log(e.target.value);
	playerText_2 = '';
	if(e.target.value && e.target.value != '') {
		let pattern = /^[A-Za-z]+$/;
		errorTwoDiv.innerHTML = 'Only Text is allowed!';
		if(pattern.test(e.target.value)) {
			playerText_2 = e.target.value;
			playerTwoId.value = playerText_2;
			errorTwoDiv.innerHTML = '';
			mapPlayer(playerText_2, 2);
			handleButtonDisabled(playerText_1, playerText_2);
		}
	}
}

onSubmitPlay.disabled = true;
function handleButtonDisabled(playerOne, playerTwo) {
	onSubmitPlay.disabled = true;
	if(playerOne !== '' && playerTwo !== '') {
		onSubmitPlay.disabled = false;
	}
}

function submitPlay(e) {
	// e.preventDefault();
	console.log(e.currentTarget.id);
	if(e.currentTarget.id && playerText_1 != '' && playerText_2 != '') {
		playGame = true;
	}

	letsPlayGame(playGame);
}

function submitPlayers(e) {
	if(playerText_1 != '' && playerText_2 != '') {
		onSubmitPlayers.innerHTML = "Submitted players!";
	}
}

inputFieldsDiv.style.display = "block";
gamePartDiv.style.display = "none";
function letsPlayGame(playGame) {
	if(playGame) {
		inputFieldsDiv.style.display = "none";
		gamePartDiv.style.display = "block"; 
	}
}

function mapPlayer(playerText, Id) {
	Players.map(player => {
		if(player.id === Id) {
			player.name = playerText;
		}
	});
}

// handling click of the roll dice button
window.handleRollDice = () => {
	if (hasWon) {
		return;
	}

	console.log(Players);
	rolledText.innerHTML = '';
	let currentPlayer = Players[currentPlayerTurn];
	let roll = Math.floor(Math.random() * 5 + 1);
	console.log(currentPlayer.name +", You rolled", roll); //keeping track of rolls
	playerRolled.innerHTML = `<strong style="color: ${currentPlayer.color}">${currentPlayer.name}</strong>, You rolled ${roll}`;
  	//incrementing the position after the roll using the dice value
	if(currentPlayer.position === 0 && roll != 1){ //the first turn has to have 1
	  	currentPlayer.position = 0; //otherwise the position stays as it is
	  	console.log("Bad luck, you need to roll a 1!") //logs it that I need a one
	  	rolledText.innerHTML = "Bad luck, you need to roll a 1!";
	}else{ //else the # of roll is added to the position of the player
		currentPlayer.position += roll;
		ladders.forEach(ladder => { //looping through each ladder
		  	//if the starting of the ladder is equal to player's position
		  	if (ladder.start === currentPlayer.position) {
		    	console.log("yay!"); //print this on the screen
		    	rolledText.innerHTML = "Yay! you got the ladder";
		    	if(ladder.start > ladder.end) {
		    		console.log("Bad luck!"); //print this on the screen
		    		rolledText.innerHTML = "Bad luck! you got the snake";
		    	}
		    	currentPlayer.position = ladder.end; //step to the end of the ladder
		  	}
		});

		//if the curretPlayer has the last position
		if (currentPlayer.position > 99) {
		  	console.log(currentPlayer.name + " has won!");
		  	rolledText.innerHTML = currentPlayer.name + " has won!";
		  	hasWon = true; //hasWon is true = player wins
		}

		//if it is any other position
		if (currentPlayer.position === position) {
			diff = currentPlayer.position - position;
			currentPlayerPosition = position - diff;
		}

		//if the player rolls 1
		if (currentPlayer.position === 1) {
			rolledText.innerHTML = "Yay! you rolled 1 and started the game!";
		}
	}

  	currentPlayerTurn++;
  	if (currentPlayerTurn >= Players.length) {
    	currentPlayerTurn = 0;
  	}

	getBoard();
};

// looping through the board rows to set the box sizes and color
for(var i = height; i >= 0; i--) {
	let row = [];

	board.push(row);
	for(var j = 0; j < width; j++) {
		row.push({ i,j, occupied: null, position, color: darkBox ? '#696969' : '##FF0000' });
		darkBox = !darkBox;
		position++;
	}
}

var takeSize = 55;
// drawing of the board
getBoard = () => {
	let boardOnScreen = '';
	// console.log(board);
	board.forEach((row, index) => {
		row.forEach(square => {
			boardOnScreen += `<div class=square style="top:${square.j * takeSize}px; 
			left:${square.i * takeSize}px; background-color:${square.color}; transform: rotate(-90deg) scaleX(-1); border: 1px solid #FFFFFF">${square.position}</div>`;
		});
	});

	Players.forEach(player => {
		board.forEach(row => {
			row.forEach(square => {
				if(square.position === player.position) {
					boardOnScreen += `<div class=player style="top:${square.j * takeSize + 5}px; 
					left:${square.i * takeSize + 5}px;background-color:${player.color};z-index:99; border: 1px solid #FFFFFF"></div>`;
				}
			});
		});
	})

	ladders.forEach(ladder => {
		let startPosition = { i:0, j:0 };
		let endPosition = { i:0, j:0 };

		board.forEach(row => {
			row.forEach(square => {
				if(square.position === ladder.start) {
					startPosition.i = square.i * takeSize;
					startPosition.j = square.j * takeSize;
				}

				if(square.position === ladder.end) {
					endPosition.i = square.i * takeSize;
					endPosition.j = square.j * takeSize;
				}
			});
		});

		isLadder = ladder.end > ladder.start;

	    //if it is a ladder then it is black, otherwise snake is green
	    getLines({ color: isLadder ? "#000000" : "#008000", startPosition, endPosition });
	});

	//get everything on the page
	document.getElementById("board_1021").innerHTML = boardOnScreen;
}

// drawing the lines
function getLines({ color, startPosition, endPosition }) {
	var canvas = document.getElementById("getCanvas");
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(startPosition.i + 35, startPosition.j + 20);
	ctx.lineTo(endPosition.i + 25, endPosition.j + 25);
	ctx.lineWidth = 15;
	ctx.strokeStyle = color;
	ctx.stroke();

	/*var snakeImage = new Image();
	var ladderImage = new Image();

	snakeImage.onload = function(){
	    ctx.save();
	    ctx.globalCompositeOperation = `source-atop`;
	    ctx.drawImage(snakeImage,66, 23);
	    ctx.restore()
  	};
  	snakeImage.src = 'snake.png';*/
}

getBoard();