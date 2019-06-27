const { pickRandom, notDefined } = require('../helpers/functions');

const items = [2, 3, 4, 1, 78];
const item = pickRandom(...items);
console.log(item);

let awts = '';
let result = notDefined(awts);
awts = null;
result = notDefined(awts);
awts = 'null';
result = notDefined(awts);
awts = undefined;
result = notDefined(awts);
awts = 0;
result = notDefined(awts);
awts = -1;
result = notDefined(awts);
console.log(result);
