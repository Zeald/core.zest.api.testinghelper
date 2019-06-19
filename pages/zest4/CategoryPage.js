const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { notDefined, pickRandom } = require('../../helpers/functions');
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
	 * @param catViewLocator The category view locator.
	 * @param productLinkLocator The product view locator.
	 * @param filterGroupLocator The locator for filter groups.
	 * @param filtersLocator The locator for filter items.
	 */
	constructor(webdriver, url, catViewLocator, productLinkLocator, filterGroupLocator, filtersLocator) {
		super(webdriver, url);

		this._catViewLocator = catViewLocator;
		this._productLinkLocator = productLinkLocator;
		this._filterGroupLocator = filterGroupLocator;
		this._filtersLocator = filtersLocator;

		// initialize locators if not defined
		this._catViewLocator = notDefined(this._catViewLocator) ?
			By.css('div.catview') : this._catViewLocator;
		this._productLinkLocator = notDefined(this._productLinkLocator) ?
			By.css('.product-collection .product-card a') : this._productLinkLocator;
		this._filterGroupLocator = notDefined(this._filterGroupLocator) ?
			By.css('.filter-collection > .filter-group') : this._filterGroupLocator;
		this._filtersLocator = notDefined(this._filtersLocator) ?
			By.css('ul > li.filter') : this._filtersLocator;
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
	 * Apply random product filter
	 *
	 * @returns {Promise<void>}
	 */
	async applyRandomProductFilter() {
		const filterGroups = await this._driver.findElements(this._filterGroupLocator).then((groups) => groups);

		// pick a filter group
		const filterGroup = await pickRandom(...filterGroups);
		// pick a filter to click
		const filters = await filterGroup.findElements(this._filtersLocator).then((filters) => filters);
		const filter = await pickRandom(...filters);

		// click and check
		await filter.click();

		// TODO: wait until products view is loaded

		return await filter;
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
