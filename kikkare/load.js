var loadState = {

	// The preload function is stantard Phaser function,
	// which is automatically called
	preload: function() {
		// Scaling is (or should be :D) better for mobile platforms
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;

		// TODO: switch this to loading animation
		var loading = { 
			font : {
				font: "12px Courier",
				fill: "#ffffff"
			}, text : "Loading...", x : 80, y : 150 };
		var loadingLabel = game.add.text(loading.x, loading.y, loading.text, loading.font);

		// load minefield images
		for(var i=0; i<minefield.sprites.length; i++) {
			game.load.image(minefield.sprites[i].name, minefield.sprites[i].location);
		}

		// load button's image
		for(var i=0; i<buttons.length; i++) {
			game.load.image(buttons[i].name, buttons[i].location);
		}
	},

	create: function() {
		// Launch the menu
		game.state.start("menu");
	}
};