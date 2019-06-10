const { notDefined } = require('./functions');
const { ZestApi } = require('./ZestApi');

const helloWorld = () => {
	console.log('Hello World');
};

module.exports.notDefined = notDefined;
module.exports.ZestApi = ZestApi;
module.exports.helloWorld = helloWorld;
