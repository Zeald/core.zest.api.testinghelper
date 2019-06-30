const dotenv = require('dotenv');
const { ZestApi } = require('../helpers/ZestApi');
const assert = require('assert');

dotenv.config();

// set up the API connection
const api = new ZestApi(process.env.API_URL, process.env.API_KEY);

// @todo - insert factory data & retrieve that? At least provide SQL to insert factory data

describe('Core API Testing', () => {

	it('Retrieves an order', async () => {
		const order = await api.order('TEST1', {
			lines: true
		});
		assert(order, 'Order was not retrieved from the API');
		assert.equal(order.orderNumber, 'TEST1', 'Correct order number wasn\'t retrieved');
		assert.equal(order.bFname, 'Do Not', 'First name was incorrect');
		assert.equal(order.email, 'do.not.delete.test@gmail.com', 'Email was incorrect');
		assert.equal(order.OrderLine.length, 2, 'Expected 2 orderlines to be retrieved with the order');
		assert.equal(order.OrderLine[0].sku, '03410', 'First orderline had an unexpected SKU');
		assert(!order.Customer, 'Customer data was unexpectedly retrieved');
	});

	it('Retrieves enquiries', async () => {
		const enquiries = await api.enquiries({
			fname: 'Sandra'
		}, 2);
		assert(enquiries, 'Enquiries failed to retrieve');
		assert.equal(enquiries.length, 2, 'Expected 2 enquiries to be returned - perhaps limit failed?');

		// ensure all enquiries have sandra as their first name
		enquiries.forEach((enquiry) => {
			assert.equal(enquiry.fname.toLowerCase(), 'sandra', 'An enquiry was retrieved with the wrong first name');
			assert(enquiry.email, 'Expected an email to be set for all enquiries');
		});
	});

	it('Retrieve the email log file', async () => {
		const emailLog = await api.readLog('email.log', 2);
		assert(emailLog, 'Expected there to be some data retrieved from the email log');
		assert(emailLog.match(/^\d+\.\d+\.\d+/), 'Expected email log line to start with an IP address. ' +
			'Did it retrieve the correct log data?');

		// check tail
		const lines = emailLog.split(/[\r\n]+/);
		assert.equal(lines.length, 2, 'Expected exactly 2 lines to be retrieved - is tail working?');
	});
});
