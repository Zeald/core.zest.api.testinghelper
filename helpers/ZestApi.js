const axios = require('axios');
const xmlConverter = require('xml-js');
const { notDefined, findString } = require('./functions');
const util = require('util');

/**
 * Zest API helper class
 *
 */
class ZestApi {
	
	/**
	 * Constructor
	 *
	 * @param apiBaseUrl The base url of the zest site API.
	 * @param apiKey API / Application key
	 */
	constructor(apiBaseUrl, apiKey) {
		if (notDefined(apiBaseUrl)) {
			throw Error('API Site url is: ' + apiBaseUrl + ' - undefined or empty!');
		}
		if (notDefined(apiKey)) {
			throw Error('API key is undefined or empty!');
		}

		// ensure base url ends in a '/'
		if (apiBaseUrl[apiBaseUrl.length - 1] != '/') {
			apiBaseUrl += '/';
		}
		this._apiBaseURL = apiBaseUrl;
		this._apiKey = apiKey;
	}

	/**
	 * Get an order
	 *
	 * @param {String} orderNumber Order number of the transaction
	 * @param {Boolean} orderLines include orderlines in the request - default false
	 * @param {String} status only retrieve order matching this status
	 * @returns {Promise<any>} a promise resolving to an object of order data
	 */
	async order(orderNumber, orderLines = false, status) {
		const params = {};
		if (!notDefined(status)) {
			params.status = status;
		}
		let apiInterface = 'Order';
		if (orderLines) {
			apiInterface += '+OrderLine';
		}
		return this.single(apiInterface, orderNumber, params);
	}

	/**
	 * Get the Enquiries
	 *
	 * @param {Object} searchParams specific fields to search form (aligning to ZEST API)
	 * @param {Integer} limit optionally limit the amount of enquiries to retrieve
	 * @returns {Promise<void>} Resolves to an array of objects containing enquiry data
	 */
	async enquiries(searchParams = {}, limit = 0) {
		return this.search('enquiries', searchParams, limit);
	}

	/**
	 * Check order acknowledgment email.
	 *
	 * @param orderNumber Order number
	 * @param logName Name of the log file.
	 * @param tail Last number of lines to retrieve.
	 * @returns {Promise<AxiosResponse<T>>}
	 */
	async checkOrderAcknowledgmentEmail(orderNumber, logName, tail) {
		return await axios.get(this._apiEmailLogBaseURL, {
			params: {
				log: logName,
				tail: tail
			}
		}).then((result) => {
			// check the presence of thank you phrase and order number
			const thankYouMessage = 'Thank you for your order #' + orderNumber;
			return findString(result.data, thankYouMessage);
		}).catch((err) => {
			console.error(err);
			return null;
		});
	}

	/**
	 * Retrieve a single record of the specified type
	 *
	 * @param {String} apiInterface ZEST API interface (http://developers.zeald.com/doku.php?id=dataapi:start)
	 * @param {String} identifier unique key to look up
	 * @param {Object} params optional additional parameters to pass to further restrict results
	 * @returns {Promise<any>} a promise resolving to an object the requested data
	 */
	async single(apiInterface, identifier, params = {}) {
		return this.search(apiInterface + '/' + identifier, params);
	}

	/**
	 * Retrieve all record of the specified type
	 *
	 * @param {String} apiInterface ZEST API interface (http://developers.zeald.com/doku.php?id=dataapi:start)
	 * @param {Object} params optional additional parameters to pass to further restrict results
	 * @param {Integer} limit optional only retrieve this many records
	 * @returns {Promise<any>} a promise resolving to an object the requested data
	 */
	async search(apiInterface, params = {}, limit = 0) {
		// determine the root element & strip any non word characters (e.g. brackets)
		const rootElement = apiInterface.split('+')
			.shift()
			.replace(/\W/, '');

		// restrict the number of results if required
		if (limit) {
			params._results = limit;
		}

		// retrieve the result & relove to the requested data
		return new Promise(async (resolve, reject) => {
			try {
				// retrieve the requested data
				const result = await this.request(apiInterface + '/', params);
				resolve(result[rootElement]);
			} catch (error) {
				reject(order);
			}
		});
	}

	/**
	 * Submit an API request & parse the response
	 * @param {String} apiInterface ZEST API interface (http://developers.zeald.com/doku.php?id=dataapi:start)
	 * @param {String|Object} args if `get`, will transform into a querystring. If `post` can be either XML, or key value pairs to build into an XML payload
	 * @param {String} method defaults to `get`
	 * @returns {Object} parsed API response
	 */
	async request(apiInterface, args, method) {
		// ensure method is supported
		const supported = ['get', 'post', 'put', 'delete'];
		method = notDefined(method) ? '' : method;
		method = method.toLowerCase();
		if (!supported.includes(method)) {
			method = 'get';
		}

		// build the main axios request options
		const apiAddress = this._apiBaseURL + apiInterface;
		const config = {
			url: apiAddress,
			method: method,

			// ZEST api authentication passes the api key as a HTTP AUTH username
			auth: {
				username: this._apiKey
			}
		};

		// prepare querystring parameters for get/delete
		if (!notDefined(args)) {
			if (['get', 'delete'].includes(method)) {
				if (typeof args != 'object') {
					throw new Error('API Request: Args for a GET request must be key-value pairs');
				}
				config.params = args;
			} else {
				config.data = args;
			}
		}

		// execute the API request
		return new Promise(async (resolve, reject) => {
			try {
				console.log('executing: ' + util.inspect(config));
				const result = await axios.request(config);

				// parse & clean the XML response & return a promise
				let parsed = xmlConverter.xml2js(result.data, {
					compact: true,
					ignoreComment: true
				});
				parsed = this._cleanData(parsed.ResultSet || parsed);
				resolve(parsed);
			} catch (error) {
				console.error('Error executing API request: ' + apiAddress + '. ' + error);
				reject(error);
			};
		});
	}

	/**
	 * cleans API data, converting it into a normal object
	 * @param {Object} data api request result from xml-js conversion
	 * @param {Integer} count used internally by the method to prevent recursive loops
	 * @returns {Object} cleaned api data
	 */
	_cleanData(data, count) {
		if (count > 20) {
			throw new Error('Recursion loop detected while attempting to clean data: ' + util.inspect(data));
		}

		// if we received an array, loop through the data & clean it
		if (Array.isArray(data)) {
			const clean = [];
			data.forEach((current) => {
				clean.push(this._cleanData(current, count+1));
			})
			return clean;

		// for objects, check if it has a _text property
		// if so retrieve it, otherwise it must be a genuine
		// object so loop over each property & clean it
		} else if(typeof data === 'object') {
			if (data._text) {
				return data._text;
			}
			const clean = {};
			for (let key in data) {

				// strip attributes
				if (key == '_attributes') {
					continue;
				}
				clean[this._snakeToCamel(key)] = this._cleanData(data[key], count+1);
			}
			return clean;
		}

		// must be standard data type so just return it
		return data;
	}

	/**
	 * Convert a string from snake_case to camelCase
	 * @param {String} string covert this string from snake_case to camelCase
	 * @returns {String} camelCase result
	 */
	_snakeToCamel(string) {
		const parts = string.split('_');
		const camel = [
			parts.shift()
		];

		// loop through each part & uppercase the first letter, rejoining without the underscores
		while (parts.length) {
			const part = parts.shift();
			camel.push(part.charAt(0).toUpperCase() + part.slice(1));
		}
		return camel.join('');
	}

	/**
	 * Shortcut to util.inspect with custom args
	 * @param {Mixed} data
	 * @return {String} inspected data
	 */
	inspect(data) {
		return util.inspect(data, false, 4);
	}
}

module.exports.ZestApi = ZestApi;
