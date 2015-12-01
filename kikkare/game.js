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