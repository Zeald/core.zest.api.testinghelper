const dotenv = require('dotenv');
const { ZestApi } = require('../helpers/ZestApi');

dotenv.config();

const zestApi = new ZestApi({
	apiBaseURL: process.env.API_BASE_URL,
	apiKey: process.env.API_KEY,
	apiEmailLogBaseURL: process.env.API_EMAIL_LOG_URL
});
/*
zestApi.orderLines('ORD0001648').then((orders) => {
	console.log(orders);
});


zestApi.transaction('ORD0001646').then((orders) => {
	console.log(orders);
});
 */

zestApi.checkOrderAcknowledgmentEmail('ORD0001936', 'email.log', 20).then((data) => {
	console.log(data);
});

