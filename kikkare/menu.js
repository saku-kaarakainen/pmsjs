var menuState = {
	create: function() {
		var callbacks = [
			gameState.newgame,
			this.option,
			this.stats
		];
		 var menu_buttons = filterButtonsByCategory("menu");
		 console.log("menu_buttons:");
		 console.log(menu_buttons);
		 centerOption(menu_buttons, callbacks);
		
		// Note that if you define this before adding buttons, it will color buttons.
		// It's because WebGL lose the least recently used context:
		// // Error: WebGL: Exceeded 16 live WebGL contexts for this principal,
		// // losing the least recently used one. (phaser.min.js:7:24946)
		game.stage.backgroundColor = 0x123456; // dark blue
	},
	update: function() {
		console.log("menuState.update called");
	},

	//sub-scenes 

	option: function() {
		console.log("menuState.option called");

		var callbacks = [
			// Beginner
			function() {

			}
		];
	},
	stats: function() {
		console.log("menuState.stats called");
	},
};