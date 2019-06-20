const { until, By } = require('selenium-webdriver');
const { notDefined } = require('../../helpers/functions');

/**
 * Page helper class
 *
 */
class Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param closeModalButtonLocator The locator for close modal button.
	 */
	constructor(webdriver, url, closeModalButtonLocator) {
		this._driver = webdriver;
		this._url = url;
		this._closeModalButtonLocator = closeModalButtonLocator;

		// explicit sleep in milliseconds for every action
		this._explicitSleep = 3000;

		// set the default locator of modal if not specified
		this._closeModalButtonLocator = notDefined(this._closeModalButtonLocator) ?
			By.className('mc-closeModal') : this._closeModalButtonLocator;
	}

	/**
	 * Web driver
	 *
	 * @param value Selenium web driver.
	 */
	set webdriver(value) {
		this._driver = value;
	}

	/**
	 * url
	 *
	 * @param value The url of the page.
	 */
	set url(value) {
		this._url = value;
	}

	/**
	 * Close modal button locator
	 *
	 * @param value The locator for close modal button.
	 */
	set closeModalButtonLocator(value) {
		this._closeModalButtonLocator = value;
	}

	/**
	 * Set explicit sleep in milliseconds
	 *
	 * @param value Sleep length in milliseconds
	 */
	set explicitSleep(value) {
		this._explicitSleep = value;
	}

	/**
	 * Open the page
	 *
	 * @returns {Promise<void>}
	 */
	async open() {
		await this._driver.get(this._url);
		// wait for the ready state
		await this.waitReadyState();
	}

	/**
	 * Wait for the ready state of the page.
	 *
	 * @returns {Promise<any>}
	 */
	async waitReadyState() {
		return await this._driver.wait(() => {
			return this._driver.executeScript('return document.readyState').then((readyState) => {
				return readyState === 'complete';
			});
		});
	}

	/**
	 * Specialized way to click an element especially when the element is not clickable even page is fully loaded.
	 *
	 * @param element HTML element
	 * @returns {Promise<void>}
	 */
	async executorClick(element) {
		return await this._driver.executeScript('arguments[0].click();', element);
	}

	/**
	 * Scroll to the element
	 *
	 * @param element HTML element
	 * @returns {Promise<void>}
	 */
	async scrollTo(element) {
		return await this._driver.executeScript('arguments[0].scrollIntoView();', element);
	}

	/**
	 * Hover mouse to the element
	 *
	 * @param element HTML element
	 * @returns {Promise<void>}
	 */
	async hoverTo(element) {
		return await this._driver.actions().mouseMove(element, { x: 5, y: 5 }).perform();
	}

	/**
	 * Perform pause or sleep
	 *
	 * @param timeout Time out in milliseconds
	 * @returns {Promise<void>}
	 */
	async performSleep(timeout) {
		const time = notDefined(timeout) ? this._explicitSleep : timeout;
		return await this._driver.sleep(time);
	}

	/**
	 * Close modal button if exist. Very useful for the annoying modal of neptunes.
	 *
	 * @param closeButtonLocator The locator for close button.
	 * @returns {Promise<T | boolean>}
	 */
	async closeModalIfExist(closeButtonLocator) {
		const locator = closeButtonLocator === undefined ? this._closeModalButtonLocator : closeButtonLocator;
		// close the register modal since everything not clickable at this point.
		return await this._driver.wait(until.elementLocated(locator), 5000).then(async (modal) => {
			const registerModalVisible = await modal.isDisplayed().then((visible) => visible);
			if (registerModalVisible) {
				await modal.click();
				return true;
			}

			return false;
		}).catch((err) => false);
	}

	/**
	 * Click if exist
	 *
	 * @param locator The locator for the element to be clicked.
	 * @returns {Promise<boolean>}
	 */
	async clickIfExist(locator) {
		return await this._driver.findElement(locator).then(async (elem) => {
			await elem.click();
			return true;
		}).catch((err) => false);
	}

	/**
	 * Check if page not found
	 *
	 * @returns {Promise<T | boolean>}
	 */
	async pageNotFound() {
		return await this._driver.wait(until.titleContains('404 - Page not found'), 2000).then((result) => {
			if (result) {
				return true;
			}
		}).catch((err) => false);
	}
}

module.exports.Page = Page;

