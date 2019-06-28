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

		// initialize locators if not defined
		this._orderReceiptSectionLocator = notDefined(orderReceiptSectionLocator) ?
			By.xpath("//div[@class='component_OrderProcess_Receipt']") : orderReceiptSectionLocator;
		this._orderNumberLocator = notDefined(orderNumberLocator) ?
			By.xpath("//*[contains(text(),'ORD')]") : orderNumberLocator;
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
		const zestApi = await new ZestApi({ apiBaseURL, apiKey });
		// get the order number
		const orderNumber = await this.getOrderNumber().then((orderNumber) => orderNumber);
		const order = await zestApi.transaction(orderNumber).then((order) => order);
		return await expect(order, 'Order not found!').to.not.be.null;
	}

	/**
	 * Check if there is acknowledgment email entry for the order.
	 *
	 * @param apiBaseURL Zest API Base URL
	 * @param apiKey Zest API Key
	 * @param apiEmailLogBaseURL The base url of the email.log.
	 * @returns {Promise<*>}
	 */
	async verifyOrderAcknowledgmentEmail(apiBaseURL, apiKey, apiEmailLogBaseURL) {
		const zestApi = await new ZestApi({ apiBaseURL, apiKey, apiEmailLogBaseURL });
		// get the order number
		const orderNumber = await this.getOrderNumber().then((orderNumber) => orderNumber);
		const matches = await zestApi.checkOrderAcknowledgmentEmail(orderNumber, 'email.log', 20)
			.then((matches) => matches);
		const result = await !notDefined(matches) && matches.length > 0;
		return await expect(result, `No acknowledgment email for order ${orderNumber}`).to.be.true;
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
