var minefield = {
	tiles : {
		countX : 9,
		countY : 9,
		sizeInCanvas : 16,
		totalWidth : null,
		totalHeight: null
	},
	mineCount : 10,
	mineArray : null, // We will initialize this later
	sweeperArray : null,
	position : { x : null, y : null },
	realPosition : { x : null, y : null}
};

minefield.tiles.totalWidth = minefield.tiles.countX * minefield.tiles.sizeInCanvas;
minefield.tiles.totalHeight = minefield.tiles.countY * minefield.tiles.sizeInCanvas

var game = new Phaser.Game(
	minefield.tiles.totalWidth,
	minefield.tiles.totalHeight,
	Phaser.AUTO,
	null, {
		preload: preload,
		create: create,
		update: update
});

var firstPress = true;
var player;
// A custom mouseUp, 
// because apparently there's no proper handler in phaser
var mouseUp = 0; 

function preload() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.state.backgroundColor = "#009933";

	// load all images
	game.load.image("blank",  "img/unpressed.png");
	game.load.image("nolla",  "img/0.png");
	/*game.load.image("eka",    "img/1.png");
	game.load.image("toka",   "img/2.png");
	game.load.image("kolmas", "img/3.png");
	game.load.image("neljas", "img/4.png");
	game.load.image("viides", "img/5.png");
	game.load.image("kuudes", "img/6.png");
	game.load.image("seiska", "img/7.png");
	game.load.image("kasi",   "img/8.png");
	game.load.image("ysi",    "img/9.png");
	game.load.image("tonni",  "img/burana1000.png");
	game.load.image("caps",   "img/buranaCaps.png");
	game.load.image("lippu",  "img/flag.png");
	game.load.image("kyssari","img/wat.png");*/
}

function create() {
	// At the begin there no need anything but background
	drawBackground();
}

function update () {
	drawBackground();

	if(game.input.activePointer.isDown) {
		preCheckAnimation();
		mouseUp = 1;
	} else if( game.input.activePointer.isUp && mouseUp === 1 ) {
		mouseUp = 0;

		if(firstPress === true) {
			// on a first press, we must
			// initialize minefield
			firstPress = false;	
			initializeMinefield(
				minefield.tiles.countX,
				minefield.tiles.countY,
				minefield.mineCount
			);

			checkNeighbour();
		} else if(minefield.mineArray[minefield.position.x][minefield.position.y] === 1) {
			alert("Game Over\nOops, you died. :(\nPress F5 to continue.");
		} else {
			checkNeighbour();
		}
	}	
}

function checkNeighbour() {
	// TODO: in this function must check, is there mine in a neighbour

}

function preCheckAnimation() {
	// Update position
	minefield.position.x = Math.floor(game.input.x / minefield.tiles.sizeInCanvas);
	minefield.position.y = Math.floor(game.input.y / minefield.tiles.sizeInCanvas);
	minefield.realPosition.x = minefield.position.x * minefield.tiles.sizeInCanvas;
	minefield.realPosition.y = minefield.position.y * minefield.tiles.sizeInCanvas;

	player = game.add.sprite(minefield.realPosition.x, minefield.realPosition.y, "player");
	player.loadTexture("nolla");
}

/**
 * Make the minefield as an array where
 * value 0 means no mine and
 * value 1 is mine
 */
function initializeMinefield(width, height, amountOfMines) {
	var minefieldSize = width*height;

	// create it first as one dimensional array
	minefield.mineArray = new Array(minefieldSize);

	var i; // make sure, that i will 'live on' after for -loop
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

		// So this loop works in a way where
		// if the current position includes a mine
		// we must shuffle again the array
		if( minefield.mineArray[minefield.position.x][minefield.position.y] === 1 ) break;

		//  In this point the loop hasn't broke,
		// so we have to roll back an array to one-dimensioanal
		// a.k.a. we must flatten the array
		// https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
		minefield.mineArray = [].concat.apply([], minefield.mineArray);
	}

	minefield.sweeperArray = generateSweeperArray(minefield.mineArray);
}

function generateSweeperArray(array) {
	console.log("array:");
	console.log(array);

	var sweeperArray = new Array(array.length);
	
	// the border values
	var pos = {
		min : { x : 0, y : 0 },
		max : { x : array.length, y : null },
	};


	// Initialise sweeperArray
	// after the initialising sweeperArray is filled with zeroes,
	// but the points where mine is located, contains char "x".
	for(var i=0; i<array.length; i++) {
		// Calculate array[i][j] border
		// When we calculate max here,
		// the area doesn't have to be regular form
		// Also I think, using pos.max.y is faster than array[i].length
		// (it might recalculate it everytime?)
		pos.max.y = array[i].length;

		// define sub array
		sweeperArray[i] = new Array(pos.max.y);


		for(var j=0; j<pos.max.y; j++) {
			// initialize sweeper array with zeroes
			sweeperArray[i][j] = 0;

			// check if the [i][j] position contains a mine
			if(array[i][j] === 1) {
				// convert value to string
				// mines will convert to string, because when you
				// raise a value in javascript which is string,
				// it keeps as string, naturaly.
				// And if you raise an integer value in javascript,
				// it will raise as it should rise
				sweeperArray[i][j] = "x"; 
			}
		}
	}

	// now raise the neighbours
	for(var i=0; i<sweeperArray.length; i++) {
		pos.max.y = sweeperArray[i].length;

		for(var j=0; j<sweeperArray[i].length; j++)
		{
			// skip numbers
			// because the strings are mines, whose neighbours we want raise
			if( typeof(sweeperArray[i][j]) === "number" ) continue;

			var valueArray_i = [i-1, i, i+1];
			var valueArray_j = [j-1, j, j+1];

			for(var k=0; k<valueArray_i.length; k++) {
				for(var l=0; l<valueArray_j.length; l++) {
					// raise neighbour values if they exists
					if( typeof(sweeperArray[ valueArray_i[k]]) !== "undefined" &&
						typeof(sweeperArray[ valueArray_i[k] ][ valueArray_j[l] ]) !== "undefined" ) {
						sweeperArray[ valueArray_i[k] ][ valueArray_j[l] ] += 1;
					}

					/*
					// I don't know, which one would be faster
					var ik = valueArray_i[k];
					var jl = valueArray_j[l];

					if( typeof(sweeperArray[ik]) !== "undefined"
					&& typeof(sweeperArray[ik][jl] !== "undefined") {
						sweeperArray[ik][jl] += 1;
						sweeperArray[ik][jl]++; // this one causes NaN instead of String
					}
					*/
				}
			}
		}
	}

	console.log("sweeperArray:");
	console.log(sweeperArray);
}

function drawBackground(){
	for(var i=0; i<minefield.tiles.countX; i++) {
		for(var j=0; j<minefield.tiles.countY; j++) {
			var tile = game.add.sprite(
				i*minefield.tiles.sizeInCanvas, 
				j*minefield.tiles.sizeInCanvas, 
				"blank"
			);
		}
	}
}
