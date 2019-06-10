const axios = require('axios');
const xmlConverter = require('xml-js');
const { notDefined } = require('./functions');

const path = require('path');
const dotenv = require('dotenv');

const TEST_ENV_FILE_PATH = process.env.TEST_ENV_FILE ?
	process.env.TEST_ENV_FILE : __dirname+'/../override/default/.env';

dotenv.config({
	path: path.resolve(TEST_ENV_FILE_PATH)
});

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
		this._apiBaseURL = notDefined(apiBaseURL) ? process.env.API_BASE_URL : apiBaseURL;
		this._apiKey = notDefined(apiKey) ? process.env.API_KEY : apiKey;
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
	 * Enquiries
	 *
	 * @param subject Subject text
	 * @param enquiry Enquiry text
	 * @param status Status
	 * @param method HTTP method
	 * @returns {Promise<void>}
	 */
	async enquiries(subject, enquiry, status, method) {
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
						enquires.push(ZestApi.extractData(result));
					});
				} else {
					enquires.push(ZestApi.extractData(enquiryResult));
				}

				return enquires;
			}).catch((err) => console.error(err));
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 * Helper function that extracts text from the enqury response
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
	static extractData(result) {
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
}

module.exports.ZestApi = ZestApi;
