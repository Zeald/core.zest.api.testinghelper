/**
 * Check variable if undefined, null or empty.
 *
 * @param variable Variable
 * @returns {boolean}
 */
const notDefined = (variable) => {
	return typeof variable === 'undefined' || variable === null || !variable;
};

module.exports.notDefined = notDefined;

