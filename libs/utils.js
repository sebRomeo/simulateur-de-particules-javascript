/** Random number between two values */
function random(nb1, nb2) { return Math.round(Math.random() * (nb2 - nb1) + nb1); }

function minMax(nb, min, max) { return Math.max(min, Math.min(nb, max)); }

const isset = (...elms) => elms.every(elm => typeof elm !== 'undefined' && elm !== null);