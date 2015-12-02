var gameoverState = {
	create: function() {
		// var enterkey   = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		//    enterkey.onDown.addOnce(this.restart, this);
		game.add.text(5, 5, "you lost", {font: "12px arial", fill:"#ffffff"});

		var callbacks = [gameState.newgame, gameState.restart, gameState.menu];
		var goButtons = filterButtonsByCategory("gameover");
		centerOption(goButtons, callbacks);
	}
};