// seleniumHelper.js
const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

async function createFirefoxDriver() {
    let options = new firefox.Options();

    // Uncomment to run in headless mode
    // options.headless();

    const driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options)
        .build();

    return driver;
}

module.exports = { createFirefoxDriver };
