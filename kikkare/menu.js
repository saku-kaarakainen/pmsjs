var menuState = {
	create: function() {
		var callbacks = [
			gameState.newgame,
			gameState.newgame,
			gameState.newgame
		];
		 var menu_buttons = filterButtonsByCategory("menu");
		 centerOption(menu_buttons, callbacks);
		
		// Note that if you define this before adding buttons, it will color buttons.
		// It's because WebGL lose the least recently used context:
		// // Error: WebGL: Exceeded 16 live WebGL contexts for this principal,
		// // losing the least recently used one. (phaser.min.js:7:24946)
		game.stage.backgroundColor = 0x123456; // dark blue
	}
};