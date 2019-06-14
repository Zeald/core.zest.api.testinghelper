const dotenv = require('dotenv');
const { ZestApi } = require('../helpers/ZestApi');

dotenv.config();

const zestApi = new ZestApi(process.env.API_BASE_URL, process.env.API_KEY);

zestApi.orderLines('ORD0001648').then((orders) => {
	console.log(orders);
});

