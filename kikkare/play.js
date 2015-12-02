var firstPress = true;

// A custom mouseUp, 
// because apparently there's no proper handler in phaser
var mouseUp = 0;

var playState = {
	create : function() {
		// At the begin there no need anything but background

		minefield.area = game.add.group();

		// draws background
		for(var i=0; i<minefield.tiles.countX; i++) {
			for(var j=0; j<minefield.tiles.countY; j++) {
				minefield.area.create(
					i*minefield.tiles.sizeInCanvas, 
					j*minefield.tiles.sizeInCanvas, 
					"blank"
				);

			}
		}

		minefield.player = game.add.sprite(0, 0, "player");
		minefield.player.loadTexture("nolla");
		minefield.player.visible = false;

		// // gray overlay
		// minefield.filters = [game.add.filter("Gray")];
	},
	update : function() {
		if(game.input.activePointer.isDown) {
			calculatePlayerPosition();
			mouseUp = 1;
		} else if( game.input.activePointer.isUp && mouseUp === 1 ) {
			mouseUp = 0;
			minefield.player.visible = false;

			if(firstPress === true) {
				// on a first press, we must
				// initialize minefield
				firstPress = false;
				initializeMinefield(
					minefield.tiles.countX,
					minefield.tiles.countY,
					minefield.mineCount
				);

				//first 'commit' to answerArray
				//openNeighbours();
			} 

			openHatch();

			if(minefield.mineArray[minefield.position.x][minefield.position.y] === 1) {
				gameState.gameOver();
			} else {
				var count = countItemsFromArray([9,10], minefield.answerArray) - minefield.mineCount;

				if(count === 0) {
					gameState.win();
				}
			}
		} // todo: else if mouse right click pressed

		draw();	
	}
};

//----------------------------------------

// TODO: make a script which opens every blank point around chosen blank point

// this algorithm should run everytime when player hit blank
function openNeighbours() {
	var posx = minefield.position.x;
	var posy = minefield.position.y;
	var sArray  =minefield.sweeperArray;

	while(1)
	{
		checkNeighbours(posx, posy, sArray);
		break;
	}
}

/**
 * Check neighbours (up,down,left and right) and return 
 */
function checkNeighbours(x,y, checkArray) {
	return {
		"north": typeof(checkArray[x][y-1]) === "number" ? true : false,
		"east" : typeof(checkArray[x+1][y]) === "number" ? true : false,
		"south": typeof(checkArray[x][y+1]) === "number" ? true : false,
		"west" : typeof(checkArray[x-1][y]) === "number" ? true : false
	};
}


// ------ \\ ------ // ------ \\
function openAround(cordinate, round){
	// override values
	var cordinate = [0,0];
	var round = 1;
}


//-----------------------------------------
function openHatch() {
	var i = minefield.position.x;
	var j = minefield.position.y;
	minefield.answerArray[i][j] = minefield.sweeperArray[i][j];
}

/**
 * Calculate the position for player
 */
function calculatePlayerPosition() {
	// Update position
	minefield.position.x = Math.floor(game.input.x / minefield.tiles.sizeInCanvas);
	minefield.position.y = Math.floor(game.input.y / minefield.tiles.sizeInCanvas);
	minefield.player.position.x = minefield.position.x * minefield.tiles.sizeInCanvas;
	minefield.player.position.y = minefield.position.y * minefield.tiles.sizeInCanvas;
	minefield.player.visible = true;
}

/**
 * Make the minefield.mineArray as an array where 0 = no mine, and 1 = mine
 * 
 * @param width
 * @param height
 * @param amountOfMines
 */
function initializeMinefield(width, height, amountOfMines) {
	var minefieldSize = width*height;
	// create it first as one dimensional array
	minefield.mineArray = new Array(minefieldSize);

	var i; // make sure, that i will 'live on' after for -loop, (altough it should live after the loop in javascript)
	// put mines to first positions
	for(i=0; i<amountOfMines; i++) {
		minefield.mineArray[i] = 1;
	} // TODO: verify that var i is correct after the loop

	// fill the rest with zeroes
	for(var j=i; j<minefieldSize; j++) {
		minefield.mineArray[j] = 0;
	}

	// forever-loop  isn't maybe  the most elegant solution
	// but it works atleast
	while(1) {
		// shuffles the minefield.
		minefield.mineArray = shuffle(minefield.mineArray);
		
		// convert minefield to multidimensional array
		minefield.mineArray = listToMatrix(minefield.mineArray, height);

		generateSweeperArray();

		// So this loop works in a way where
		// if the current position includes a mine
		// we must shuffle again the array
		if( minefield.sweeperArray[minefield.position.x][minefield.position.y] === 0 ) break;

		//  In this point the loop hasn't broke,
		// so we have to roll back an array to one-dimensioanal
		// a.k.a. we must flatten the array
		// https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
		minefield.mineArray = [].concat.apply([], minefield.mineArray);
	}
}

/**
 * Generate minefield.sweeperArray as an 2-dimension array.
 */
function generateSweeperArray() {
	minefield.sweeperArray = new Array(minefield.tiles.countX);
	
	// the border values
	var pos = {
		min : { x : 0, y : 0 },
		max : { x : minefield.mineArray.length, y : null },
	};


	// Initialise sweeperArray
	// after the initialising sweeperArray is filled with zeroes,
	// but the points where mine is located, contains char "x".
	for(var i=0; i<pos.max.x; i++) {
		// Calculate array[i][j] border
		// When we calculate max here,
		// the area doesn't have to be regular form
		// Also I think, using pos.max.y is faster than minefield.mineArray[i].length
		// (it might recalculate it everytime?)
		pos.max.y = minefield.mineArray[i].length;

		// define sub array
		minefield.sweeperArray[i] = new Array(pos.max.y);

		for(var j=0; j<pos.max.y; j++) {
			// initialize sweeper array with zeroes
			minefield.sweeperArray[i][j] = 0;

			// check if the [i][j] position contains a mine
			if(minefield.mineArray[i][j] === 1) {
				// convert value to string
				// mines will convert to string, because when you
				// raise a value in javascript which is string,
				// it keeps as string, naturaly.
				// And if you raise an integer value in javascript,
				// it will raise as it should rise
				minefield.sweeperArray[i][j] = "x"; 
			}
		}
	}

	// now raise the neighbours
	for(var i=0; i<minefield.sweeperArray.length; i++) {
		pos.max.y = minefield.sweeperArray[i].length;

		for(var j=0; j<minefield.sweeperArray[i].length; j++)
		{
			// skip numbers
			// because the strings are mines, whose neighbours we want raise
			if( typeof(minefield.sweeperArray[i][j]) === "number" ) continue;

			var valueArray_i = [i-1, i, i+1];
			var valueArray_j = [j-1, j, j+1];

			for(var k=0; k<valueArray_i.length; k++) {
				for(var l=0; l<valueArray_j.length; l++) {
					// raise neighbour values if they exists
					if( typeof(minefield.sweeperArray[ valueArray_i[k]]) !== "undefined" &&
						typeof(minefield.sweeperArray[ valueArray_i[k] ][ valueArray_j[l] ]) !== "undefined" ) {
						minefield.sweeperArray[ valueArray_i[k] ][ valueArray_j[l] ] += 1;
					}

					/*
					// I don't know, which one would be faster
					var ik = valueArray_i[k];
					var jl = valueArray_j[l];

					if( typeof(minefield.sweeperArray[ik]) !== "undefined"
					&& typeof(minefield.sweeperArray[ik][jl] !== "undefined") {
						minefield.sweeperArray[ik][jl] += 1;
						minefield.sweeperArray[ik][jl]++; // this one causes NaN instead of String
					}
					*/
				}
			}
		}
	}
}

/**
 * Check type of variable, and return the variable itself or number 13
 * 
 * @param  variable
 * @return variable|13
 */
function getIndex(variable) {
	return typeof(variable) === "number" 
		? variable
		: 13; // tässä pitää tietää
}

/**
 * Draws the minefield (game area)
 */
function draw() {
	// first draw a minefield
	// destroy an old area
	minefield.area.destroy();
	minefield.area = game.add.group();
	// create a new one
	for(var i=0; i<minefield.tiles.countX; i++) {
		for(var j=0; j<minefield.tiles.countY; j++) {
			var name = minefield.sprites[ getIndex(minefield.answerArray[i][j]) ].name;
			minefield.area.create(
				i*minefield.tiles.sizeInCanvas, 
				j*minefield.tiles.sizeInCanvas,
				name
			);
		}
	}

	// second draw a player, if the visible is not set to false
	// we have to draw player now, because we create & draw the brackground before

	// save player's position and visibility
	var x = minefield.player.position.x;
	var y = minefield.player.position.y;
	var visible = minefield.player.visible;

	// destroy old player
	minefield.player.destroy();

	// create player again
	minefield.player = game.add.sprite(x, y, "player");
	minefield.player.loadTexture("nolla");
	minefield.player.visible = visible;
}