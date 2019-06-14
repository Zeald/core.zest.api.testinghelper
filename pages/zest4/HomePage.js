const { By } = require('selenium-webdriver');
const { Page } = require('./Page');
const { CheckoutPage } = require('./CheckoutPage');
const { ContactUs } = require('./ContactUs');
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
	 */
	constructor(webdriver, url, closeModalButtonLocator, cartLocator, checkoutButtonLocator, contactUsLocator) {
		super(webdriver, url, closeModalButtonLocator);
		this._cartLocator = cartLocator;
		this._checkoutButtonLocator = checkoutButtonLocator;
		this._contactUsLocator = contactUsLocator;

		// initialize locators if not defined
		this._cartLocator = notDefined(this._cartLocator) ? By.id('mini-cart') : this._cartLocator;
		this._checkoutButtonLocator = notDefined(this._checkoutButtonLocator) ?
			By.id('checkout') : this._checkoutButtonLocator;
		this._contactUsLocator = notDefined(this._contactUsLocator) ?
			By.xpath("//a[contains(text(),'Contact Us')]") : this._contactUsLocator;
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
}

module.exports.HomePage = HomePage;
