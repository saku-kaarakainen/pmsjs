var gameoverState = {
	create: function() {
		var winLabel   = game.add.text(80,80,"You died. Game over :(",{font:"50px Arial",fill:"#FF0000"});
		var startLabel = game.add.text(80,game.world.height-80, "press Enter to restart",{font:"25px Arial",fill:"#FFFFFF"});
		var enterkey   = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		    enterkey.onDown.addOnce(this.restart, this);
	},
	restart: function() {
		game.state.start("play");
	}
};