const { By } = require('selenium-webdriver');
const { notDefined } = require('../../helpers/functions');
const { Page } = require('./Page');

/**
 * Product page class
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
			By.css('.btn_addcart, .add_to_cart_button') : this._addToCartButtonLocator;
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
	 * Set enquire button locator
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
}

module.exports.ProductPage = ProductPage;
