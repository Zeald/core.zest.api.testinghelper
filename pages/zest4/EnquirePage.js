const { By } = require('selenium-webdriver');
const { Page } = require('./Page');
const { EnquiryReceiptPage } = require('./EnquiryReceiptPage');
const { notDefined } = require('../../helpers/functions');
const reverseMd5 = require('reverse-md5');

/**
 * Enquire Page class
 *
 */
class EnquirePage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param closeModalButtonLocator The locator for close modal button.
	 * @param fromEmailInputLocator The from email input form locator.
	 * @param firstNameInputLocator The first name input form locator.
	 * @param lastNameInputLocator The last name input form locator.
	 * @param subjectInputLocator The subject input form locator.
	 * @param enquiryInputLocator The enquiry input form locator.
	 * @param captchaInputLocator The captcha input form locator.
	 * @param hashedCaptchaInputLocator The hashed value hidden input form locator.
	 * @param submitButtonLocator The locator for submit button.
	 */
	constructor(webdriver, url, closeModalButtonLocator, fromEmailInputLocator, firstNameInputLocator,
				lastNameInputLocator, subjectInputLocator, enquiryInputLocator, captchaInputLocator,
				hashedCaptchaInputLocator, submitButtonLocator) {
		super(webdriver, url, closeModalButtonLocator);

		// initialize locators if not defined
		this._fromEmailInputLocator = notDefined(fromEmailInputLocator) ?
			By.xpath("//input[@name='from_email']") : fromEmailInputLocator;
		this._firstNameInputLocator = notDefined(firstNameInputLocator) ?
			By.xpath("//input[@name='fname']") : firstNameInputLocator;
		this._lastNameInputLocator = notDefined(lastNameInputLocator) ?
			By.xpath("//input[@name='lname']") : lastNameInputLocator;
		this._subjectInputLocator = notDefined(subjectInputLocator) ?
			By.xpath("//input[@name='query_sku']") : subjectInputLocator;
		this._enquiryInputLocator = notDefined(enquiryInputLocator) ?
			By.xpath("//textarea[@name='enquiry_text']") : enquiryInputLocator;
		this._hashedCaptchaInputLocator = notDefined(hashedCaptchaInputLocator) ?
			By.xpath("//input[@name='antispam_encoded']") : hashedCaptchaInputLocator;
		this._captchaInputLocator = notDefined(captchaInputLocator) ?
			By.xpath("//input[@name='antispam']") : captchaInputLocator;
		this._submitButtonLocator = notDefined(submitButtonLocator) ?
			By.xpath("//input[@name='submit_button']") : submitButtonLocator;
	}

	/**
	 * Set the from email input locator
	 *
	 * @param value Locator
	 */
	set fromEmailInputLocator(value) {
		this._fromEmailInputLocator = value;
	}

	/**
	 * Set the first name input locator
	 *
	 * @param value Locator
	 */
	set firstNameInputLocator(value) {
		this._firstNameInputLocator = value;
	}

	/**
	 * Set the last name input locator
	 *
	 * @param value Locator
	 */
	set lastNameInputLocator(value) {
		this._lastNameInputLocator = value;
	}

	/**
	 * Set the subject input locator
	 *
	 * @param value Locator
	 */
	set subjectInputLocator(value) {
		this._subjectInputLocator = value;
	}

	/**
	 * Set the enquiry input locator
	 *
	 * @param value Locator
	 */
	set enquiryInputLocator(value) {
		this._enquiryInputLocator = value;
	}

	/**
	 * Set the captchat input locator
	 *
	 * @param value Locator
	 */
	set captchaInputLocator(value) {
		this._captchaInputLocator = value;
	}

	/**
	 * Set the hashed captcha input locator
	 *
	 * @param value Locator
	 */
	set hashedCaptchaInputLocator(value) {
		this._hashedCaptchaInputLocator = value;
	}

	/**
	 * Set the submit button locator
	 *
	 * @param value Locator
	 */
	set submitButtonLocator(value) {
		this._submitButtonLocator = value;
	}

	/**
	 * Set the enquiry receipt section locator
	 *
	 * @param value Locator
	 */
	set enquiryReceiptSectionLocator(value) {
		this._enquiryReceiptSectionLocator = value;
	}

	/**
	 * Set Acknowledgment test regex locator
	 *
	 * @param value Locator
	 */
	set acknowledgmentTextRegex(value) {
		this._acknowledgmentTextRegex = value;
	}

	/**
	 * Send an enquiry
	 *
	 * @param fromEmail Email value
	 * @param firstName First name value
	 * @param lastName Last name value
	 * @param subject Subject value
	 * @param enquiry Enquiry value
	 * @returns {Promise<void>}
	 */
	async sendEnquiry(fromEmail, firstName, lastName, subject, enquiry) {
		if (!await this.pageNotFound()) {
			// fill in the form
			await this._driver.findElement(this._fromEmailInputLocator).sendKeys(fromEmail);
			await this._driver.findElement(this._firstNameInputLocator).sendKeys(firstName);
			await this._driver.findElement(this._lastNameInputLocator).sendKeys(lastName);

			// clear first the subject
			const subjectElement = await this._driver.findElement(this._subjectInputLocator);
			await subjectElement.clear();
			await subjectElement.sendKeys(subject);

			await this._driver.findElement(this._enquiryInputLocator).sendKeys(enquiry);

			const captchaHashed = await this._driver.findElement(
				this._hashedCaptchaInputLocator
			).getAttribute('value').then((value) => value);

			// this is for decoding the hidden hashed value of captcha
			const md5Reverser = reverseMd5({
				lettersUpper: true,
				lettersLower: true,
				numbers: true,
				special: false,
				maxLen: 12
			});

			const reversedData = await md5Reverser(captchaHashed).str;
			// set the decoded captcha hash
			await this._driver.findElement(this._captchaInputLocator).sendKeys(reversedData);

			// send it
			await this._driver.findElement(this._submitButtonLocator).click();

			// return the enquiry receipt page instance
			const currentURL = await this._driver.getCurrentUrl().then((url) => url);

			return await new EnquiryReceiptPage(
				this._driver,
				currentURL,
				null,
				this._enquiryReceiptSectionLocator,
				this._acknowledgmentTextRegex);
		}

		return await null;
	}
}

module.exports.EnquirePage = EnquirePage;
