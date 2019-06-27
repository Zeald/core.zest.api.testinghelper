const { _ } = require('underscore');

/**
 * Check variable if undefined, null or empty.
 *
 * @param variable Variable
 * @returns {boolean}
 */
const notDefined = (variable) => {
	return (typeof variable === 'undefined' || variable === null || !variable) && !Number.isInteger(variable);
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

/**
 * Compare 2 arrays or objects if equal.
 *
 * @param item1 First item
 * @param item2 Second item
 * @returns {*}
 */
const isEqual = (item1, item2) => {
	return _.isEqual(item1, item2);
};

module.exports.notDefined = notDefined;
module.exports.pickRandom = pickRandom;
module.exports.isEqual = isEqual;

