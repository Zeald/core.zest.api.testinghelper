const { By } = require('selenium-webdriver');
const { notDefined } = require('../../helpers/functions');
const { Page } = require('./Page');
const { CheckoutPage } = require('./CheckoutPage');
const { ContactUs } = require('./ContactUs');

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
	 * @param cartLocator The cart icon locator.
	 * @param checkoutButtonLocator The checkout button locator.
	 * @param contactUsLocator The contact us link locator.
	 */
	constructor(webdriver, url, cartLocator, checkoutButtonLocator, contactUsLocator) {
		super(webdriver, url);
		this._cartLocator = cartLocator;
		this._checkoutButtonLocator = checkoutButtonLocator;
		this._contactUsLocator = contactUsLocator;

		// initialize locators if not defined
		this._cartLocator = notDefined(this._cartLocator) ?
			By.css('div#mini_cart a:first-of-type') : this._cartLocator;
		this._checkoutButtonLocator = notDefined(this._checkoutButtonLocator) ?
			By.css('input.btn_cart_co[type=submit]') : this._checkoutButtonLocator;
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
		const tabLinks = await this._driver.findElements(
			By.css('.component_Navigation_ContentTabs li.ct_has_dropdown'));

		return await tabLinks[childIndex - 1].findElement(By.css('a:first-of-type'))
			.getAttribute('href').then((url) => url);
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
		await await this._driver.findElement(this._checkoutButtonLocator).click();
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
			this._url+'Contact+Us',
			By.className('mc-closeModal'),
			By.xpath("//input[@name='from_email']"),
			By.xpath("//input[@name='fname']"),
			By.xpath("//input[@name='lname']"),
			null,
			By.xpath("//input[@name='query_sku']"),
			By.xpath("//textarea[@name='enquiry_text']"),
			By.xpath("//input[@name='antispam']"),
			By.xpath("//input[@name='antispam_encoded']"),
			By.xpath("//input[@name='submit_button']")
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
