const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { notDefined } = require('../../helpers/functions');
const { Page } = require('./Page');

/**
 * Category Page class
 *
 */
class CategoryPage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param catViewLocator The category view locator
	 * @param productLinkLocator The product view locator
	 */
	constructor(webdriver, url, catViewLocator, productLinkLocator) {
		super(webdriver, url);

		this._catViewLocator = catViewLocator;
		this._productLinkLocator = productLinkLocator;

		// initialize locators if not defined
		this._catViewLocator = notDefined(this._catViewLocator) ?
			By.css('div.catview') : this._catViewLocator;
		this._productLinkLocator = notDefined(this._productLinkLocator) ?
			By.css('.product-collection .product-card a') : this._productLinkLocator;
	}

	/**
	 * Set category view locator
	 *
	 * @param value Locator2
	 */
	set catViewLocator(value) {
		this._catViewLocator = value;
	}

	/**
	 * Set product link locator
	 *
	 * @param value Locator
	 */
	set productLinkLocator(value) {
		this._productLinkLocator = value;
	}

	/**
	 * Get the product url
	 *
	 * @returns {Promise<any[]|*>}
	 */
	async getProductURLs() {
		// locate the cat view
		const catView = await this._driver.findElement(this._catViewLocator);
		// wait a bit until it is visible
		await this._driver.wait(until.elementIsVisible(catView), 2000);
		// get product links
		let productURLs = await catView.findElements(this._productLinkLocator);

		if (productURLs.length === 0) {
			// use the zest 3 selectors
			productURLs = await catView.findElements(By.css('.item-list .item-cell a'));
		}

		this.productURLs = await this.resolveURLs(productURLs).then((urls) => urls);
		return this.productURLs;
	}

	/**
	 * Verify if products do exist in this certain category.
	 *
	 * @param categoryURL The URL of the category.
	 * @returns {Promise<*>}
	 */
	async checkIfProductsExists(categoryURL) {
		if (!notDefined(categoryURL)) {
			this._url = categoryURL;
			await this.open();
		}

		const productURLs = await this.getProductURLs().then((urls) => urls);

		const exists = productURLs && Array.isArray(productURLs) && productURLs.length > 0;
		return await expect(exists, 'Category products does not exist!').to.be.true;
	}

	/**
	 * Resolve url promises to extract href attribute
	 *
	 * @param urlPromises URL element promises
	 * @return {Promise<any[]>}
	 */
	async resolveURLs(urlPromises) {
		const promises = [];
		urlPromises.forEach((element) => {
			promises.push(element.getAttribute('href'));
		});

		return Promise.all(promises);
	}
}

module.exports.CategoryPage = CategoryPage;
