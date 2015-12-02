/**
 * Center an option
 *
 * @param array  buttons
 * @param array  callbackArray
 */
function centerOption(buttons, callbackArray) {

	if( typeof(align) === "undefined") align = "center";

	// Define Dimension object
	var Dimension = function() {
		// public objects x and y
		this.x = { start:0, center:0, end:0 };
		this.y = { start:0, center:0, end:0 };
	};

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

	var x_correction = gameWdithCenter  - buttonGroup.x.center;
	var y_correction = gameHeightCenter - buttonGroup.y.center;

	buttonGroup.x.start	+= x_correction;
	buttonGroup.x.center 	+= x_correction;
	buttonGroup.x.end	+= x_correction;
	buttonGroup.y.start	+= y_correction;
	buttonGroup.y.center 	+= y_correction;
	buttonGroup.y.end 	+= y_correction;

	x_correction = null;
	y_correction = null;

	// Center options by canvas
	for( var i=0; i<buttons.length; i++) {
		var x_correction = gameWdithCenter  - dimensions.matrix[i].x.center;
		var y_correction = gameHeightCenter - dimensions.matrix[i].y.center - buttonGroup.y.center;

		console.log("y_correction = "+y_correction+" = gameHeightCenter("+gameHeightCenter+") - dimensions.matrix["+i+"].y.center("+dimensions.matrix[i].y.center+")");

		dimensions.matrix[i].x.start += x_correction;
		dimensions.matrix[i].x.center = gameWdithCenter;
		dimensions.matrix[i].x.end   += x_correction;

		var height = height || 0;

		dimensions.matrix[i].y.start += height + y_correction;
		dimensions.matrix[i].y.center = height + gameHeightCenter;
		dimensions.matrix[i].y.end   += height + y_correction;

		// Add height to previous height
		height += dimensions.matrix[i].y.end - dimensions.matrix[i].y.start;
	} // TODO: could we merge this and previous loop?

	// 'draw' buttons
	for(var i=0; i<buttons.length; i++) {
		/*console.log({
			i:i,
			x:dimensions.matrix[i].x.start,
			y:dimensions.matrix[i].y.start,
			name:buttons[i].name,
			callback:callbackArray[i]
		});*/

		game.add.button(
			dimensions.matrix[i].x.start,
			dimensions.matrix[i].y.start,
			buttons[i].name,
			callbackArray[i]
		);
	}
}


// this is an array that you can loop it easily
var buttons = [
	// number after category tells order number in menu 
	// (not the start menu, but a general menu)
	{ name: "menu",         location: "assets/buttons/menu.png",         categories: { "win":1, "gameover":2 } },
	{ name: "new_game",     location: "assets/buttons/new_game.png",     categories: { "win":0, "gameover":0, "menu":0 } },
	{ name: "options",      location: "assets/buttons/options.png",      categories: { "menu":1 } },
	{ name: "restart_game", location: "assets/buttons/restart_game.png", categories: { "gameover":1 } },
	{ name: "statistics",   location: "assets/buttons/statistics.png",   categories: { "menu":2 } } 
];

var minefield = {
	tiles : {
		countX : 9,
		countY : 9,
		sizeInCanvas : 16,
		totalWidth : null,
		totalHeight: null
	},
	mineCount : 10,
	mineArray : null, // TODO: remove this
	sweeperArray : null,
	answerArray : null,
	freeSpaceLeft : null,
	player : null,
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

// these have to do before declaring var game = Phaser.Game...
var w=minefield.tiles.totalWidth = minefield.tiles.countX * minefield.tiles.sizeInCanvas;
var h=minefield.tiles.totalHeight = minefield.tiles.countY * minefield.tiles.sizeInCanvas
console.log("w:"+w+", h:"+h);
// We are setting the game to the div with id "gameDiv"
var game = new Phaser.Game(
	minefield.tiles.totalWidth,  // width
	minefield.tiles.totalHeight, // height
	Phaser.AUTO					 // No states define yet
);


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
		// nice solution
		// https://stackoverflow.com/questions/1098040/checking-if-a-key-exists-in-a-javascript-object
		if( cat in categories ) {
			/*
			// Solution A
			ret[ categories[cat] ] = {
				name : buttons[i].name,
				location : buttons[i].location
			};
			*/
			// Solution B
			ret[ categories[cat] ] = buttons[i];
			delete ret[ categories[cat] ].categories;
		}
	}

	return ret;
}