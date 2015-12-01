var winState = {
	create: function() {
		var enterkey   = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		    enterkey.onDown.addOnce(this.restart, this);
	},
	restart: function() {
		// TODO: remove old data
		game.state.start("play");
	}
};