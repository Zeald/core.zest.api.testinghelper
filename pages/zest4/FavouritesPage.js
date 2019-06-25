const { By } = require('selenium-webdriver');
const { expect } = require('chai');
const { notDefined, pickRandom } = require('../../helpers/functions');
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
	 * @param removeFromFavouritesLocator The locator for removing product.
	 */
	constructor(webdriver, url, removeFromFavouritesLocator) {
		super(webdriver, url);

		this._removeFromFavouritesLocator = removeFromFavouritesLocator;

		this._removeFromFavouritesLocator = notDefined(this._removeFromFavouritesLocator) ?
			By.css('.add-favourite.selected') : this._removeFromFavouritesLocator;
	}

	/**
	 * Set remove from favourites locator
	 *
	 * @param value Locator
	 */
	set removeFromFavouritesLocator(value) {
		this._removeFromFavouritesLocator = value;
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

	/**
	 * Check if product exist in the list of favourites.
	 *
	 * @param productTitles Product titles
	 * @returns {Promise<void>}
	 */
	async checkIfProductTitlesExists(productTitles) {
		const favouritesPageProductTitles = await this.getProductTitles().then((titles) => titles);
		const isAddedASubset = await productTitles.every((val) => favouritesPageProductTitles.includes(val));
		return await isAddedASubset;
	}

	/**
	 * Add a product to favourites.
	 *
	 * @param productIndex Index of the product in the list.
	 * @returns {Promise<T | boolean>}
	 */
	async removeProductFromFavourites(productIndex) {
		let productContainer = null;
		const productContainers = await this.getProductContainers().then((containers) => containers);

		if (notDefined(productIndex)) {
			productContainer = await pickRandom(...productContainers);
		} else {
			productContainer = await productContainers[productIndex];
		}

		// scroll to this product
		await this.scrollTo(productContainer);
		const removedProductTitles = await this.getProductTitles([productContainer]).then((titles) => titles);

		await productContainer.findElement(this._removeFromFavouritesLocator).then((button) => {
			return button.click();
		}).catch(() => {
			// do nothing this means that the button already clicked previously.
			return false;
		});

		// refresh first the page
		await this.open();

		const exists = await this.checkIfProductTitlesExists(removedProductTitles);

		// check if the others are not removed
		await this.checkIfProductsExists();

		return await expect(!exists, 'Product was not removed from favourites!').to.be.true;
	}
}

module.exports.FavouritesPage = FavouritesPage;
