const { By } = require('selenium-webdriver');
const { expect } = require('chai');
const { notDefined } = require('../../helpers/functions');
const { ZestApi } = require('../../helpers/ZestApi');
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
	 * Set order receipt section locator
	 *
	 * @param value Locator
	 */
	set orderReceiptSectionLocator(value) {
		this._orderReceiptSectionLocator = value;
	}

	/**
	 * Set order number locator
	 *
	 * @param value Locator
	 */
	set orderNumberLocator(value) {
		this._orderNumberLocator = value;
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
	 * Verify order number via API
	 *
	 * @param apiBaseURL Zest API Base URL
	 * @param apiKey Zest API Key
	 * @returns {Promise<properties.null|{enum}|string>}
	 */
	async verifyOrderNumberViaAPI(apiBaseURL, apiKey) {
		const zestApi = await new ZestApi(apiBaseURL, apiKey);
		// get the order number
		const orderNumber = await this.getOrderNumber().then((orderNumber) => orderNumber);
		const order = await zestApi.transaction(orderNumber).then((order) => order);
		return expect(order).to.not.be.null;
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
	 * @returns {Promise<string>}
	 */
	async getOrderNumber() {
		return await this._driver.findElement(this._orderNumberLocator).getText().then((text) => text.trim());
	}
}

module.exports.ReceiptPage = ReceiptPage;
