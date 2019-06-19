const { pickRandom } = require('../helpers/functions');

const items = [2, 3, 4, 1, 78];
const item = pickRandom(...items);
console.log(item);
