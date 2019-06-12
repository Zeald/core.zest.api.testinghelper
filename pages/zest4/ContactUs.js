const { By } = require('selenium-webdriver');
const reverseMd5 = require('reverse-md5');
const { Page } = require('./Page');
const { EnquiryReceiptPage } = require('./EnquiryReceiptPage');
const { notDefined } = require('../../helpers/functions');

/**
 * Contact us class
 *
 */
class ContactUs extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param closeModalButtonLocator The locator for close modal button.
	 * @param fromEmailInputLocator The from email input form locator.
	 * @param firstNameInputLocator The first name input form locator.
	 * @param lastNameInputLocator The last name input form locator.
	 * @param countryInputLocator The country input form locator.
	 * @param subjectInputLocator The subject input form locator.
	 * @param enquiryInputLocator The enquiry input form locator.
	 * @param captchaInputLocator The captcha input form locator.
	 * @param hashedCaptchaInputLocator The hashed value hidden input form locator.
	 * @param submitButtonLocator The locator for submit button.
	 */
	constructor(
		webdriver, url, closeModalButtonLocator, fromEmailInputLocator, firstNameInputLocator,
		lastNameInputLocator, countryInputLocator, subjectInputLocator, enquiryInputLocator, captchaInputLocator,
		hashedCaptchaInputLocator, submitButtonLocator) {
		super(webdriver, url, closeModalButtonLocator);

		this._fromEmailInputLocator = fromEmailInputLocator;
		this._firstNameInputLocator = firstNameInputLocator;
		this._lastNameInputLocator = lastNameInputLocator;
		this._countryInputLocator = countryInputLocator;
		this._subjectInputLocator = subjectInputLocator;
		this._enquiryInputLocator = enquiryInputLocator;
		this._hashedCaptchaInputLocator = hashedCaptchaInputLocator;
		this._captchaInputLocator = captchaInputLocator;
		this._submitButtonLocator = submitButtonLocator;

		// initialize locators if not defined
		this._fromEmailInputLocator = notDefined(this._fromEmailInputLocator) ?
			By.xpath("//input[@name='from_email']") : this._fromEmailInputLocator;
		this._firstNameInputLocator = notDefined(this._firstNameInputLocator) ?
			By.xpath("//input[@name='fname']") : this._firstNameInputLocator;
		this._lastNameInputLocator = notDefined(this._lastNameInputLocator) ?
			By.xpath("//input[@name='lname']") : this._lastNameInputLocator;
		this._countryInputLocator = notDefined(this._countryInputLocator) ?
			By.xpath("//input[@name='q6']") : this._countryInputLocator;
		this._subjectInputLocator = notDefined(this._subjectInputLocator) ?
			By.xpath("//input[@name='query_sku']") : this._subjectInputLocator;
		this._enquiryInputLocator = notDefined(this._enquiryInputLocator) ?
			By.xpath("//textarea[@name='enquiry_text']") : this._enquiryInputLocator;

		this._hashedCaptchaInputLocator = notDefined(this._hashedCaptchaInputLocator) ?
			By.xpath("//input[@name='antispam_encoded']") : this._hashedCaptchaInputLocator;
		this._captchaInputLocator = notDefined(this._captchaInputLocator) ?
			By.xpath("//input[@name='antispam']") : this._captchaInputLocator;
		this._submitButtonLocator = notDefined(this._submitButtonLocator) ?
			By.xpath("//input[@name='submit_button']") : this._submitButtonLocator;
	}

	/**
	 * From email input
	 *
	 * @param value Locator
	 */
	set fromEmailInputLocator(value) {
		this._fromEmailInputLocator = value;
	}

	/**
	 * First name input
	 *
	 * @param value Locator
	 */
	set firstNameInputLocator(value) {
		this._firstNameInputLocator = value;
	}

	/**
	 * Last name input
	 *
	 * @param value Locator
	 */
	set lastNameInputLocator(value) {
		this._lastNameInputLocator = value;
	}

	/**
	 * Country input
	 *
	 * @param value Locator
	 */
	set countryInputLocator(value) {
		this._countryInputLocator = value;
	}

	/**
	 * Subject input
	 *
	 * @param value Locator
	 */
	set subjectInputLocator(value) {
		this._subjectInputLocator = value;
	}

	/**
	 * Enquiry input
	 *
	 * @param value Locator
	 */
	set enquiryInputLocator(value) {
		this._enquiryInputLocator = value;
	}

	/**
	 * Captchat input
	 *
	 * @param value Locator
	 */
	set captchaInputLocator(value) {
		this._captchaInputLocator = value;
	}

	/**
	 * hashed captcha input
	 *
	 * @param value Locator
	 */
	set hashedCaptchaInputLocator(value) {
		this._hashedCaptchaInputLocator = value;
	}

	/**
	 * Submit button
	 *
	 * @param value Locator
	 */
	set submitButtonLocator(value) {
		this._submitButtonLocator = value;
	}

	/**
	 * Enquiry receipt section
	 *
	 * @param value Locator
	 */
	set enquiryReceiptSectionLocator(value) {
		this._enquiryReceiptSectionLocator = value;
	}

	/**
	 * Acknowledgment test regex
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
	 * @param country Country value
	 * @param subject Subject value
	 * @param enquiry Enquiry value
	 * @returns {Promise<void>}
	 */
	async sendEnquiry(fromEmail, firstName, lastName, country, subject, enquiry) {
		if (!await this.pageNotFound()) {
			// fill in the form
			await this._driver.findElement(this._fromEmailInputLocator).sendKeys(fromEmail);
			await this._driver.findElement(this._firstNameInputLocator).sendKeys(firstName);
			await this._driver.findElement(this._lastNameInputLocator).sendKeys(lastName);

			// Check if there is country field.
			await this._driver.findElement(this._countryInputLocator).then(async (elem) => {
				await elem.sendKeys(country);
			}).catch((err) => console.log('Country field do not exist in enquiry page.'));

			await this._driver.findElement(this._subjectInputLocator).sendKeys(subject);
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
				currentURL);
		}

		return await null;
	}
}

module.exports.ContactUs = ContactUs;
