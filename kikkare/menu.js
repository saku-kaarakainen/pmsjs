var menuState = {
	create: function() {
		var menuTexts = {
			header: minefield.gameName,
			start: "Press enter to start"
		};

		var fontMain = {
			font: "12px Arial",
			fill: "#ffffff"
		};


		// this is silly way

		// http://phaser.io/docs/2.4.4/Phaser.GameObjectFactory.html#button
		// button(x,u,key,callback,callbackContext, overFrame,outFrame,downFrame, upFrame, group)
		var button0 = game.add.button(10,10, "menu_buttons", this.start, 0, 0, 0, 0);
		var button1 = game.add.button(10,36, "menu_buttons", this.start, 1, 1, 1, 1);
		var button2 = game.add.button(10,52, "menu_buttons", this.start, 2, 2, 2, 2);
		console.log(button0);

		// var fontHeader  = fontMain; // inherit header's styles from fontMain
		// fontHeader.font = "25px Arial";

		// var nameLabel   = game.add.text(80, 70, menuTexts.header, fontHeader);
		// console.log("height:"+game.world.height);
		// var startLabel  = game.add.text(80, game.world.height-80, menuTexts.start, fontMain);

		// var enterkey    = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		//    enterkey.onDown.addOnce(this.start, this);
	},
	start: function() {
		game.state.start("play");
	}
};