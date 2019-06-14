const axios = require('axios');
const xmlConverter = require('xml-js');
const { notDefined } = require('./functions');

/**
 * Zest API helper class
 *
 */
class ZestApi {
	/**
	 * Constructor
	 *
	 * @param apiBaseURL The base url of the api of the zest site.
	 * @param apiKey API / Application key
	 */
	constructor(apiBaseURL, apiKey) {
		if (notDefined(apiBaseURL)) {
			throw Error('API Base url is undefined or empty!');
		} else if (apiBaseURL[apiBaseURL.length - 1] !== '/') {
			throw Error("To void problems base url must end with '/'!");
		}

		if (notDefined(apiKey)) {
			throw Error('API key is undefined or empty!');
		}

		this._apiBaseURL = apiBaseURL;
		this._apiKey = apiKey;
	}

	/**
	 * Set apiBaseURL
	 *
	 * @param value The base url of the api of the zest site.
	 */
	set apiBaseURL(value) {
		this._apiBaseURL = value;
	}

	/**
	 * Set apiKey
	 *
	 * @param value API / Application key
	 */
	set apiKey(value) {
		this._apiKey = value;
	}

	/**
	 * Get the order Lines
	 *
	 * @param orderNumber Order number of the order
	 * @param sku Ordered product sku
	 * @param status Status of the order
	 * @param method HTTP Method
	 * @returns {Promise<any>}
	 */
	async orderLines(orderNumber, sku, status, method) {
		// throw an exception if the base API url or the API key was not set.
		if (notDefined(this._apiBaseURL)) {
			throw new Error('API Base url is undefined or empty!');
		}

		if (notDefined(this._apiKey)) {
			throw new Error('API key is undefined or empty!');
		}

		method = notDefined(method) ? 'get' : method;
		status = notDefined(method) ? 'pending' : status;

		const params = {
			_key: this._apiKey
		};

		if (!notDefined(orderNumber)) {
			params.order_number = orderNumber;
		}

		if (!notDefined(status)) {
			params.status = status;
		}

		if (!notDefined(sku)) {
			params.sku = sku;
		}

		const orders = await axios[method](this._apiBaseURL+'OrderLine', { params: params }).then((result) => {
			const data = xmlConverter.xml2json(result.data, {
				compact: true,
				spaces: 4,
				ignoreComment: true
			});

			const orderLineResult = JSON.parse(data).ResultSet.OrderLine;

			// simplify the enquiry objects
			const orderLines = [];

			if (!notDefined(orderLineResult)) {
				if (Array.isArray(orderLineResult)) {
					orderLineResult.forEach((result) => {
						orderLines.push(ZestApi._extractOrderLineData(result));
					});
				} else {
					orderLines.push(ZestApi._extractOrderLineData(orderLineResult));
				}
			}

			return orderLines;
		}).catch((err) => {
			console.error(err);
			return err;
		});

		return await new Promise((resolve, reject) => {
			if (orders instanceof Error) {
				return reject(orders);
			}

			return resolve(orders);
		});
	}

	/**
	 * Get the Enquiries
	 *
	 * @param subject Subject of the enquiry
	 * @param enquiry Enquiry text
	 * @param status Status of the enquiry
	 * @param method HTTP method
	 * @returns {Promise<void>}
	 */
	async enquiries(subject, enquiry, status, method) {
		// throw an exception if the base API url or the API key was not set.
		if (notDefined(this._apiBaseURL)) {
			throw new Error('API Base url is undefined or empty!');
		}

		if (notDefined(this._apiKey)) {
			throw new Error('API key is undefined or empty!');
		}

		method = notDefined(method) ? 'get' : method;
		status = notDefined(method) ? 'pending' : status;

		const params = {
			_key: this._apiKey
		};

		if (!notDefined(status)) {
			params.status = status;
		}

		if (!notDefined(subject)) {
			params.subject = subject;
		}

		if (!notDefined(enquiry)) {
			params.enquiry = enquiry;
		}

		return await axios[method](this._apiBaseURL+'Enquiries', { params: params })
			.then((result) => {
				const data = xmlConverter.xml2json(result.data, {
					compact: true,
					spaces: 4,
					ignoreComment: true
				});

				const enquiryResult = JSON.parse(data).ResultSet.Enquiry;

				// simplify the enquiry objects
				const enquires = [];

				if (Array.isArray(enquiryResult)) {
					enquiryResult.forEach((result) => {
						enquires.push(ZestApi._extractEnquiryData(result));
					});
				} else {
					enquires.push(ZestApi._extractEnquiryData(enquiryResult));
				}

				return enquires;
			}).catch((err) => console.error(err));
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 * Helper function that extracts text from the enquiry response
	 *
	 * @param result The enquiry result object
	 * @returns {{firstName: string | number | string,
	 * lastName: string | number | string,
	 * code: string | number | string,
	 * deleted: string | number | string,
	 * enquiryDate: string | number | string,
	 * subject: string | number | string,
	 * enquiry: string | number | string,
	 * complete: string | number | string,
	 * sku: string | number | string,
	 * email: string | number | string,
	 * status: string | number | string,
	 * username: string | number | string}}
	 */
	static _extractEnquiryData(result) {
		return {
			code: result.code._text,
			complete: result.complete._text,
			deleted: result.deleted._text,
			email: result.email._text,
			enquiry: result.enquiry._text,
			enquiryDate: result.enquiry_date._text,
			firstName: result.fname._text,
			lastName: result.lname._text,
			sku: result.sku._text,
			status: result.status._text,
			subject: result.subject._text,
			username: result.username._text
		};
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 * Helper function that extracts text from the order line response
	 *
	 * @param result
	 * @returns {{shippingTracking: string | string | number,
	 * updateDate: string | string | number,
	 * code: string | string | number,
	 * orderNumber: string | string | number,
	 * quantity: string | string | number,
	 * subtotalNumeric: string | string | number,
	 * description: string | string | number,
	 * shippingProvider: string | string | number,
	 * price: string | string | number,
	 * subtotal: string | string | number,
	 * options: string | string | number,
	 * subtotalConvertedDefaultCurrency: string | string | number,
	 * sku: string | string | number,
	 * orderDate: string | string | number,
	 * status: string | string | number}}
	 * @private
	 */
	static _extractOrderLineData(result) {
		return {
			code: result.code._text,
			description: result.description._text,
			options: result.options._text,
			orderDate: result.order_date._text,
			orderNumber: result.order_number._text,
			price: result.price._text,
			quantity: result.quantity._text,
			shippingProvider: result.shipping_provider._text,
			shippingTracking: result.shipping_tracking._text,
			sku: result.sku._text,
			status: result.status._text,
			subtotal: result.subtotal._text,
			subtotalConvertedDefaultCurrency: result.subtotal_converted_default_currency._text,
			subtotalNumeric: result.subtotal_numeric._text,
			updateDate: result.update_date._text
		};
	}
}

module.exports.ZestApi = ZestApi;
