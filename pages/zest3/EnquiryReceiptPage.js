const { By } = require('selenium-webdriver');
const { expect } = require('chai');
const { Page } = require('./Page');
const { notDefined } = require('../../helpers/functions');

/**
 * Enquiry receipt page
 *
 */
class EnquiryReceiptPage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param enquiryReceiptSectionLocator The locator for the receipt section.
	 * @param acknowledgmentTextRegex Acknowledgment text for matching.
	 */
	constructor(webdriver, url, enquiryReceiptSectionLocator, acknowledgmentTextRegex) {
		super(webdriver, url);

		// initialize locators if not defined
		this._enquiryReceiptSectionLocator = notDefined(enquiryReceiptSectionLocator) ?
			By.css('div.component_CustomerService_EnquiryReceipt') : enquiryReceiptSectionLocator;
		this._acknowledgmentTextRegex = notDefined(acknowledgmentTextRegex) ?
			/[Tt]hank\syou\sfor\syour\senquiry/ : acknowledgmentTextRegex;
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
	 * Set acknowledgment text regex
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
	 * Expect the acknowledgment regex
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
