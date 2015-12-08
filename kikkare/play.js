var toolbox = { button:[] };
var firstPress = true;

var MOUSE_UP = 0;
var MOUSE_OVER = -1;  
var SELECTED_BUTTON = 0;

// Because there are custom, a constantly 'changing backgound', 
// a custom drag and drop handler must be made
var dnd = {
	name: [],
	button_id: [],
	sprite: []
};

var dynamicFunctions = [];
var playState = {
	// preload: function() { game.stage.backgroundColor = 0xffffff; },
	create : function() {
		// Initialises dnd object
		dnd.name = ["nolla", "lippu", "kyssari"];
		dnd.button_id = [BUTTON.BLANK, BUTTON.FLAG, BUTTON.QUESTION];

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

		// x is same for every dndn item
		var halfSizeTile = minefield.tiles.sizeInCanvas / 2;
		var x = minefield.tiles.totalWidth + halfSizeTile;

		// draw 'selected item'
		minefield.selected = game.add.sprite(x,halfSizeTile, "nolla");

		// Two times because we 'skip' first two spaces
		var y_start_point = 2*minefield.tiles.sizeInCanvas;

		for(var i=0; i<dnd.name.length; i++) {
			var y = minefield.tiles.sizeInCanvas*i + halfSizeTile + y_start_point;

			var button = null;
			button = game.add.button(x, y, dnd.name[i], selectButton, button);

			// set buttons's properties
			button.button_id = dnd.button_id[i];
			button.button_name = dnd.name[i];
			button.button_x = x;
			button.button_y = halfSizeTile;

			// Enable the hand cursor
			button.input.useHandCursor = true;

			toolbox.button.push(button);
		}

		minefield.player = game.add.sprite(0, 0, "player");
		minefield.player.loadTexture("nolla");
		minefield.player.visible = false;

		// // gray overlay
		// minefield.filters = [game.add.filter("Gray")];
	},
	update : function() {
		checkDragAndDropItems();		

		if(game.input.activePointer.isDown) {
			calculatePlayer();
			MOUSE_UP = 1;
		} else if(	game.input.activePointer.isUp && MOUSE_UP === 1 ) {
			MOUSE_UP = 0;

			// It was clicked inside game area
			minefield.player.visible = false;

			//  first check if the player's position is out of the game area
			if (	minefield.position.x >= minefield.tiles.countX
			||	minefield.position.y >= minefield.tiles.countY ) {
				// if it's clicked in here, check if it was clicked to toolbar button
				// console.log("MOUSE_UP on toolbar area");
			} else if( SELECTED_BUTTON === BUTTON.FLAG ) {
				// { name : "lippu",   location : "assets/game/flag.png" },       // 10
				minefield.answerArray[minefield.position.x][minefield.position.y] = BUTTON.FLAG;
			} else if( SELECTED_BUTTON === BUTTON.QUESTION ) {
				// { name : "kyssari", location : "assets/game/wat.png" },        // 11
				minefield.answerArray[minefield.position.x][minefield.position.y] = BUTTON.QUESTION;
			} else if( SELECTED_BUTTON === BUTTON.BLANK ) {

				if(firstPress === true) {
					// on a first press, we must
					// initialize minefield
					firstPress = false;
					initializeMinefield(
						minefield.tiles.countX,
						minefield.tiles.countY,
						minefield.mineCount
					);
				} 

				openHatch(	minefield.position.x, minefield.position.y );

				if(minefield.mineArray[minefield.position.x][minefield.position.y] === 1) {
					gameState.gameOver();
				} else {
					var count = countItemsFromArray([9,10], minefield.answerArray) - minefield.mineCount;

					if(count === 0) {
						gameState.win();
					}
				}
			}
		} // todo: else if mouse right click pressed

		draw();	
	}
};

/**
 * Opens the 'hatch' in selected position on minefield.answerArray. 
 * If the opened 'hatch' is blank, opens positions around it. Uses recursion.
 *
 * @param int x - the x-coordinate in minefield.answerArray
 * @param int y - the y-coordinate in minefield.answerArray
 */
function openHatch(x, y) {
	// Check only if the location is unpressed
	// (Otherwise been there, done that.)
	if( typeof(minefield.answerArray[x])    !== "undefined"
	&&  typeof(minefield.answerArray[x][y]) !== "undefined"
	&&	minefield.answerArray[x][y] === BUTTON.UNPRESSED ) {
		minefield.answerArray[x][y] = minefield.sweeperArray[x][y];

		if( typeof(minefield.sweeperArray[x])    !== "undefined"
		&&  typeof(minefield.sweeperArray[x][y]) !== "undefined"
		&&  minefield.sweeperArray[x][y] === BUTTON.BLANK ) {
			var x_array = [x-1,x,x+1];
			var y_array = [y-1,y,y+1];

			for(var i=0; i<x_array.length; i++) {
				for(var j=0; j<y_array.length; j++) {
					openHatch( x_array[i],y_array[j] );
				}
			}
		}
	}
}

/**
 * Calculate the position for player
 */
function calculatePlayer() {
	// Update position
	minefield.position.x = Math.floor(game.input.x / minefield.tiles.sizeInCanvas);
	minefield.position.y = Math.floor(game.input.y / minefield.tiles.sizeInCanvas);
	minefield.player.position.x = minefield.position.x * minefield.tiles.sizeInCanvas;
	minefield.player.position.y = minefield.position.y * minefield.tiles.sizeInCanvas;
	minefield.player.visible = true;
}

/**
 * Calculate if game.input.(x|y) is on toolbox button,
 */
function checkDragAndDropItems() {
	// must calculate constantly
	var counter = 0;

	for(var i=0; i<dnd.sprite.length; i++) {
		if(	game.input.x > dnd.sprite[i].x.start 
		&&	game.input.x < dnd.sprite[i].x.end
		&&	game.input.y > dnd.sprite[i].y.start
		&&	game.input.y > dnd.sprite[i].y.end ) {
			// mouse is over on that sprite
			MOUSE_OVER = i;
			MOUSE_OVER_CHANGED = true;
			// because mouse can be over only on one button
			break; // i = i=dnd.sprite.length;
		} else {
			counter++;
		}
	}

	if( counter === dnd.sprite.length ) {
		MOUSE_OVER = -1;
	}
}

/**
 * Make the minefield.mineArray as an array where 0 = no mine, and 1 = mine
 * TODO: Move this inside minefield ( ? )
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
 * Check type of variable, and return the variable itself or BUTTON.REDMINE
 * 
 * @param  variable
 * @return variable|BUTTON.REDMINE
 */
function getIndex(variable) {
	return typeof(variable) === "number" 
		? variable
		: BUTTON.REDMINE
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

	// then draw a player, if the visible is not set to false
	// we have to draw player now, because we create & draw the brackground before

	// save player's position and visibility
	var x = minefield.player.position.x;
	var y = minefield.player.position.y;
	var visible = minefield.player.visible;

	// destroy old player
	minefield.player.destroy();

	// create player again
	minefield.player = game.add.sprite(x, y, "player");

	switch ( SELECTED_BUTTON ) {
		case BUTTON.FLAG: minefield.player.loadTexture("lippu"); break;
		case BUTTON.QUESTION: minefield.player.loadTexture("kyssari"); break;
		default:  minefield.player.loadTexture("nolla"); break; // case BUTTON.BLANK
	}

	minefield.player.visible = visible;
}

function over() {

}

/**
 * An object-like function which change player.
 * 
 * Mandatory public properties:
 *   int    button_id   - A selected button's id
 *   string button_name - A selected button's name
 *   int    button_x    - A selected button's x
 *   int    button_y    - A selected button's y
 */
function selectButton() {
	// changed selected button to correct one.
	SELECTED_BUTTON = this.button_id;

	// destroy old sprite
	minefield.selected.destroy();

	// create sprite again
	minefield.selected = game.add.sprite(this.button_x, this.button_y, this.button_name);
}
