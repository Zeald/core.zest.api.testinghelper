/**
 * Check variable if undefined, null or empty.
 *
 * @param variable Variable
 * @returns {boolean}
 */
const notDefined = (variable) => {
	return typeof variable === 'undefined' || variable === null || !variable;
};

/**
 * Pick a random element from the list.
 *
 * @param items Array
 * @returns {*}
 */
const pickRandom = (...items) => {
	return items[Math.floor(Math.random()*items.length)];
};

module.exports.notDefined = notDefined;
module.exports.pickRandom = pickRandom;

