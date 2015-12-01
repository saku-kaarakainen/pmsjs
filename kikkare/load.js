var loadState = {

	// The preload function is stantard Phaser function,
	// which is automatically called
	preload: function() {
		// TODO: switch this to loading animation
		var loading = { 
			font : {
				font: "12px Courier",
				fill: "#ffffff"
			}, text : "Loading...", x : 80, y : 150 };
		var loadingLabel = game.add.text(loading.x, loading.y, loading.text, loading.font);

		// load button images
		game.load.spritesheet(
			"menu_buttons",							// button's name
			"assets/buttons/menu/buttons64x16.png",	// button's location
			64,										// single button's width
			16,										// single button's height
			3										// number of buttons
		);

		// load minefield images
		for(var i=0; i<minefield.sprites.length; i++) {
			game.load.image(minefield.sprites[i].name, minefield.sprites[i].location);
		}

		// this array will initialises with value 9
		// because the correct sprites will pick by minefield.sprites' index
		// and the 9 indicate there sprite "blank" 
		minefield.answerArray = initialize2DArray(minefield.tiles.countX,minefield.tiles.countY, 9);
		minefield.freeSpaceLeft = (minefield.tiles.countX*minefield.tiles.countY) - minefield.mineCount;
		console.log("load.js: function preload: minefield: "+minefield);
		console.log(minefield);
	},

	create: function() {
		// Launch the menu
		game.state.start("menu");
	}
};