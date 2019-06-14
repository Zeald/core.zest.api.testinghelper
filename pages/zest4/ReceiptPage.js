const { By } = require('selenium-webdriver');
const { expect } = require('chai');
const { notDefined } = require('../../helpers/functions');
const { Page } = require('./Page');

/**
 * Receipt page class
 *
 */
class ReceiptPage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param orderReceiptSectionLocator The locator for the order receipt section.
	 * @param orderNumberLocator The locator for the order number container.
	 */
	constructor(webdriver, url, orderReceiptSectionLocator, orderNumberLocator) {
		super(webdriver, url);
		this._orderReceiptSectionLocator = orderReceiptSectionLocator;
		this._orderNumberLocator = orderNumberLocator;

		// initialize locators if not defined
		this._orderReceiptSectionLocator = notDefined(this._orderReceiptSectionLocator) ?
			By.xpath("//div[@class='component_OrderProcess_Receipt']") : this._orderReceiptSectionLocator;
		this._orderNumberLocator = notDefined(this._orderNumberLocator) ?
			By.xpath("//*[contains(text(),'ORD')]") : this._orderNumberLocator;
	}

	/**
	 * Verify receipt page
	 *
	 * @returns {Promise<*>}
	 */
	async verifyReceiptPage() {
		return await expect(this._url).to.match(/receipt\.html/);
	}

	/**
	 * Get the receipt section
	 *
	 * @returns {Promise<void>}
	 */
	async getReceiptSection() {
		return await this._driver.findElement(this._orderReceiptSectionLocator);
	}

	/**
	 * Get order number
	 *
	 * @returns {Promise<void>}
	 */
	async getOrderNumber() {
		return await this._driver.findElement(this._orderNumberLocator);
	}
}

module.exports.ReceiptPage = ReceiptPage;
