const { expect } = require('chai');
const { CategoryPage } = require('./CategoryPage');

/**
 * Favourites page class
 *
 */
class FavouritesPage extends CategoryPage {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 */
	constructor(webdriver, url) {
		super(webdriver, url);
	}

	/**
	 * Very added products to favourites
	 *
	 * @returns {Promise<*>}
	 * @param addedProductTitles Title of the products added to favourites.
	 */
	async verifyAddedFavouriteProductTitles(addedProductTitles) {
		const favouritesPageProductTitles = await this.getProductTitles().then((titles) => titles);
		const isAddedASubset = await addedProductTitles.every((val) => favouritesPageProductTitles.includes(val));
		return await expect(isAddedASubset, 'Not all products added to favourites!').to.be.true;
	}
}

module.exports.FavouritesPage = FavouritesPage;
