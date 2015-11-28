// Advanced is the default difficulty
/*var difficulty = {
	name: "Advanced",
	tilesX: 30,
	tilesY: 16,
	mines: 99
};*/

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
		console.log("game.input.onDown game.input.x: "+game.input.x);
		kukkuu();
	} else if(game.input.activePointer.isUp) {
		// console.log("isUp. game.input.y"+game.input.y);
	}

	if(firstPress === true) {
		firstPress = false;
	}	
}

function kukkuu(){
	var pos = {
		x : Math.floor(game.input.x / tileSize),
		y : Math.floor(game.input.y / tileSize)
	};

	player = game.add.sprite(pos.x*tileSize, pos.y*tileSize, "player");
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

	// shuffles the minefield.
	minefield = shuffle(minefield);

	// convert minefield to multidimensional array
	minefield = listToMatrix(minefield, height);
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
