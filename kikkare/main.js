// Advanced is the default difficulty
/*var difficulty = {
	name: "Advanced",
	tilesX: 30,
	tilesY: 16,
	mines: 99
};*/

// TODO: make a rational object for  handling everything

// Use this for now, that the game won't be so heavy
var difficulty = {
	name: "Beginner",
	tilesX: 9,
	tilesY: 9,
	mines: 10
};

var tileSize = 16;

var game = new Phaser.Game(
	difficulty.tilesX*tileSize,
	difficulty.tilesY*tileSize,
	Phaser.AUTO,
	null, {
		preload: preload,
		create: create,
		update: update
});

var minefield = null; // we will initialize this later
var firstPress = true;
var player;
// A custom mouseUp, 
// because apparently there's no proper handler in phaser
var mouseUp = 0; 

var position = {
	x : null,
	y : null
};

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
	initializeMinefield(difficulty.tilesX, difficulty.tilesY, difficulty.mines);
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
				difficulty.tilesX,
				difficulty.tilesY,
				difficulty.mines
			);

			checkNeighbour();
		} else {
			checkMinefield();
		}
	}	
}

function checkNeighbour() {
	// TODO: in this function must check, is there mine in a neighbour
}

function checkMinefield() {
	// TODO: this
}

function preCheckAnimation(){
	// Update position
	position.x = Math.floor(game.input.x / tileSize) * tileSize;
	position.y = Math.floor(game.input.y / tileSize) * tileSize;

	player = game.add.sprite(position.x, position.y, "player");
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
	minefield = new Array(minefieldSize);

	var i; // make sure, that i will 'live on' after for -loop
	// put mines to first positions
	for(i=0; i<amountOfMines; i++) {
		minefield[i] = 1;
	}

	// fill the rest with zeroes
	for(var j=i; j<minefieldSize; j++) {
		minefield[j] = 0;
	}

	// forever-loop  isn't maybe  the most elegant solution
	// but it works atleast
	while(1) {
		// shuffles the minefield.
		minefield = shuffle(minefield);
		
		// convert minefield to multidimensional array
		minefield = listToMatrix(minefield, height);

		// So this loop works in a way where
		// if the current position includes a mine
		// we must shuffle again the array
		if( minefield[position.x][position.y] === 1 ) break;

		//  In this point the loop hasn't broke,
		// so we have to roll back an array to one-dimensioanal
		// a.k.a. we must flatten the array
		// https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
		minefield = [].concat.apply([], minefield);
	}
}

function drawBackground(){
	for(var i=0; i<=difficulty.tilesX; i++) {
		for(var j=0; j<difficulty.tilesY; j++) {
			var tile = game.add.sprite(
				i*tileSize, 
				j*tileSize, 
				"blank"
			);
		}
	}
}
