// subhojits
// width and height of the board

width = 9;
height = 9;

var hasWon = false;
var currentPlayerTurn = 0;

// drawing the board first
var board = [];

//two players
var Players = [{
	name: "P1",
	position: 0,
	color: "#FFD700"
}, {
	name: "P2",
	position: 0,
	color: "#A52A2A"
}];

var position = 0;
var darkBox = false;

// initializing the ladder
var ladders = [{
	start: 3,
	end: 27,
}, {
	start: 37,
	end: 7
}, {
	start: 21,
	end: 51
}, {
	start: 68,
	end: 31
}, {
	start: 25,
	end: 92
}, {
	start: 89,
	end: 48
}];

// handling click of the roll dice button
window.handleRollDice = () => {
	if (hasWon) {
		return;
	}

	let currentPlayer = Players[currentPlayerTurn];
	let roll = Math.floor(Math.random() * 5 + 1);
	console.log(currentPlayer.name +", You rolled", roll); //keeping track of rolls
  	//incrementing the position after the roll using the dice value
	if(currentPlayer.position === 0 && roll != 1){ //the first turn has to have 1
	  	currentPlayer.position = 0; //otherwise the position stays as it is
	  	console.log("Bad luck, you need to roll a 1!") //logs it that I need a one
	}else{ //else the # of roll is added to the position of the player
		currentPlayer.position += roll;
		ladders.forEach(ladder => { //looping through each ladder
		  	//if the starting of the ladder is equal to player's position
		  	if (ladder.start === currentPlayer.position) {
		    	console.log("yay!"); //print this on the screen
		    	currentPlayer.position = ladder.end; //step to the end of the ladder
		  	}
		});

		//if the curretPlayer has the last position
		if (currentPlayer.position > 99) {
		  	console.log(currentPlayer.name + " has won!");
		  	hasWon = true; //hasWon is true = player wins
		}

		//if it is any other position
		if (currentPlayer.position === position) {
			diff = currentPlayer.position - position;
			currentPlayerPosition = position - diff;
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
	board.forEach(row => {
		row.forEach(square => {
			boardOnScreen += `<div class=square style="top:${square.j * takeSize}px; 
			left:${square.i * takeSize}px; background-color:${square.color}"></div>`;
		});
	});

	Players.forEach(player => {
		board.forEach(row => {
			row.forEach(square => {
				if(square.position === player.position) {
					boardOnScreen += `<div class=player style="top:${square.j * takeSize + 5}px; 
					left:${square.i * takeSize + 5}px;background-color:${player.color};z-index:99"></div>`;
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

	var snakeImage = new Image();
	var ladderImage = new Image();

	snakeImage.onload = function(){
	    ctx.save();
	    ctx.globalCompositeOperation = `source-atop`;
	    ctx.drawImage(snakeImage,66, 23);
	    ctx.restore()
  	};
  	snakeImage.src = 'snake.png';
}

getBoard();