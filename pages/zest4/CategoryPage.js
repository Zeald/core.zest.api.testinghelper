const { notDefined, pickRandom } = require('../../helpers/functions');
const { SuperCategoryPage } = require('./SuperCategoryPage');
const { FavouritesPage } = require('./FavouritesPage');
const { ProductPage } = require('./ProductPage');

/**
 * Category Page class
 *
 */
class CategoryPage extends SuperCategoryPage {
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
	 * Open favourites page.
	 *
	 * @returns {Promise<FavouritesPage>}
	 */
	async openFavourites() {
		await this._driver.findElement(this._favouritesPageButtonLocator).click();
		// instantiate favourites page.
		await this.waitReadyState();
		const favouritesPageURL = await this._driver.getCurrentUrl().then((url) => url);
		return await new FavouritesPage(this._driver, favouritesPageURL);
	}

	/**
	 * Open a product through a container that has option.
	 *
	 * @param productIndex Index of the product in the list.
	 * @returns {Promise<ProductPage>}
	 */
	async openProductWithOption(productIndex) {
		let productContainer = null;
		const productContainers = await this.getProductContainersWithOptions();

		if (notDefined(productIndex)) {
			productContainer = await pickRandom(...productContainers);
		} else {
			productContainer = await productContainers[productIndex];
		}

		// click to open and instantiate product page class.
		return await this.openProductContainer(productContainer);
	}

	/**
	 * Open a product through a container that don't have option.
	 *
	 * @param productIndex Index of the product in the list.
	 * @returns {Promise<ProductPage>}
	 */
	async openProductWithNoOption(productIndex) {
		let productContainer = null;
		const productContainers = await this.getProductContainersWithNoOptions();

		if (notDefined(productIndex)) {
			productContainer = await pickRandom(...productContainers);
		} else {
			productContainer = await productContainers[productIndex];
		}

		// click to open and instantiate product page class.
		return await this.openProductContainer(productContainer);
	}

	/**
	 * Open a product through a container.
	 *
	 * @param productIndex Index of the product in the list.
	 * @returns {Promise<ProductPage>}
	 */
	async openProduct(productIndex) {
		let productContainer = null;
		const productContainers = await this.getProductContainers();

		if (notDefined(productIndex)) {
			productContainer = await pickRandom(...productContainers);
		} else {
			productContainer = await productContainers[productIndex];
		}

		// click to open and instantiate product page class.
		return await this.openProductContainer(productContainer);
	}

	/**
	 * Click and open a product container.
	 *
	 * @param container Container element of the product.
	 * @returns {Promise<ProductPage>}
	 */
	async openProductContainer(container) {
		// click to open and instantiate product page class.
		await container.click();
		await this.waitReadyState();

		const currentURL = await this._driver.getCurrentUrl().then((url) => url);
		return await new ProductPage(this._driver, currentURL);
	}
}

module.exports.CategoryPage = CategoryPage;
