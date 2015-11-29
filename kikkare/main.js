// Advanced is the default difficulty

var minefield = {
	difficulty : "Beginner", // this is irrelevant to anythinh
	tiles : {
		countX : 9,
		countY : 9,
		sizeInCanvas : 16,
		totalWidth : null,
		totalHeight: null
	},
	mineCount : 10,
	mineArray : null, // We will initialize this later
	position : { x : null, y : null },
	realPosition : { x : null, y : null}
};
minefield.tiles.totalWidth = minefield.tiles.countX * minefield.tiles.sizeInCanvas;
minefield.tiles.totalHeight = minefield.tiles.countY * minefield.tiles.sizeInCanvas


// Use this for now, that the game won't be so heavy
var difficulty = {
	name: "Beginner",
	tilesX: 9,
	tilesY: 9,
	mines: 10
};


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
	drawBackground();
	//tile = game.add.sprite(0,0, "tile");
	// initializeMinefield(difficulty.tilesX, difficulty.tilesY, difficulty.mines);
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
		} else {
			checkMinefield();
		}
	}	
}

function checkNeighbour() {
	// TODO: in this function must check, is there mine in a neighbour
	console.log("function checkNeighbour");
	console.log("minefiedld.position.x: "+minefield.position.x+" minefiedld.position.y: "+minefield.position.y);
}

function checkMinefield() {
	// TODO: this
	console.log("function checkMinefield");
}

function preCheckAnimation(){
	console.log("preCheckAnimation");
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
	}

	// fill the rest with zeroes
	for(var j=i; j<minefieldSize; j++) {
		minefield.mineArray[j] = 0;
	}


	// forever-loop  isn't maybe  the most elegant solution
	// but it works atleast
	//while(1) {
		// shuffles the minefield.
		minefield.mineArray = shuffle(minefield.mineArray);
		
		// convert minefield to multidimensional array
		minefield.mineArray = listToMatrix(minefield.mineArray, height);

		// So this loop works in a way where
		// if the current position includes a mine
		// we must shuffle again the array
		//if( minefield.mineArray[position.x][position.y] === 1 ) break;

		//  In this point the loop hasn't broke,
		// so we have to roll back an array to one-dimensioanal
		// a.k.a. we must flatten the array
		// https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
		//minefield.mineArray = [].concat.apply([], minefield.mineArray);
	//}
	console.log(minefield);
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
