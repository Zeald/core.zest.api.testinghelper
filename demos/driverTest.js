const { DriverFactory } = require('../helpers/DriverFactory');
const { HomePage } = require('../pages/zest4/HomePage');
const { CategoryPage } = require('../pages/zest4/CategoryPage');
const { FavouritesPage } = require('../pages/zest4/FavouritesPage');
const dotenv = require('dotenv');
dotenv.config();

const driver = DriverFactory.build({
	type: 'chrome',
	screen: {
		width: 1024,
		height: 768
	}
});

const homePage = new HomePage(
	driver,
	process.env.TEST_BASE_URL
);

describe('Test', () => {
	it('Favourites', async () => {
		// go back home
		await homePage.open();
		await homePage.closeModalIfExist();

		// get a category url
		const categoryURL = await homePage.getCategoryURL(1);

		// create and open a category page
		const categoryPage = await new CategoryPage(driver, categoryURL);
		await categoryPage.open();
		await categoryPage.closeModalIfExist();

		// add products to favourites
		/*
		const firstProduct = await categoryPage.addProductToFavourites(2);
		const secondProduct = await categoryPage.addProductToFavourites();
		const thirdProduct = await categoryPage.addProductToFavourites();
		const productTitles = await categoryPage.getProductTitles([firstProduct, secondProduct, thirdProduct])
			.then((titles) => titles);

		const favouritesPage = await categoryPage.openFavourites();
		await favouritesPage.checkIfProductsExists();
		await favouritesPage.verifyAddedFavouriteProductTitles(productTitles);
		await favouritesPage.removeProductFromFavourites(0);
		await favouritesPage.removeAllProductFromFavourites();
		 */

		// await categoryPage.getProductContainersWithOptions();
		const productPageWithNoOption = await categoryPage.openProductWithNoOption();

		// go back to category
		await categoryPage.open();
		await categoryPage.closeModalIfExist();

		const productPageWithOption = await categoryPage.openProductWithOption();
		// await productPageWithOption.verifyOptionsPresence(null, true);
		// await productPageWithOption.verifyDescriptionPresence(null, true);
		// await productPageWithOption.verifyProductImagePresence(null, true);
		// await productPageWithOption.zoomProductImage();
		await productPageWithOption.testOptions();
	});

	after(async () => {
		await driver.quit();
	});
});
