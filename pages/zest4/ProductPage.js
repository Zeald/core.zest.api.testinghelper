const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { notDefined, pickRandom, isEqual } = require('../../helpers/functions');
const { Page } = require('./Page');
const { EnquirePage } = require('./EnquirePage');

/**
 * Product Page class
 *
 */
class ProductPage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param addToCartButtonLocator The locator for add to cart button.
	 * @param enquireButtonSelector The locator for enquire cart button.
	 * @param closeModalButtonLocator The locator for close modal button.
	 * @param productOptionLocator The locator for the options.
	 * @param descriptionLocator The locator for description.
	 * @param productImageLocator The locator for product image.
	 * @param productLargeImageLocator The locator for the larger version of product image.
	 * @param productImageZoomLocator The locator for the zoom button of product image.
	 * @param productLargeImageCloseLocator The locator for large product image.
	 * @param priceLocator The locator for the price.
	 */
	constructor(webdriver, url, addToCartButtonLocator, enquireButtonSelector, closeModalButtonLocator,
				productOptionLocator, descriptionLocator, productImageLocator, productLargeImageLocator,
				productImageZoomLocator, productLargeImageCloseLocator, priceLocator) {
		super(webdriver, url, closeModalButtonLocator);

		this._addToCartButtonLocator = addToCartButtonLocator;
		this._enquireButtonSelector = enquireButtonSelector;
		this._productOptionLocator = productOptionLocator;
		this._descriptionLocator = descriptionLocator;
		this._productImageLocator = productImageLocator;
		this._productLargeImageLocator = productLargeImageLocator;
		this._productImageZoomLocator = productImageZoomLocator;
		this._productLargeImageCloseLocator = productLargeImageCloseLocator;
		this._priceLocator = priceLocator;

		// initialize locators if not defined
		this._addToCartButtonLocator = notDefined(this._addToCartButtonLocator) ?
			By.xpath("//button[contains(text(),'Add to cart')]") : this._addToCartButtonLocator;
		this._enquireButtonSelector = notDefined(this._enquireButtonSelector) ?
			By.xpath("//a[@class='zbtn' and contains(@href,'enquiry')]") : this._enquireButtonSelector;
		this._productOptionLocator = notDefined(this._productOptionLocator) ?
			By.css('form.order .option') : this._productOptionLocator;
		this._descriptionLocator = notDefined(this._descriptionLocator) ?
			By.css('.full-description') : this._descriptionLocator;
		this._productImageLocator = notDefined(this._productImageLocator) ?
			By.css('.image-main') : this._productImageLocator;
		this._productLargeImageLocator = notDefined(this._productLargeImageLocator) ?
			By.css('.large-image') : this._productLargeImageLocator;
		this._productImageZoomLocator = notDefined(this._productImageZoomLocator) ?
			By.css('.maximise') : this._productImageZoomLocator;
		this._productLargeImageCloseLocator = notDefined(this._productLargeImageCloseLocator) ?
			By.css('.large-image > .close') : this._productLargeImageCloseLocator;
		this._priceLocator = notDefined(this._priceLocator) ?
			By.css('.price #unit') : this._priceLocator;
	}

	/**
	 * Set add to cart button locator
	 *
	 * @param value Locator
	 */
	set addToCartButtonLocator(value) {
		this._addToCartButtonLocator = value;
	}

	/**
	 * Set enquire button selector
	 *
	 * @param value Locator
	 */
	set enquireButtonSelector(value) {
		this._enquireButtonSelector = value;
	}

	/**
	 * Set product option locator
	 *
	 * @param value Locator
	 */
	set productOptionLocator(value) {
		this._productOptionLocator = value;
	}

	/**
	 * Set description locator
	 *
	 * @param value Locator
	 */
	set descriptionLocator(value) {
		this._descriptionLocator = value;
	}

	/**
	 * Set product image locator
	 *
	 * @param value Locator
	 */
	set productImageLocator(value) {
		this._productImageLocator = value;
	}

	/**
	 * Set product large image locator
	 *
	 * @param value Locator
	 */
	set productLargeImageLocator(value) {
		this._productLargeImageLocator = value;
	}

	/**
	 * Set product image zoom locator
	 *
	 * @param value Locator
	 */
	set productImageZoomLocator(value) {
		this._productImageZoomLocator = value;
	}

	/**
	 * Set product large image close locator
	 *
	 * @param value Locator
	 */
	set productLargeImageCloseLocator(value) {
		this._productLargeImageCloseLocator = value;
	}

	/**
	 * Set price locator
	 *
	 * @param value Locator
	 */
	set priceLocator(value) {
		this._priceLocator = value;
	}

	/**
	 * Click the add to cart button
	 *
	 * @returns {Promise<!Promise<void>|*|!LegacyActionSequence|!Actions|never|void>}
	 */
	async clickAddToCart() {
		return await this._driver.findElement(this._addToCartButtonLocator).click();
	}

	/**
	 * Click the add to cart button
	 *
	 * @returns {Promise<!Promise<void>|*|!LegacyActionSequence|!Actions|never|void>}
	 */
	async clickEnquire() {
		return await this._driver.findElement(this._enquireButtonSelector).click();
	}

	/**
	 * Click the enquire button | currently causing timeout.
	 *
	 * @returns {Promise<!Promise<void>|*|!LegacyActionSequence|!Actions|never|void>}
	 */
	async clickEnquireButton() {
		const enquireLink = await this._driver.findElement(this._enquireButtonSelector);

		const actions = await this._driver.actions({ bridge: true });
		// move the mouse to this link element to make it clickable
		await actions.move({
			duration: 5000,
			origin: enquireLink,
			x: 0,
			y: 0
		}).perform();

		// now click it
		await actions.click(enquireLink).perform();
	}

	/**
	 * Open the enquire page
	 *
	 * @returns {Promise<void>}
	 */
	async openEnquire() {
		const enquireLink = await this._driver.findElement(this._enquireButtonSelector);
		const url = await enquireLink.getAttribute('href').then((url) => url);

		const enquirePage = await new EnquirePage(this._driver, url);
		await enquirePage.open();
		return await enquirePage;
	}

	/**
	 * Verify if there are options present.
	 *
	 * @param productURL The URL of the product.
	 * @param assert This will dictate if need to execute assert rather returning the result.
	 * @returns {Promise<*>}
	 */
	async verifyOptionsPresence(productURL, assert) {
		if (!notDefined(productURL)) {
			this._url = productURL;
			await this.open();
		}

		// get all options
		const options = await this._driver.findElements(this._productOptionLocator);
		const result = await options.length > 0;

		if (assert) {
			return await expect(result, 'This product does not have any option!').to.be.true;
		} else {
			return await result;
		}
	}

	/**
	 * Verify if description is present.
	 *
	 * @param productURL The URL of the product.
	 * @param assert This will dictate if need to execute assert rather returning the result.
	 * @returns {Promise<*>}
	 */
	async verifyDescriptionPresence(productURL, assert) {
		if (!notDefined(productURL)) {
			this._url = productURL;
			await this.open();
		}

		const description = await this._driver.findElement(this._descriptionLocator)
			.then((element) => element)
			.catch(() => null);

		const descriptionPresent = await !notDefined(description);

		if (!descriptionPresent) {
			if (assert) {
				return await expect(descriptionPresent, 'This product does not have any description!').to.be.true;
			} else {
				return await descriptionPresent;
			}
		} else {
			// check if description content is present
			const descriptionContent = await description.getText().then((text) => text);
			const result = await !notDefined(descriptionContent);

			if (assert) {
				return await expect(result, 'This product has empty description!').to.be.true;
			} else {
				return await result;
			}
		}
	}

	/**
	 * Verify if product image is present.
	 *
	 * @param productURL The URL of the product.
	 * @param assert This will dictate if need to execute assert rather returning the result.
	 * @returns {Promise<*>}
	 */
	async verifyProductImagePresence(productURL, assert) {
		if (!notDefined(productURL)) {
			this._url = productURL;
			await this.open();
		}

		const productImage = await this._driver.findElement(this._productImageLocator)
			.then((element) => element)
			.catch(() => null);

		const result = await !notDefined(productImage);

		if (assert) {
			return await expect(result, 'This product does not have any image!').to.be.true;
		} else {
			return await result;
		}
	}

	/**
	 * Zoom product image.
	 *
	 * @param productURL The URL of the product.
	 * @returns {Promise<void>}
	 */
	async zoomProductImage(productURL) {
		if (!notDefined(productURL)) {
			this._url = productURL;
			await this.open();
		}

		// get the product image container element.
		const productImage = await this._driver.findElement(this._productImageLocator);
		const productImageZoom = await productImage.findElement(this._productImageZoomLocator);
		// click the zoom
		await productImageZoom.click();
		// find the large image and wait until it shows
		const productLargeImage = await this._driver.findElement(this._productLargeImageLocator);
		await this._driver.wait(until.elementIsVisible(productLargeImage), 10000);

		// close it
		const productLargeImageClose = await productLargeImage.findElement(this._productLargeImageCloseLocator);
		await productLargeImageClose.click();
	}

	/**
	 * Test every options
	 *
	 * @returns {Promise<void>}
	 */
	async testOptions() {
		// get all options
		const options = await this._driver.findElements(this._productOptionLocator);

		// test every option until price changes.
		for (let i = 0; i < options.length; i++) {
			const optionItems = await options[i].findElements(By.css('option')).then((elements) => elements);
			const totalItems = await optionItems.length;
			const initialPrice = await this._driver.findElement(this._priceLocator)
				.getText().then((text) => text.trim());

			for (let n = 0; n < totalItems; n++) {
				const result = await this.selectOption(options[i], n);
				// click to open the options
				if (result) {
					// check if price has change if so then stop testing the other options.
					const currentPrice = await this._driver.findElement(this._priceLocator)
						.getText().then((text) => text.trim());

					if (!isEqual(initialPrice, currentPrice)) {
						break;
					}
				}
			}
		}
	}

	/**
	 * Select an option from a given select element.
	 *
	 * @param optionElement The parent select element of the options.
	 * @param index The index of the option in the list of option elements.
	 * @returns {Promise<void>}
	 */
	async selectOption(optionElement, index) {
		const items = await optionElement.findElements(By.css('option'));
		let selectedItem = null;

		// click to open the options
		await optionElement.click();

		if (notDefined(index) && !Number.isInteger(index)) {
			selectedItem = await pickRandom(...items);
		} else {
			selectedItem = await items[index];
		}

		// select the option
		await selectedItem.click();

		// click again to close the options
		await optionElement.click();

		return await selectedItem;
	}
}

module.exports.ProductPage = ProductPage;
