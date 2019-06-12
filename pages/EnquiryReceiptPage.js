const { By } = require('selenium-webdriver');
const { expect } = require('chai');
const { notDefined } = require('../helpers/functions');
const { Page } = require('./Page');

/**
 * Enquiry page class
 *
 */
class EnquiryReceiptPage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param closeModalButtonLocator The locator for close modal button.
	 * @param enquiryReceiptSectionLocator The locator for the receipt section.
	 * @param acknowledgmentTextRegex Acknowledgment text for matching.
	 */
	constructor(webdriver, url, closeModalButtonLocator, enquiryReceiptSectionLocator, acknowledgmentTextRegex) {
		super(webdriver, url, closeModalButtonLocator);
		this._enquiryReceiptSectionLocator = enquiryReceiptSectionLocator;
		this._acknowledgmentTextRegex = acknowledgmentTextRegex;

		// initialize locators if not defined
		this._enquiryReceiptSectionLocator = notDefined(this._enquiryReceiptSectionLocator) ?
			By.css('div.component_CustomerService_EnquiryReceipt') : this._enquiryReceiptSectionLocator;
		this._acknowledgmentTextRegex = notDefined(this._acknowledgmentTextRegex) ?
			/[Tt]hank\syou\sfor\syour\senquiry/ : this._acknowledgmentTextRegex;
	}

	/**
	 * Set enquiry receipt section locator
	 *
	 * @param value Locator
	 */
	set enquiryReceiptSectionLocator(value) {
		this._enquiryReceiptSectionLocator = value;
	}

	/**
	 * Set acknowledgment test regex
	 *
	 * @param value Regex
	 */
	set acknowledgmentTextRegex(value) {
		this._acknowledgmentTextRegex = value;
	}

	/**
	 * Get the receipt section
	 *
	 * @returns {Promise<string>}
	 */
	async getReceiptSectionContent() {
		return await this._driver.findElement(this._enquiryReceiptSectionLocator).getText().then((text) => text);
	}

	/**
	 * Expect the acknowledgment
	 *
	 * @param acknowledgmentTextRegex Acknowledgment text for matching.
	 * @returns {Promise<*>}
	 */
	async expectAcknowledgment(acknowledgmentTextRegex) {
		const textRegex = notDefined(acknowledgmentTextRegex) ? this._acknowledgmentTextRegex : acknowledgmentTextRegex;
		const enquiryAcknowledgmentText = await this.getReceiptSectionContent();
		return await expect(enquiryAcknowledgmentText).to.match(textRegex);
	}
}

module.exports.EnquiryReceiptPage = EnquiryReceiptPage;
