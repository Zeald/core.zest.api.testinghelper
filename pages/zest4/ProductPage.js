const { By } = require('selenium-webdriver');
const { notDefined } = require('../../helpers/functions');
const { Page } = require('./Page');
const { EnquirePage } = require('./EnquirePage');

/**
 * Product Page class
 *
 */
class ProductPage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param addToCartButtonLocator The locator for add to cart button.
	 * @param enquireButtonSelector The locator for enquire cart button.
	 * @param closeModalButtonLocator The locator for close modal button.
	 */
	constructor(webdriver, url, addToCartButtonLocator, enquireButtonSelector, closeModalButtonLocator) {
		super(webdriver, url, closeModalButtonLocator);

		this._addToCartButtonLocator = addToCartButtonLocator;
		this._enquireButtonSelector = enquireButtonSelector;

		// initialize locators if not defined
		this._addToCartButtonLocator = notDefined(this._addToCartButtonLocator) ?
			By.xpath("//button[contains(text(),'Add to cart')]") : this._addToCartButtonLocator;
		this._enquireButtonSelector = notDefined(this._enquireButtonSelector) ?
			By.xpath("//a[@class='zbtn' and contains(@href,'enquiry')]") : this._enquireButtonSelector;
	}

	/**
	 * Set add to cart button locator
	 *
	 * @param value Locator
	 */
	set addToCartButtonLocator(value) {
		this._addToCartButtonLocator = value;
	}

	/**
	 * Set enquire button selector
	 *
	 * @param value Locator
	 */
	set enquireButtonSelector(value) {
		this._enquireButtonSelector = value;
	}

	/**
	 * Click the add to cart button
	 *
	 * @returns {Promise<!Promise<void>|*|!LegacyActionSequence|!Actions|never|void>}
	 */
	async clickAddToCart() {
		return await this._driver.findElement(this._addToCartButtonLocator).click();
	}

	/**
	 * Click the add to cart button
	 *
	 * @returns {Promise<!Promise<void>|*|!LegacyActionSequence|!Actions|never|void>}
	 */
	async clickEnquire() {
		return await this._driver.findElement(this._enquireButtonSelector).click();
	}

	/**
	 * Click the enquire button | currently causing timeout.
	 *
	 * @returns {Promise<!Promise<void>|*|!LegacyActionSequence|!Actions|never|void>}
	 */
	async clickEnquireButton() {
		const enquireLink = await this._driver.findElement(this._enquireButtonSelector);

		const actions = await this._driver.actions({ bridge: true });
		// move the mouse to this link element to make it clickable
		await actions.move({
			duration: 5000,
			origin: enquireLink,
			x: 0,
			y: 0
		}).perform();

		// now click it
		await actions.click(enquireLink).perform();
	}

	/**
	 * Open the enquire page
	 *
	 * @returns {Promise<void>}
	 */
	async openEnquire() {
		const enquireLink = await this._driver.findElement(this._enquireButtonSelector);
		const url = await enquireLink.getAttribute('href').then((url) => url);

		const enquirePage = await new EnquirePage(this._driver, url);
		await enquirePage.open();
		return await enquirePage;
	}
}

module.exports.ProductPage = ProductPage;
