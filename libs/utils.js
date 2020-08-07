/** Random number between two values */
function random(nb1, nb2) { return Math.round(Math.random() * (nb2 - nb1) + nb1); }

function minMax(nb, min, max) { return Math.max(min, Math.min(nb, max)); }

const isset = (...elms) => elms.every(elm => typeof elm !== 'undefined' && elm !== null);

/** Sum all values of an array, all values MUST be numbers */
function sumArray(array) {
    return array.reduce((sum, val) => val + sum, 0);
}

/** Moyenne / average between array of values 
 * @param {Number} round number of decimals to keep. Default:2
*/
function moy(array) {
    return sumArray(array) / array.length;
}