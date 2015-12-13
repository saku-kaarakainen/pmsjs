/**
  *  Dim object
  *
  * @var start
  * @var center
  * @var end
  */
var Dim = function() { 
	this.start=0;
	this.center=0;
	this.end=0;
};

/**
  * Dimensional object
  *
  * @var Dim x
  * @var Dim y
  */
var Dimension = function(x, y) {
	// public objects x and y
	this.x = typeof(x) === "undefined" ? { start:0, center:0, end:0 } : x;
	this.y = typeof(y) === "undefined" ? { start:0, center:0, end:0 } : y;
};

// this is an array that you can loop it easily
var buttons = [
	// number after category tells order number in menu  (0 = first, 1 = second, etc...)
	// (not the start menu, but a general menu)
	{ name: "menu",         location: "assets/buttons/menu.png",         categories: { "win":1, "gameover":2 } },
	{ name: "new_game",     location: "assets/buttons/new_game.png",     categories: { "win":0, "gameover":0, "menu":0 } },
	{ name: "options",      location: "assets/buttons/options.png",      categories: { "menu":1 } },
	{ name: "restart_game", location: "assets/buttons/restart_game.png", categories: { "gameover":1 } },
	{ name: "statistics",   location: "assets/buttons/statistics.png",   categories: { "menu":2 } },
	// sub-scenes of menu
	{ name: "beginner",		location: "assets/buttons/beginner.png",	 categories: { "option":0} },
	{ name: "intermediate",	location: "assets/buttons/intermediate.png", categories: { "option":1} },
	{ name: "advanced",		location: "assets/buttons/advanced.png",	 categories: { "option":2} },
	{ name: "custom",		location: "assets/buttons/custom.png",	 	 categories: { "option":3} }
];

// --------------------------------
//        CLASS DIFFICULTY
// --------------------------------

// define var Difficulty as an object
var Difficulty = {};

// Width this constructor, every mine have to set
Difficulty.create = function(name, width, height, mines) {
	this.name = null;
	this.width = null;
	this.height = null;
	this.mines = null;

	switch( arguments.length ) {
		case 0: break;
		case 1: this.name = name break;;
		case 2:
		case 3:
			// Throw an exception. Programmer might have set wrong amount of arguments
			InvalidParameterCountException("Check your arguments.");
			break;
		default:  // extra arguments will be ignored
			this.name = name;
			this.width = width;
			this.height = height;
			this.mines = mines;
	}

};

Difficulty.beginner 	= new Difficulty.create("beginner", 9, 9, 10);
Difficulty.intermediate	= new Difficulty.create("intermediate", 16, 16, 16);
Difficulty.advanced 	= new Difficulty.create("advanced", 30, 16, 99);
Difficulty.custom 		= new Difficulty.create("custom");
Difficulty.current 		= new Difficulty.create();

// Set default difficulty to beginner
Difficulty.current = Difficulty.beginner;
Difficulty.getCurrent = function() { return Difficulty.current; }

Difficulty.changeTo = {
	beginner: function() {
		Difficulty.current = Difficulty.beginner;
	},
	intermediate: function() {

	},
	advanced: function() {},
	custom: function() {}
};

// --------------------------------
//        CLASS DIFFICULTY
// --------------------------------


/*
	// USE CASES OF DIFFICULTY

	// get width used by beginner
	var width = difficulty.beginner.width;


	// chhange difficulty to beginner
	difficulty.changeTo.beginner();

	// get current difficulty
	difficulty.getCurrent();
*/


var minefield = {
	tiles : {
		countX : difficulty.current.width,
		countY : difficulty.current.height,
		sizeInCanvas : 16, // it's square ( width:16,height:16 )
		totalWidth : null,
		totalHeight: null
	},
	mineCount : difficulty.current.mines,
	mineArray : null, // TODO: remove this
	sweeperArray : null,
	answerArray : null,
	freeSpaceLeft : null,
	player : null,
	selected : null,
	area : null,
	position : { x : null, y : null },
	realPosition : { x : null, y : null},
	sprites : [
		{ name : "nolla",   location : "assets/game/0.png" },          // 0
		{ name : "eka",     location : "assets/game/1.png" },          // 1
		{ name : "toka",    location : "assets/game/2.png" },          // 2
		{ name : "kolmas",  location : "assets/game/3.png" },          // 3
		{ name : "neljas",  location : "assets/game/4.png" },          // 4
		{ name : "viides",  location : "assets/game/5.png" },          // 5
		{ name : "kuudes",  location : "assets/game/6.png" },          // 6
		{ name : "seiska",  location : "assets/game/7.png" },          // 7
		{ name : "kasi",    location : "assets/game/8.png" },          // 8
		{ name : "blank",   location : "assets/game/unpressed.png" },  // 9
		{ name : "lippu",   location : "assets/game/flag.png" },       // 10
		{ name : "kyssari", location : "assets/game/wat.png" },        // 11
		{ name : "tonni",   location : "assets/game/burana1000.png" }, // 12
		{ name : "caps",    location : "assets/game/buranaCaps.png" }  // 13
	]
};

// TODO: button is incorrect name, choose better one.
var BUTTON = {
	SELECTED  : 0, // BLANK is default
	BLANK     : 0,
	ONE       : 1,
	TWO       : 2,
	THREE     : 3,
	FOUR      : 4,
	FIVE      : 5,
	SIX       : 6,
	SEVEN     : 7,
	EIGHT     : 8,
	UNPRESSED : 9,
	FLAG      : 10,
	QUESTION  : 11,
	MINE      : 12,
	REDMINE   : 13
};

// 'hardcoded' values because it's faster and less complicated
var BUTTON_NUMBERS_ARRAY = Array(0,1,2,3,4,5,6,7,8);

// these have to do before declaring var game = Phaser.Game...
var w=minefield.tiles.totalWidth = minefield.tiles.countX * minefield.tiles.sizeInCanvas;
var h=minefield.tiles.totalHeight = minefield.tiles.countY * minefield.tiles.sizeInCanvas

// We are setting the game to the div with id "gameDiv"
var game = new Phaser.Game(
	minefield.tiles.totalWidth + (2* minefield.tiles.sizeInCanvas), // add some space for toolbar
	minefield.tiles.totalHeight,
	Phaser.AUTO		     
);  // No states define yet

// Use this for scene navigation
var gameState = {
	newgame: function() {
		minefield.answerArray = initialize2DArray(minefield.tiles.countX,minefield.tiles.countY, BUTTON.UNPRESSED);
		minefield.freeSpaceLeft = (minefield.tiles.countX*minefield.tiles.countY) - minefield.mineCount;
		firstPress = true; // This makes that, on first press, mine locations will be randomized

		game.state.start("play");
	},
	restart: function() {
		minefield.answerArray = initialize2DArray(minefield.tiles.countX,minefield.tiles.countY, BUTTON.UNPRESSED);
		game.state.start("play");
	},
	menu: function() {
		game.state.start("menu");
	},
	win : function() {
		game.state.start("win");
	},
	gameOver : function() {
		game.state.start("gameover");
	}
}

// Define the game states

// if we decide to use game engine, put it to boot.js
// and then of course start game from boot.js
// game.state.add("boot", bootState);
game.state.add("load", loadState);
game.state.add("menu", menuState);
game.state.add("play", playState);
game.state.add("win", winState);
game.state.add("gameover", gameoverState);

// First scene of the game is boot
game.state.start("load");

/**
 * Scan var buttons, and gives elements by category (without element categories).
 * 
 * @param  string category - The category which we use.
 * @return array           - The filtered buttons  
 */
function filterButtonsByCategory(cat) {
	var ret = [];
	for(var i=0; i<buttons.length; i++) {
		var categories = buttons[i].categories;
		if( cat in categories ) {		
			// Solution A
			ret[ categories[cat] ] = {
				name : buttons[i].name,
				location : buttons[i].location
			};
		}
	}

	return ret;
}

/**
 * Center an option
 *
 * @param array  buttons
 * @param array  callbackArray
 */
function centerOption(buttons, callbackArray) {

	if( typeof(align) === "undefined") align = "center";

	var dimensions = {
		matrix : [],
		longest : {
			width:0,
			wi:null, // index of width
			height:0,
			hi:null  // index of height
		}
	};

	// Calculate dimensions for images
	for(var i=0; i<buttons.length; i++) {
		// This loop shouldn't rewrite x.start and y.start
		// so we don't need to rely about these values
		var dim = new Dimension();

		dim.x.end = game.cache.getImage( buttons[i].name ).width;
		dim.y.end = game.cache.getImage( buttons[i].name ).height;

		// Still, we don't rely about x.start (nor y.start)
		dim.x.center = dim.x.end / 2;
		dim.y.center = dim.y.end / 2;

		// Push Dimension dim to matrix
		dimensions.matrix.push(dim);

		// dim.x.end equals it's width at this point
		if( dim.x.end > dimensions.longest.width ) {
			dimensions.longest.width = dim.x.end;
			dimensions.longest.wi = i;
		}

		if( dim.y.end > dimensions.longest.height ) {
			dimensions.longest.height = dim.y.end;
			dimensions.longest.hi = i;
		}
	}

	// tells which of matrix' has longest width
	var longestByWidth =  dimensions.matrix[dimensions.longest.wi];
	var longestByHeight = dimensions.matrix[dimensions.longest.hi];

	// Center options by button group as we could say
	for(var i=0; i<buttons.length; i++) {
		var x_correction = longestByWidth.x.center  - dimensions.matrix[i].x.center;
		var y_correction = longestByHeight.y.center - dimensions.matrix[i].y.center;

		dimensions.matrix[i].x.start += x_correction;
		dimensions.matrix[i].x.center = longestByWidth.x.center;
		dimensions.matrix[i].x.end   += x_correction;

		// define height only if it doesn't exists yet
		var height = height || 0;

		dimensions.matrix[i].y.start += height + y_correction;
		dimensions.matrix[i].y.center = height + longestByHeight.y.center;
		dimensions.matrix[i].y.end   += height + y_correction;

		// Add height to previous height
		height += dimensions.matrix[i].y.end - dimensions.matrix[i].y.start;
		// height += 1; // Adds small gap between buttons
	}

	var gameWdithCenter = game.width / 2;
	var gameHeightCenter = game.height / 2;

	var buttonGroup = new Dimension();
	buttonGroup.x.end = longestByWidth.x.end;
	buttonGroup.y.end = dimensions.matrix[buttons.length-1].y.end;

	buttonGroup.x.start = longestByWidth.x.start;
	buttonGroup.y.start = dimensions.matrix[0].y.start;

	buttonGroup.x.center = (buttonGroup.x.end - buttonGroup.x.start) / 2;
	buttonGroup.y.center = (buttonGroup.y.end - buttonGroup.y.start) / 2;

	var x_correction = gameWdithCenter - buttonGroup.x.center;
	var y_correction = gameHeightCenter - buttonGroup.y.center;

	buttonGroup.x.start	+= x_correction;
	buttonGroup.x.center += x_correction;
	buttonGroup.x.end += x_correction;
	buttonGroup.y.start	+= y_correction;
	buttonGroup.y.center += y_correction;
	buttonGroup.y.end += y_correction;

	x_correction = null;
	y_correction = null;

	// Center options by canvas
	for( var i=0; i<buttons.length; i++) {
		var x_correction = gameWdithCenter  - dimensions.matrix[i].x.center;
		var y_correction = gameHeightCenter - dimensions.matrix[i].y.center - buttonGroup.y.center;

		dimensions.matrix[i].x.start += x_correction;
		dimensions.matrix[i].x.center = gameWdithCenter;
		dimensions.matrix[i].x.end   += x_correction;

		var height = height || 0;

		dimensions.matrix[i].y.start += height + y_correction;
		dimensions.matrix[i].y.center = height + gameHeightCenter;
		dimensions.matrix[i].y.end   += height + y_correction;

		// Add height to previous height
		height += dimensions.matrix[i].y.end - dimensions.matrix[i].y.start;

		// 'Draw' buttons
		// it's unnecessary extra work to make another loop for making these buttons
		game.add.button(
			dimensions.matrix[i].x.start,
			dimensions.matrix[i].y.start,
			buttons[i].name,
			callbackArray[i]
		);
	} // TODO: could we merge this and previous loop?
}
