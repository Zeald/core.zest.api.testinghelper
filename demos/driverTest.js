const { DriverFactory } = require('../helpers/DriverFactory');
const dotenv = require('dotenv');
dotenv.config();

const driver = DriverFactory.build({
	type: 'chrome',
	screen: {
		width: 1024,
		height: 768
	}
});

describe('Test', () => {
	it('Driver', async () => {
		await driver.get(process.env.TEST_BASE_URL);
	});

	after(async () => {
		await driver.quit();
	});
});
