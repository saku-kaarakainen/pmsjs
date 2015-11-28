// helper.js
// Contains useful general functions
// 
// ----------------------------------------------------------------------------
// "THE BEER-WARE LICENSE" (Revision 42):
// Saku Kaarakainen wrote this file,
// altough this file contains functions, that is 'borrowed' from internet.
// As long as you retain this notice you
// can do whatever you want with this stuff.
// If we meet some day, and you think
// this stuff is worth it, you can buy me a beer in return.
// Poul-Henning Kamp
// ----------------------------------------------------------------------------


 /**
 * Shuffles an array. Uses Fisher-Yates Shuffle
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param array array - An array which you want to be shuffled
 * @return array      - shuffled array
 */
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while(0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/**
 * Convert one-dimensional array to 2d array.
 * https://stackoverflow.com/questions/4492385/how-to-convert-simple-array-into-two-dimensional-arraymatrix-in-javascript-or
 */
function listToMatrix(list, elementsPerSubArray) {
	var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}
