var winState = {
	create: function() {
		// var enterkey   = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		 //   enterkey.onDown.addOnce(this.restart, this);
		 game.add.text(5, 5, "you won!", {font: "12px arial", fill:"#ffffff"});

		 var callback = [gameState. newgame, gameState.menu];
		 var winButtons = filterButtonsByCategory("win");
		 centerOption(winButtons, callback);
	}
};