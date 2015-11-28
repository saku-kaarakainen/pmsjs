/**
 * Global variables
 */

// Advanced is the default difficulty
/*var difficulty = {
	name: "Advanaced",
	tilesX: 30,
	tilesY: 16,
	mines: 99
};*/
var difficulty = {
	name: "none",
	tilesX: 0,
	tilesY: 0,
	mines: 0
};

// Start drawing after the document is ready
$(document).ready(function(){

	//run draw function constantly
	window.main = function(){
		window.requestAnimationFrame(main);
		draw();
	};

	// Start the cycle
	main();
});

function changeDifficultyByRadiosId(radioId) {
	if(radioId === "optionRadios1") {
		difficulty.name = "Beginner";
		difficulty.tilesX = 9;
		difficulty.tilesY = 9;
		difficulty.mines = 10;
	} else if(radioId === "optionRadios2") {
		difficulty.name = "Intermediate";
		difficulty.tilesX = 16;
		difficulty.tilesY = 16;
		difficulty.mines = 40;
	} else if(radioId === "optionRadios3") {
		difficulty.name = "Advanced";
		difficulty.tilesX = 16;
		difficulty.tilesY = 30;
		difficulty.mines = 99;
	} else if(radioId === "optionRadios4") {
		difficulty.name = "ToBeImplement";
		difficulty.tilesX = 0;
		difficulty.tilesY = 0;
		difficulty.mines = 0;
	}
}

function drawBackground(ctx, tilesX, tilesY) {
	var canvas = document.getElementsByTagName('canvas')[0];

	var lineDistanceW = canvas.width * (1 / tilesX);
	var lineDistanceH = canvas.height * (1 / tilesY);

	//tilesX = 16
	//tilesY = 30

	ctx.beginPath();

	for(var i=0; i<tilesX; i++) {
		for(var j=0; j<tilesY; j++) {
			ctx.rect(
				lineDistanceW*i, // start x
				lineDistanceH*j, // start y
				lineDistanceW,   // wdith
				lineDistanceH    // height
			);
		}
	}

	ctx.stroke();
}

function draw() {
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	// Check the difficulty level
	changeDifficultyByRadiosId( $('input[type=radio][name=optionRadio]:checked').attr('id') );

	// Clears canvas
	ctx.clearRect(0, 0, c.width, c.height);

	drawBackground(ctx, difficulty.tilesX, difficulty.tilesY);
}