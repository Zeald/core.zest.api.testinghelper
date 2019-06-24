const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// this empty require is needed because windows 10 having PATH issues.
require('chromedriver');

/**
 * ChromeDriverBuilder class.
 *
 */
class ChromeDriverBuilder {
	/**
	 * Constructor
	 *
	 * @param envPath Path of the env file
	 * @param screen Screen config
	 */
	constructor(envPath, screen) {
		if (envPath) {
			dotenv.config({
				path: path.resolve(__dirname+envPath)
			});
		}

		this._screen = screen;
	}

	/**
	 * Build method
	 *
	 * @returns {ThenableWebDriver}
	 */
	build() {
		let driver = null;

		if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
			driver = new Builder()
				.forBrowser('chrome')
				.setChromeOptions(new chrome.Options().headless().windowSize(this._screen))
				.build();
		} else {
			driver = new Builder().forBrowser('chrome').build();
		}

		return driver;
	}
}

module.exports.ChromeDriverBuilder = ChromeDriverBuilder;
