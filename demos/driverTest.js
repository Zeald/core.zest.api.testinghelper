const { DriverFactory } = require('../helpers/DriverFactory');
const { HomePage } = require('../pages/zest4/HomePage');
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

	it('Home page search', async () => {
		const homePage = new HomePage(
			driver,
			process.env.TEST_BASE_URL
		);

		await homePage.open();
		await homePage.closeModalIfExist();
		await homePage.searchTerm('ambot');
	});

	after(async () => {
		await driver.quit();
	});
});
