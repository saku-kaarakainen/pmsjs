var menuState = {
	create: function() {
		// add buttons to menu screen
		for(var i=0; i<buttons.menu.length; i++) {
			var x = 10;
			var y = (16*1.1*i)+10;
			console.log("round i: "+i+". y: "+y+". name: "+buttons.menu[i].name);
			game.add.button(x, y, buttons.menu[i].name, this.start); // TODO: change this.start out from here
		}
		
		// Note that if you define this before adding buttons, it will color buttons.
		// It's because WebGL lose the least recently used context:
		// // Error: WebGL: Exceeded 16 live WebGL contexts for this principal,
		// // losing the least recently used one. (phaser.min.js:7:24946)
		game.stage.backgroundColor = 0x123456; // dark blue
	},
	start: function() {
		game.state.start("play");
	}
};