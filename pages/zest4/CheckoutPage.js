const { By } = require('selenium-webdriver');
const { expect } = require('chai');
const { Page } = require('./Page');
const { ReceiptPage } = require('./ReceiptPage');
const { notDefined } = require('../../helpers/functions');

/**
 * Checkout Page class
 *
 */
class CheckoutPage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param firstNameInputLocator The first name input form locator.
	 * @param lastNameInputLocator The last name input form locator.
	 * @param companyInputLocator The company input form locator.
	 * @param addressInputLocator The address input form locator.
	 * @param cityInputLocator The city input form locator.
	 * @param phoneInputLocator The phone input form locator.
	 * @param emailInputLocator The email input form locator.
	 * @param directCreditInputLocator The direct credit locator.
	 * @param placeOrderButtonLocator The place order button locator.
	 */
	constructor(webdriver, url, firstNameInputLocator, lastNameInputLocator, companyInputLocator, addressInputLocator,
		cityInputLocator, phoneInputLocator, emailInputLocator, directCreditInputLocator, placeOrderButtonLocator) {
		super(webdriver, url);
		this._firstNameInputLocator = firstNameInputLocator;
		this._lastNameInputLocator = lastNameInputLocator;
		this._companyInputLocator = companyInputLocator;
		this._addressInputLocator = addressInputLocator;
		this._cityInputLocator = cityInputLocator;
		this._phoneInputLocator = phoneInputLocator;
		this._emailInputLocator = emailInputLocator;
		this._directCreditInputLocator = directCreditInputLocator;
		this._placeOrderButtonLocator = placeOrderButtonLocator;

		// initialize locators if not defined
		this._firstNameInputLocator = notDefined(this._firstNameInputLocator) ?
			By.xpath("//input[@name='b_fname']") : this._firstNameInputLocator;
		this._lastNameInputLocator = notDefined(this._lastNameInputLocator) ?
			By.xpath("//input[@name='b_lname']") : this._lastNameInputLocator;
		this._companyInputLocator = notDefined(this._companyInputLocator) ?
			By.xpath("//input[@name='b_company']") : this._companyInputLocator;
		this._addressInputLocator = notDefined(this._addressInputLocator) ?
			By.xpath("//input[@name='b_address1']") : this._addressInputLocator;
		this._cityInputLocator = notDefined(this._cityInputLocator) ?
			By.xpath("//input[@name='b_city']") : this._cityInputLocator;
		this._phoneInputLocator = notDefined(this._phoneInputLocator) ?
			By.xpath("//input[@name='b_phone']") : this._phoneInputLocator;
		this._emailInputLocator = notDefined(this._emailInputLocator) ?
			By.xpath("//input[@name='email']") : this._emailInputLocator;
		this._directCreditInputLocator = notDefined(this._directCreditInputLocator) ?
			By.xpath("//input[@value='directcredit'][@type='radio']") : this._directCreditInputLocator;
		this._placeOrderButtonLocator = notDefined(this._placeOrderButtonLocator) ?
			By.xpath("//*[contains(@value, 'Place Order')]") : this._placeOrderButtonLocator;
	}

	/**
	 * first name input
	 *
	 * @param value Locator
	 */
	set firstNameInputLocator(value) {
		this._firstNameInputLocator = value;
	}

	/**
	 * last name input
	 *
	 * @param value Locator
	 */
	set lastNameInputLocator(value) {
		this._lastNameInputLocator = value;
	}

	/**
	 * company input
	 *
	 * @param value Locator
	 */
	set companyInputLocator(value) {
		this._companyInputLocator = value;
	}

	/**
	 * address input
	 *
	 * @param value Locator
	 */
	set addressInputLocator(value) {
		this._addressInputLocator = value;
	}

	/**
	 * city input
	 *
	 * @param value Locator
	 */
	set cityInputLocator(value) {
		this._cityInputLocator = value;
	}

	/**
	 * phone input
	 *
	 * @param value Locator
	 */
	set phoneInputLocator(value) {
		this._phoneInputLocator = value;
	}

	/**
	 * email input
	 *
	 * @param value Locator
	 */
	set emailInputLocator(value) {
		this._emailInputLocator = value;
	}

	/**
	 * direct credit radio button
	 *
	 * @param value Locator
	 */
	set directCreditInputLocator(value) {
		this._directCreditInputLocator = value;
	}

	/**
	 * place order button
	 *
	 * @param value Locator
	 */
	set placeOrderButtonLocator(value) {
		this._placeOrderButtonLocator = value;
	}

	/**
	 * Fill in first name form
	 *
	 * @param data Data
	 * @returns {Promise<void>}
	 */
	async fillFirstNameInput(data) {
		return await this._driver.findElement(this._firstNameInputLocator).sendKeys(data);
	}

	/**
	 * Fill in last name form
	 *
	 * @param data Data
	 * @returns {Promise<void>}
	 */
	async fillLastNameInput(data) {
		return await this._driver.findElement(this._lastNameInputLocator).sendKeys(data);
	}

	/**
	 * Fill in company form
	 *
	 * @param data Data
	 * @returns {Promise<void>}
	 */
	async fillCompanyInput(data) {
		return await this._driver.findElement(this._companyInputLocator).sendKeys(data);
	}

	/**
	 * Fill in city form
	 *
	 * @param data Data
	 * @returns {Promise<void>}
	 */
	async fillCityInput(data) {
		return await this._driver.findElement(this._cityInputLocator).sendKeys(data);
	}

	/**
	 * Fill in address form
	 *
	 * @param data Data
	 * @returns {Promise<void>}
	 */
	async fillAddressInput(data) {
		return await this._driver.findElement(this._addressInputLocator).sendKeys(data);
	}

	/**
	 * Fill in phone form
	 *
	 * @param data Data
	 * @returns {Promise<void>}
	 */
	async fillPhoneInput(data) {
		return await this._driver.findElement(this._phoneInputLocator).sendKeys(data);
	}

	/**
	 * Fill in email form
	 *
	 * @param data Data
	 * @returns {Promise<void>}
	 */
	async fillEmailInput(data) {
		return await this._driver.findElement(this._emailInputLocator).sendKeys(data);
	}

	/**
	 * Choose direct credit
	 *
	 * @returns {Promise<void>}
	 */
	async chooseDirectCredit() {
		return await this._driver.findElement(this._directCreditInputLocator).click();
	}

	/**
	 * Click place order
	 *
	 * @returns {Promise<void>}
	 */
	async clickPlaceOrder() {
		await this._driver.findElement(this._placeOrderButtonLocator).click();
		// instantiate receipt page
		const currentURL = await this._driver.getCurrentUrl().then((url) => url);
		return await new ReceiptPage(this._driver, currentURL);
	}

	/**
	 * Verify if the url provided is indeed the checkout page
	 *
	 * @returns {Promise<*>}
	 */
	async verifyCheckoutPage() {
		return await expect(this._url).to.match(/checkout\.html/);
	}
}

module.exports.CheckoutPage = CheckoutPage;
