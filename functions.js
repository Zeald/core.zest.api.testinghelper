const notDefined = (variable) => {
	return typeof variable === 'undefined' || variable === null || !variable;
};

module.exports.notDefined = notDefined;

