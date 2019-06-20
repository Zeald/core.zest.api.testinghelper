const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { notDefined, pickRandom, isEqual } = require('../../helpers/functions');
const { Page } = require('./Page');

/**
 * Category Page class
 *
 */
class CategoryPage extends Page {
	/**
	 * Constructor
	 *
	 * @param webdriver Selenium web driver.
	 * @param url The url of the page.
	 * @param catViewLocator The category view locator.
	 * @param productLinkLocator The product view locator.
	 * @param filterGroupLocator The locator for filter groups.
	 * @param filtersLocator The locator for filter items.
	 * @param showFiltersLocator The locator for show filters.
	 * @param closeFiltersButtonLocator The locator for close button of filters.
	 * @param nextPageLocator The next page locator.
	 * @param loadPageDropDownLocator The category load page locator.
	 * @param pageLoaderLocator The page loader / spinner locator.
	 * @param pagesLocator The pages item locator.
	 * @param productSortingLocator The locator for sorting of products.
	 * @param productContainerLocator The locator for each container of the product.
	 * @param productSelectOptionsLocator The locator for select options button for each product.
	 * @param productAddToCartLocator The locator for add to cart for each product.
	 * @param popupCartLocator The locator for the popup cart.
	 */
	constructor(webdriver, url, catViewLocator, productLinkLocator, filterGroupLocator,
		filtersLocator, showFiltersLocator, closeFiltersButtonLocator, nextPageLocator, loadPageDropDownLocator,
		pageLoaderLocator, pagesLocator, productSortingLocator, productContainerLocator, productSelectOptionsLocator,
		productAddToCartLocator, popupCartLocator) {
		super(webdriver, url);

		this._catViewLocator = catViewLocator;
		this._productLinkLocator = productLinkLocator;
		this._filterGroupLocator = filterGroupLocator;
		this._filtersLocator = filtersLocator;
		this._showFiltersLocator = showFiltersLocator;
		this._closeFiltersButtonLocator = closeFiltersButtonLocator;
		this._nextPageLocator = nextPageLocator;
		this._loadPageDropDownLocator = loadPageDropDownLocator;
		this._pageLoaderLocator = pageLoaderLocator;
		this._pagesLocator = pagesLocator;
		this._productSortingLocator = productSortingLocator;
		this._productContainerLocator = productContainerLocator;
		this._productSelectOptionsLocator = productSelectOptionsLocator;
		this._productAddToCartLocator = productAddToCartLocator;
		this._popupCartLocator = popupCartLocator;

		// initialize locators if not defined
		this._catViewLocator = notDefined(this._catViewLocator) ?
			By.css('div.catview') : this._catViewLocator;
		this._productLinkLocator = notDefined(this._productLinkLocator) ?
			By.css('.product-collection .product-card a') : this._productLinkLocator;
		this._filterGroupLocator = notDefined(this._filterGroupLocator) ?
			By.css('.filter-collection > .filter-group') : this._filterGroupLocator;
		this._filtersLocator = notDefined(this._filtersLocator) ?
			By.css('ul > li:not(.empty).filter') : this._filtersLocator;
		this._showFiltersLocator = notDefined(this._showFiltersLocator) ?
			By.css('.top-filters .show-filters') : this._showFiltersLocator;
		this._closeFiltersButtonLocator = notDefined(this._closeFiltersButtonLocator) ?
			By.xpath("//*[@class='pop-overlay-inner pop-left']//*[@class='close'][contains(text(),'Close')]") :
			this._closeFiltersButtonLocator;
		this._nextPageLocator = notDefined(this._nextPageLocator) ? By.css('.load-next') : this._nextPageLocator;
		this._loadPageDropDownLocator = notDefined(this._loadPageDropDownLocator) ?
			By.css('.load-page.drop-select') : this._loadPageDropDownLocator;
		this._pagesLocator = notDefined(this._pagesLocator) ? By.css('ul > li') : this._pagesLocator;
		this._pageLoaderLocator = notDefined(this._pageLoaderLocator) ?
			By.css('.loading-overlay') : this._pageLoaderLocator;
		this._productSortingLocator = notDefined(this._productSortingLocator) ?
			By.css(".sort > select[name='item_sort_by'].sort-by") : this._productSortingLocator;
		this._productContainerLocator = notDefined(this._productContainerLocator) ?
			By.css('.product-card') : this._productContainerLocator;
		this._productSelectOptionsLocator = notDefined(this._productSelectOptionsLocator) ?
			By.css('.select-options') : this._productSelectOptionsLocator;
		this._productAddToCartLocator = notDefined(this._productAddToCartLocator) ?
			By.css('.select-options') : this._productAddToCartLocator;
		this._popupCartLocator = notDefined(this._popupCartLocator) ? By.css('.popup-cart') : this._popupCartLocator;
	}


	/**
	 * Set filter group locator
	 *
	 * @param value Locator
	 */
	set filterGroupLocator(value) {
		this._filterGroupLocator = value;
	}

	/**
	 * Set filters locator
	 *
	 * @param value Locator
	 */
	set filtersLocator(value) {
		this._filtersLocator = value;
	}

	/**
	 * Set show filters locator
	 *
	 * @param value Locator
	 */
	set showFiltersLocator(value) {
		this._showFiltersLocator = value;
	}

	/**
	 * Set close filters button locator
	 *
	 * @param value Locator
	 */
	set closeFiltersButtonLocator(value) {
		this._closeFiltersButtonLocator = value;
	}

	/**
	 * Set next page locator
	 *
	 * @param value Locator
	 */
	set nextPageLocator(value) {
		this._nextPageLocator = value;
	}

	/**
	 * Set load page dropdown locator
	 *
	 * @param value Locator
	 */
	set loadPageDropDownLocator(value) {
		this._loadPageDropDownLocator = value;
	}

	/**
	 * Set page loader / spinner locator
	 *
	 * @param value Locator
	 */
	set pageLoaderLocator(value) {
		this._pageLoaderLocator = value;
	}

	/**
	 * Set pages item locator
	 *
	 * @param value Locator
	 */
	set pagesLocator(value) {
		this._pagesLocator = value;
	}

	/**
	 * Set product sorting locator
	 *
	 * @param value Locator
	 */
	set productSortingLocator(value) {
		this._productSortingLocator = value;
	}

	/**
	 * Set category view locator
	 *
	 * @param value Locator
	 */
	set catViewLocator(value) {
		this._catViewLocator = value;
	}

	/**
	 * Set product link locator
	 *
	 * @param value Locator
	 */
	set productLinkLocator(value) {
		this._productLinkLocator = value;
	}

	/**
	 * Set product container locator
	 *
	 * @param value Locator
	 */
	set productContainerLocator(value) {
		this._productContainerLocator = value;
	}

	/**
	 * Set product select options locator
	 *
	 * @param value Locator
	 */
	set productSelectOptionsLocator(value) {
		this._productSelectOptionsLocator = value;
	}

	/**
	 * Set product add to cart locator
	 *
	 * @param value Locator
	 */
	set productAddToCartLocator(value) {
		this._productAddToCartLocator = value;
	}

	/**
	 * Set popup cart locator
	 *
	 * @param value Locator
	 */
	set popupCartLocator(value) {
		this._popupCartLocator = value;
	}

	/**
	 * Get the product url
	 *
	 * @returns {Promise<any[]|*>}
	 */
	async getProductURLs() {
		// locate the cat view
		const catView = await this._driver.findElement(this._catViewLocator);
		// wait a bit until it is visible
		await this._driver.wait(until.elementIsVisible(catView), 2000);
		// get product links
		let productURLs = await catView.findElements(this._productLinkLocator);

		if (productURLs.length === 0) {
			// use the zest 3 selectors
			productURLs = await catView.findElements(By.css('.item-list .item-cell a'));
		}

		this.productURLs = await this.resolveURLs(productURLs).then((urls) => urls);
		return await this.productURLs;
	}

	/**
	 * Get the product containers
	 *
	 * @returns {Promise<*|Array>}
	 */
	async getProductContainers() {
		// get the containers
		return await this._driver.findElements(this._productContainerLocator);
	}

	/**
	 * Get the product titles
	 *
	 * @returns {Promise<any[]>}
	 */
	async getProductTitles() {
		const productContainers = await this.getProductContainers().then((containers) => containers);
		const titlePromises = [];

		await productContainers.forEach((container) => {
			titlePromises.push(container.findElement(By.css('.item-title')).getText());
		});

		return await Promise.all(titlePromises);
	}

	/**
	 * Verify if products do exist in this certain category.
	 *
	 * @param categoryURL The URL of the category.
	 * @returns {Promise<*>}
	 */
	async checkIfProductsExists(categoryURL) {
		if (!notDefined(categoryURL)) {
			this._url = categoryURL;
			await this.open();
		}

		const productURLs = await this.getProductURLs().then((urls) => urls);

		const exists = productURLs && Array.isArray(productURLs) && productURLs.length > 0;
		return await expect(exists, 'Category products does not exist!').to.be.true;
	}

	/**
	 * Apply random product filter
	 *
	 * @param categoryURL The URL of the category.
	 * @returns {Promise<void>}
	 */
	async applyRandomProductFilter(categoryURL) {
		if (!notDefined(categoryURL)) {
			this._url = categoryURL;
			await this.open();
		}

		// wait for ready state
		await this.waitReadyState();

		const filterGroups = await this._driver.findElements(this._filterGroupLocator).then((groups) => groups);

		// pick a filter group
		const filterGroup = await pickRandom(...filterGroups);
		const filterGroupDisplayed = await filterGroup.isDisplayed().then((displayed) => displayed);
		const showFilter = await this._driver.findElement(this._showFiltersLocator);

		await this._driver.wait(until.elementIsVisible(showFilter), 3000);

		if (!filterGroupDisplayed) {
			// use executor to click at this point since there are instances show filter is not clickable
			// await showFilter.click();
			await this.executorClick(showFilter);
			await this.performSleep();
		}

		// pick a filter to click
		const filters = await filterGroup.findElements(this._filtersLocator).then((filters) => filters);
		const filter = await pickRandom(...filters);

		// click and check
		await filter.click();
		await this.performSleep();

		const closeButton = await this._driver.findElement(this._closeFiltersButtonLocator);

		if (!filterGroupDisplayed) {
			// close the filter
			await closeButton.click();
			await this.performSleep();
		}

		await this.checkIfProductsExists();

		// open filter and close uncheck
		if (!filterGroupDisplayed) {
			// use executor to click at this point since there are instances show filter is not clickable
			await this.executorClick(showFilter);
			await this.performSleep();
			await filter.click();
			await this.performSleep();
			// close the filter
			await this.executorClick(closeButton);
			await this.performSleep();
		}

		return await filter;
	}

	/**
	 * Load the next page.
	 *
	 * @param categoryURL The URL of the category.
	 * @returns {Promise<*>}
	 */
	async goToNextPage(categoryURL) {
		if (!notDefined(categoryURL)) {
			this._url = categoryURL;
			await this.open();
		}

		// wait for ready state
		await this.waitReadyState();

		// get the products before loading the next page
		await this.checkIfProductsExists();
		const firstPageProducts = await this.getProductURLs().then((urls) => urls);

		// get the next page button
		const isLoadNextPageExist = await this._driver.findElement(this._nextPageLocator).then((element) => {
			if (element) {
				return true;
			}
		}).catch((err) => {
			return false;
		});

		if (isLoadNextPageExist) {
			const loadNextPage = await this._driver.findElement(this._nextPageLocator);
			// scroll to the next page button
			await this.scrollTo(loadNextPage);
			await this.performSleep();

			// click load next page
			await loadNextPage.click();
			await this.performSleep();
		}

		await this.checkIfProductsExists();

		// get the new products list if there's any
		const nextPageProducts = await this.getProductURLs().then((urls) => urls);
		const isNextPageProductLoaded = await nextPageProducts.length >= firstPageProducts.length;

		return await expect(isNextPageProductLoaded, 'Next page products is not loaded!').to.be.true;
	}

	/**
	 * Go to a random page.
	 *
	 * @param categoryURL The URL of the category.
	 * @returns {Promise<void>}
	 */
	async goToRandomPage(categoryURL) {
		if (!notDefined(categoryURL)) {
			this._url = categoryURL;
			await this.open();
		}

		// wait for ready state
		await this.waitReadyState();

		const pageSelector = await this._driver.findElement(this._loadPageDropDownLocator);
		await this.scrollTo(pageSelector);
		await this.performSleep();

		// click the page selector
		await pageSelector.click();
		await this.performSleep();

		// get all the pages under the drop down
		const pages = await pageSelector.findElements(this._pagesLocator).then((pages) => pages);
		// pick a random page to jump in
		const page = await pickRandom(...pages);
		// click the page
		await page.click();

		await this.performSleep();

		// verify if there are products
		await this.checkIfProductsExists();

		return await page;
	}

	/**
	 * Execute product sort
	 *
	 * @param sortIndex Index of the sort option
	 * @param categoryURL categoryURL The URL of the category.
	 * @returns {Promise<*>}
	 */
	async productSort(sortIndex, categoryURL) {
		if (!notDefined(categoryURL)) {
			this._url = categoryURL;
			await this.open();
		}

		sortIndex = notDefined(sortIndex) ? 0 : sortIndex;

		// get the original list of product titles in the current order.
		const productTitlesOriginalOrder = await this.getProductTitles();

		const productSortingSelect = await this._driver.findElement(this._productSortingLocator);
		// scroll tp the sorting dropdown
		await this.scrollTo(productSortingSelect);
		await this.performSleep();
		// click it
		await productSortingSelect.click();

		// get all the elements under it
		const options = await productSortingSelect.findElements(By.css('option')).then((options) => options);
		await this.performSleep(1000);
		// click the option
		await options[sortIndex].click();

		// put sleep here just to be sure that loader has gone away and products are loaded.
		await this.performSleep(5000);

		// get the original list of products in their new order
		const productTitlesNewOrder = await this.getProductTitles();

		// compare if still exactly the same order
		const result = await isEqual(productTitlesOriginalOrder, productTitlesNewOrder);

		return await expect(result, 'No ordering happened!').to.be.false;
	}

	/**
	 * Add product to cart
	 *
	 * @param productIndex Index of the product in the list.
	 * @returns {Promise<*>}
	 */
	async addProductToCart(productIndex) {
		let productContainer = null;
		const productContainers = await this.getProductContainers().then((containers) => containers);

		if (notDefined(productIndex)) {
			productContainer = await pickRandom(...productContainers);
		} else {
			productContainer = await productContainers[productIndex];
		}

		// scroll to this product
		await this.scrollTo(productContainer);

		const addToCartButton = await productContainer.findElement(this._productAddToCartLocator);
		const selectOptionsButton = await productContainer.findElement(this._productSelectOptionsLocator);

		// if add to cart is visible then click add to cart immediately
		const addToCartVisible = await addToCartButton.isDisplayed().then((displayed) => displayed);
		if (!addToCartVisible) {
			await selectOptionsButton.click();
		}

		await addToCartButton.click();
		await this.performSleep();

		// wait for the popup cart to show up
		const popupCart = await this._driver.findElement(this._popupCartLocator);
		await this._driver.wait(until.elementIsVisible(popupCart), 5000);

		// verify if the product is already in the cart using the product title
		const productTitle = await productContainer.findElement(By.css('.item-title')).getText().then((text) => text);
		const popupProductTitle = await popupCart.findElement(By.css('.product-title')).getText().then((text) => text);
		const isProductPresent = isEqual(productTitle, popupProductTitle);
		return await expect(isProductPresent, 'Product not in the cart!').to.be.true;
	}

	/**
	 * Resolve url promises to extract href attribute
	 *
	 * @param urlPromises URL element promises
	 * @return {Promise<any[]>}
	 */
	async resolveURLs(urlPromises) {
		const promises = [];
		await urlPromises.forEach((element) => {
			promises.push(element.getAttribute('href'));
		});

		return Promise.all(promises);
	}
}

module.exports.CategoryPage = CategoryPage;
