const { By, until } = require('selenium-webdriver');
const { SuperCategoryPage } = require('./SuperCategoryPage');
const { notDefined } = require('../../helpers/functions');

/**
 * SearchResultPage class
 *
 */
class SearchResultPage extends SuperCategoryPage {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param closeModalButtonLocator The locator for close modal button.
	 * @param searchInputLocator The search input field locator.
	 * @param searchButtonLocator The search button locator.
	 * @param searchResultLocator The search result locator.
	 */
	constructor(webdriver, url, closeModalButtonLocator, searchInputLocator, searchButtonLocator, searchResultLocator) {
		super(webdriver, url, closeModalButtonLocator);

		this._searchInputLocator = notDefined(searchInputLocator) ?
			By.css("form.search-form > input[type='search']") : searchInputLocator;
		this._searchButtonLocator = notDefined(searchButtonLocator) ?
			By.css("form.search-form > button[type='submit']") : searchButtonLocator;
		this._searchResultLocator = notDefined(searchResultLocator) ?
			By.css('.title.search') : searchResultLocator;
	}

	/**
	 * Set search input locator
	 *
	 * @param value Locator
	 */
	set searchInputLocator(value) {
		this._searchInputLocator = value;
	}

	/**
	 * Set search button locator
	 *
	 * @param value Locator
	 */
	set searchButtonLocator(value) {
		this._searchButtonLocator = value;
	}

	/**
	 * Set search result locator
	 *
	 * @param value Locator
	 */
	set searchResultLocator(value) {
		this._searchResultLocator = value;
	}

	/**
	 * Search a term
	 *
	 * @param term String to search.
	 * @returns {Promise<void>}
	 */
	async searchTerm(term) {
		const testTerm = await !notDefined(term);
		await expect(testTerm, 'Search term is empty!').to.be.true;

		// execute the search
		const searchInput = await this._driver.findElement(this._searchInputLocator);
		await searchInput.sendKeys(term);
		const searchButton = await this._driver.findElement(this._searchButtonLocator);
		await searchButton.click();

		// in case modal pops up
		await this.closeModalIfExist();

		// check if result contains the search term
		await this._driver.wait(until.elementLocated(this._searchResultLocator), 10000);

		this._url = await this._driver.getCurrentUrl().then((url) => url);
	}

	/**
	 * Get the title search text
	 *
	 * @returns {Promise<string>}
	 */
	async getTitleSearchText() {
		// get the title search content
		return await this._driver.findElement(this._searchResultLocator).getText().then((text) => text);
	}

	/**
	 * Get the titles of the searched products
	 *
	 * @returns {Promise<any[]>}
	 */
	async getSearchedProductTitles() {
		return await this.getProductTitles();
	}
}

module.exports.SearchResultPage = SearchResultPage;
