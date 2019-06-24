const { notDefined } = require('./functions');
const { ChromeDriverBuilder } = require('./ChromeDriverBuilder');
const { FirefoxDriverBuilder } = require('./FirefoxDriverBuilder');

/**
 * Driver factory class
 *
 */
class DriverFactory {
	/**
	 * Build method
	 *
	 * @param type Type of driver (chrome, firefox)
	 * @param envPath Path of the env file
	 * @param screen Screen config
	 * @param implicitTimeout Implicit timeout value
	 * @returns {ThenableWebDriver}
	 */
	static build({ type, envPath, screen, implicitTimeout }) {
		let driver = null;

		if (notDefined(screen)) {
			screen = {
				width: 1024,
				height: 768
			};
		}

		if (notDefined(type)) {
			// default it to chrome
			type = 'chrome';
		}

		if (notDefined(implicitTimeout)) {
			implicitTimeout = 5000;
		}

		switch (type) {
			case 'firefox':
			case 'FIREFOX':
				driver = new FirefoxDriverBuilder(envPath, screen).build();
				break;
			default:
				// chrome is the default driver
				driver = new ChromeDriverBuilder(envPath, screen).build();
		}

		driver.manage().setTimeouts({
			implicit: implicitTimeout
		}).catch((err) => console.error(err));

		return driver;
	}
}

module.exports.DriverFactory = DriverFactory;
