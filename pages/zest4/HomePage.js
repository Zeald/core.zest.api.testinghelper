const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { Page } = require('./Page');
const { CheckoutPage } = require('./CheckoutPage');
const { ContactUs } = require('./ContactUs');
const { SearchResultPage } = require('./SearchResultPage');
const { notDefined } = require('../../helpers/functions');

/**
 * Home page class
 *
 */
class HomePage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param closeModalButtonLocator The locator for close modal button.
	 * @param cartLocator The cart icon locator.
	 * @param checkoutButtonLocator The checkout button locator.
	 * @param contactUsLocator The contact us link locator.
	 * @param searchInputLocator The search input field locator.
	 * @param searchButtonLocator The search button locator.
	 * @param searchResultLocator The search result locator.
	 */
	constructor(webdriver, url, closeModalButtonLocator, cartLocator, checkoutButtonLocator, contactUsLocator,
				searchInputLocator, searchButtonLocator, searchResultLocator) {
		super(webdriver, url, closeModalButtonLocator);

		// initialize locators if not defined
		this._cartLocator = notDefined(cartLocator) ?
			By.id('mini-cart') : cartLocator;
		this._checkoutButtonLocator = notDefined(checkoutButtonLocator) ?
			By.id('checkout') : checkoutButtonLocator;
		this._contactUsLocator = notDefined(contactUsLocator) ?
			By.xpath("//a[contains(text(),'Contact Us')]") : contactUsLocator;
		this._searchInputLocator = notDefined(searchInputLocator) ?
			By.css("form.search-form > input[type='search']") : searchInputLocator;
		this._searchButtonLocator = notDefined(searchButtonLocator) ?
			By.css("form.search-form > button[type='submit']") : searchButtonLocator;
		this._searchResultLocator = notDefined(searchResultLocator) ?
			By.css('.title.search') : searchResultLocator;
	}

	/**
	 * Set cart locator
	 *
	 * @param value Locator
	 */
	set cartLocator(value) {
		this._cartLocator = value;
	}

	/**
	 * Set checkout button locator
	 *
	 * @param value Locator
	 */
	set checkoutButtonLocator(value) {
		this._checkoutButtonLocator = value;
	}

	/**
	 * Set contact us locator
	 *
	 * @param value Locator
	 */
	set contactUsLocator(value) {
		this._contactUsLocator = value;
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
	 * Get category URL
	 *
	 * @param childNumber The index of the child.
	 * @returns {Promise<?string>} Category URL
	 */
	async getCategoryURL(childNumber) {
		const childIndex = notDefined(childNumber) ? 1 : childNumber;

		// get the link of the first category that can be grabbed.
		return await this._driver.findElement(
			By.css('.component_Navigation_ContentTabs .ct_has_dropdown:nth-child('+childIndex+') a')
		).getAttribute('href').then((url) => url);
	}

	/**
	 * Click the cart
	 *
	 * @returns {!Promise<void>}
	 */
	async clickCart() {
		return await this._driver.findElement(this._cartLocator).click();
	}

	/**
	 * Click checkout
	 *
	 * @returns {!Promise<void>}
	 */
	async clickCheckoutButton() {
		await this._driver.findElement(this._checkoutButtonLocator).click();
		// get the current url now after click
		const currentURL = await this._driver.getCurrentUrl().then((url) => url);
		return await new CheckoutPage(this._driver, currentURL);
	}

	/**
	 * Click contact us link if exist
	 *
	 * @returns {Promise<void>}
	 */
	async clickIfContactUsLinkExist() {
		const clickSuccess = await this.clickIfExist(this._contactUsLocator);

		const args = [
			this._driver,
			this._url+'Contact+Us'
		];

		if (clickSuccess) {
			// link do exist then get the url and instantiate new Contact Us page
			args[1] = await this._driver.getCurrentUrl().then((url) => url);
		} else {
			// manually open
			await this._driver.get(this._url+'Contact+Us');
			args[1] = await this._driver.getCurrentUrl().then((url) => url);
		}

		return await new ContactUs(...args);
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

		const currentURL = await this._driver.getCurrentUrl().then((url) => url);
		return await new SearchResultPage(this._driver, currentURL);
	}
}

module.exports.HomePage = HomePage;
