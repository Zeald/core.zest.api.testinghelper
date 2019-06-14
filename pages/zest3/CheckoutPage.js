const { By, until } = require('selenium-webdriver');
const { notDefined } = require('../../helpers/functions');
const { Page } = require('./Page');
const { ReceiptPage } = require('./ReceiptPage');

/**
 * Checkout page class
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
	 * @param directCreditParentWrapperLocator The wrapper activation locator of payment methods.
	 * @param enableLoginLocator The enable login locator.
	 * @param loginPasswordInputLocator The password input locator.
	 */
	constructor(webdriver, url, firstNameInputLocator, lastNameInputLocator, companyInputLocator, addressInputLocator,
		cityInputLocator, phoneInputLocator, emailInputLocator, directCreditInputLocator,
		placeOrderButtonLocator, directCreditParentWrapperLocator, enableLoginLocator, loginPasswordInputLocator) {
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
		this._directCreditParentWrapperLocator = directCreditParentWrapperLocator;
		this._enableLoginLocator = enableLoginLocator;
		this._loginPasswordInputLocator = loginPasswordInputLocator;

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
			By.xpath("//input[@id='login_email']") : this._emailInputLocator;
		this._directCreditInputLocator = notDefined(this._directCreditInputLocator) ?
			By.xpath("//option[contains(text(),'Direct Credit')]") : this._directCreditInputLocator;
		this._placeOrderButtonLocator = notDefined(this._placeOrderButtonLocator) ?
			By.xpath("//div[@id='co']//input[@name='mv_click'][contains(@value, 'Place Order')]") :
			this._placeOrderButtonLocator;
		this._directCreditParentWrapperLocator = notDefined(this._directCreditParentWrapperLocator) ?
			By.xpath("//select[@name='payment_method']") : this._directCreditParentWrapperLocator;
		this._enableLoginLocator = notDefined(this._enableLoginLocator) ?
			By.xpath("//div[@id='c524']//tr[2]//td[1]//input[1]") : this._enableLoginLocator;
		this._loginPasswordInputLocator = notDefined(this._loginPasswordInputLocator) ?
			By.xpath("//input[@id='login_password']") : this._loginPasswordInputLocator;
	}

	/**
	 * Set first name input locator
	 *
	 * @param value Locator
	 */
	set firstNameInputLocator(value) {
		this._firstNameInputLocator = value;
	}

	/**
	 * Set last name input locator
	 *
	 * @param value Locator
	 */
	set lastNameInputLocator(value) {
		this._lastNameInputLocator = value;
	}

	/**
	 * Set company input locator
	 *
	 * @param value Locator
	 */
	set companyInputLocator(value) {
		this._companyInputLocator = value;
	}

	/**
	 * Set address input locator
	 *
	 * @param value Locator
	 */
	set addressInputLocator(value) {
		this._addressInputLocator = value;
	}

	/**
	 * Set city input locator
	 *
	 * @param value Locator
	 */
	set cityInputLocator(value) {
		this._cityInputLocator = value;
	}

	/**
	 * Set phone input locator
	 *
	 * @param value Locator
	 */
	set phoneInputLocator(value) {
		this._phoneInputLocator = value;
	}

	/**
	 * Set email input locator
	 *
	 * @param value Locator
	 */
	set emailInputLocator(value) {
		this._emailInputLocator = value;
	}

	/**
	 * Set direct credit radio button locator
	 *
	 * @param value Locator
	 */
	set directCreditInputLocator(value) {
		this._directCreditInputLocator = value;
	}

	/**
	 * Set place order button locator
	 *
	 * @param value Locator
	 */
	set placeOrderButtonLocator(value) {
		this._placeOrderButtonLocator = value;
	}

	/**
	 * Set Payment method wrapper locator locator
	 *
	 * @param value Locator
	 */
	set directCreditParentWrapperLocator(value) {
		this._directCreditParentWrapperLocator = value;
	}

	/**
	 * Set enable login locator
	 *
	 * @param value Locator
	 */
	set enableLoginLocator(value) {
		this._enableLoginLocator = value;
	}

	/**
	 * Set login password input locator
	 *
	 * @param value Locator
	 */
	set loginPasswordInputLocator(value) {
		this._loginPasswordInputLocator = value;
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
	 * @param directCreditParentWrapperLocator The parent locator for direct credit.
	 * @returns {Promise<void>}
	 */
	async chooseDirectCredit(directCreditParentWrapperLocator) {
		const locator = notDefined(directCreditParentWrapperLocator) ?
			this._directCreditParentWrapperLocator : directCreditParentWrapperLocator;

		// open the payment methods selection
		await this._driver.findElement(locator).click();
		return await this._driver.findElement(this._directCreditInputLocator).click();
	}

	/**
	 * Inject login password
	 *
	 * @param password Password value.
	 * @param enableLoginLocator The locator of the element that will enable login.
	 * @param passwordFormLocator The password input locator.
	 * @returns {Promise<void>}
	 */
	async injectLoginPassword(password, enableLoginLocator, passwordFormLocator) {
		const enableLocator = notDefined(enableLoginLocator) ? this._enableLoginLocator : enableLoginLocator;
		const passwordLocator = notDefined(passwordFormLocator) ? this._loginPasswordInputLocator: passwordFormLocator;

		// enable login
		// Implement a way to use other selector for other catalog.
		await this._driver.findElement(enableLocator).click();
		await this._driver.wait(until.elementLocated(passwordLocator), 3000).sendKeys(password);
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
}

module.exports.CheckoutPage = CheckoutPage;
