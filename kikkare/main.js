var game = new Phaser.Game(
	800,
	600,
	Phaser.AUTO,
	null, {
		preload: preload,
		create: create,
		update: update
	}
);

var tile;

function preload() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.state.backgroundColor = "#009933";

	game.load.image("tile", "img/blank.png");
}

function create() {
	tile = game.add.sprite(16,16, "tile");
}

function update () {
	tile.x += 1;
	tile.y += 1;
}
