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
	 * @param {Object} options optional additional configuration
	 * @param {Boolean} options.lines retrieve orderline data
	 * @param {Boolean} options.customer retrieve customer data
	 * @param {Object} options.where additional where filtering - e.g. `{status: 'Pending'}`
	 * @returns {Promise<any>} a promise resolving to an object of order data
	 */
	async order(orderNumber, options = {}) {
		const params = {
			where: options.where
		};

		// build up related interfaces
		params.with = this._buildRelated({
			lines: 'OrderLine',
			customer: 'Customer'
		}, options);
		return this.single('Order', orderNumber, params);
	}

	/**
	 * Retrieve enquiries
	 *
	 * @param {Object} searchParams specific fields to search form (aligning to ZEST API)
	 * @param {Integer} limit optionally limit the amount of enquiries to retrieve
	 * @returns {Promise<void>} Resolves to an array of objects containing enquiry data
	 */
	async enquiries(searchParams = {}, limit = 0) {
		const options = {};
		if (limit) {
			options.limit = limit;
		}
		return this.search('enquiries', searchParams, options);
	}

	/**
	 * Read a ZEST log file
	 *
	 * @param {String} filename name of the log file to read in the `log/` folder
	 * @param {Integer} tail optional - only retrieve the last `tail` lines
	 * @returns {Promise<void>} Resolves to an array of objects containing enquiry data
	 */
	async readLog(filename, tail=0) {
		const args = tail ? {
			log: filename,
			tail: tail
		} : filename;
		return this.call('TestFramework.SeleniumHelper.read_log', args);
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
	 * @param {Object} options optional additional parameters for further configuration
	 * @param {String/Object} options.with a related interface (or array of interfaces) to
	 *     retrieve along with the order e.g. ['OrderLine', 'Customer']
	 * @param {Object} options.where optional additional parameters to pass to further restrict results
	 * @returns {Promise<any>} a promise resolving to an object the requested data
	 */
	async single(apiInterface, identifier, options = {}) {
		apiInterface = this._buildInterface(apiInterface, options.with);
		return this.search(apiInterface + '/' + identifier, options.where);
	}

	/**
	 * Retrieve all record of the specified type
	 *
	 * @param {String} apiInterface ZEST API interface (http://developers.zeald.com/doku.php?id=dataapi:start)
	 * @param {Object} where optional additional where parameters to pass to further restrict results
	 * @param {Object} options additional optional options for further configuration
	 * @param {Integer} options.limit optional only retrieve this many records
	 * @returns {Promise<any>} a promise resolving to an object the requested data
	 */
	async search(apiInterface, where = {}, options = {}) {
		// determine the singular of the root element & strip any non word characters (e.g. brackets)
		const rootElement = this._singular(
			apiInterface.split(/[\+\/]/)
				.shift()
				.replace(/\W/, '')
		);

		// restrict the number of results if required
		if (options.limit) {
			where._results = options.limit;
		}

		// retrieve the result & relove to the requested data
		return new Promise(async (resolve, reject) => {
			try {
				// retrieve the requested data
				const result = await this.request(apiInterface, where);
				resolve(result[rootElement]);
			} catch (error) {
				reject(order);
			}
		});
	}

	/**
	 * Call a ZEST API subroutine using the 'Run' API to call exposed classes/routines
	 * Documented in logic/Controller/API/Run.pm
	 *
	 * @param {String} execute Run API exposed class/routine
	 * @param {Object} args named arguments to pass through to the perl class (received as hashref)
	 * @return {Mixed} whatever the called method returns
	 */
	async call(execute, args) {
		const xml = xmlConverter.js2xml({
			Call: {
				Arg: args
			}
		}, {
			compact: true
		});

		// retrieve the result & relove to the requested data
		return new Promise(async (resolve, reject) => {
			try {
				// retrieve the requested data
				const result = await this.request('Run/' + execute, xml, 'post');
				resolve(result.rsp.result);
			} catch (error) {
				reject(order);
			}
		});
	}

	/**
	 * Submit an API request & parse the response
	 * @param {String} apiInterface ZEST API interface (http://developers.zeald.com/doku.php?id=dataapi:start)
	 * @param {String|Object} args if `get`, will transform into a querystring. If `post` expects XML for the payload
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
				config.headers = config.headers || {};
				config.headers['Content-Type'] = 'text/xml';
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
	 * Accept options / settings requesting additional interfaces with readable keys 
	 * and map them to ZEST API interfaces
	 * @param {Object} map a mapping of supported readable keys mapping to their associated ZEST API interfaces
	 * @param {Object} options saying if these readable keys are requested - e.g. lines: true - for an order
	 * @returns {Array} an array of ZEST API interfaces that have been requested for inclusion
	 */
	_buildRelated(map, options) {
		const related = [];
		for (const readable in map) {
			if (options[readable]) {
				related.push(map[readable]);
			}
		}
		return related;
	}

	/**
	 * process an interface & related interfaces into a standard ZEST API interface string
	 * @param {String} apiInterface ZEST API interface (http://developers.zeald.com/doku.php?id=dataapi:start)
	 * @param {String/Object} related a related interface (or array of interfaces) to
	 *     retrieve along with the order e.g. ['OrderLine', 'Customer']
	 * @returns {String} ZEST API interface e.g. Order+OrderLine+Customer
	 */
	_buildInterface(apiInterface, related = []) {
		if (!Array.isArray(related)) {
			related = [related];
		}
		related.unshift(apiInterface);
		return related.join('+');
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
	 * Converts a string to its singular form - e.g. Orders = Order, Enquiries = Enquiry
	 * @param {String} string plural version of string to convert
	 * @returns {String} singular version of string
	 */
	_singular(string) {
		string = string.replace(/ies$/, 'y');
		string = string.replace(/s$/, '');
		return string;
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
