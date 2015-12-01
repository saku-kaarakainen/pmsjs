var gameoverState = {
	create: function() {
		var enterkey   = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		    enterkey.onDown.addOnce(this.restart, this);
	},
	restart: function() {
		game.state.start("play");
	}
};