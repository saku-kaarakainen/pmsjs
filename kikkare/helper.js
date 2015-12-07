// helper.js
// Contains useful general functions

/**
 * Generate SQL-compatible string timestamp
 * https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
 *
 * @param  Date date
 * @return string
 */
function dateToSQLTimestamp(date) {
	return   date.getUTCFullYear()              + "-" +
	( "00" + (date.getUTCMonth()+1) ).slice(-2) + "-" +
	( "00" + date.getUTCDate()    )  .slice(-2) + " " +
	( "00" + date.getUTCHours()   )  .slice(-2) + ":" +
	( "00" + date.getUTCMinutes() )  .slice(-2) + ":" +
	( "00" + date.getUTCSeconds() )  .slice(-2);
}

/**
 * Custom console.log(). Puts timestamp before logging to console.log
 */
if( window.console && console.log ) {
	var tmp = console.log;

	console.log = function() {
		var date = new Date();
		Array.prototype.unshift.call(arguments, "["+dateToSQLTimestamp(date)+"]: ");
		tmp.apply(this, arguments);
	};
}


/**
 * Invalid paramer exeption. TODO: this is clunky, make it better
 *
 * @param string message
 */
function InvalidParameterException(message) {
	this.message = message;
	this.name = "invalidParameterException";
	alert(this.name+"\n\n"+this.message);
}

/**
 * Initialises 2D array.
 * 
 * @param  int   i_length   - length of an array
 * @param  int   j_lenght   - length of a sub array
 * @param  int   init_value - (optional). Init value
 * @return array            - generated 2D array
 * @throws InvalidParameterException
 */
function initialize2DArray(i_length, j_length, init_value) {
	if(typeof(j_length) === "undefined") {
		throw new InvalidParameterException("function initialize2DArray must have atleast two variable");
	}

	if(typeof(init_value) === "undefined") {
		init_value = 0;
	}

	var array = new Array(i_length);

	for(var i=0; i<minefield.tiles.countX; i++) {
		array[i] = new Array(j_length);
		for(var j=0; j<minefield.tiles.countY; j++) {
			array[i][j] = init_value;
		}
	}

	return array;
}

/**
 * Shuffles an array. Uses Fisher-Yates Shuffle
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 *
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
 * 
 * @param  array list               - the array to to be converted
 * @param  int   elementPerSubArray - Number of elements in a sub array
 * @return array 					- two-dimensional array
 */
function listToMatrix(list, elementsPerSubArray) {
	var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            matrix[++k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

/**
 * Find an element from the array. This would be better solution:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 *
 * @param  array array   - An array from where you are looking the element
 * @param  var   element - The element that you want to find
 * @return bool  true    - if element was found, else false
 */
function findFromArray(array, element) {
	for(var i in array){
		if(array[i] === element) {
			return true;
		}
	}

	return false;
}

/**
 * Count numbers and objects in array. Uses recursion.
 *
 * @param  var   items - the items you are counting
 * @param  array array - the array where you are looking for the items
 * @return int         - Count of items
 */
function countItemsFromArray(items, array) {
	var count=0;

	// var items = [9,10]
	for(var i=0; i<array.length; i++) {
		var arrayitype = typeof(array[i]);

		if( arrayitype === "object" ) {
			count += countItemsFromArray( items, array[i] );
		} else if( arrayitype === "number" ) {
			if(findFromArray(items, array[i])) {
				count++;
			}

		} else {
			// In a development ugliest errors are best :D
			throw new InvalidParameterException("Parameter was "+arrayitype+" altough it have to be either object or number.");
		}
	}

	return count;
}