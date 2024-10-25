// login.test.js
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Login Functionality', function () {
    let driver;

    // Set a longer timeout for all tests in this suite
    this.timeout(30000); // Increase to 30 seconds to handle longer waits

    // Before each test, initialize the WebDriver
    before(async function () {
        driver = await new Builder().forBrowser('firefox').build(); // Change 'firefox' to 'chrome' or 'edge' if necessary
    });

    // Test case for successful login
    it('should login successfully with valid credentials', async function () {
        try {
            await driver.get('http://localhost:3000/login'); // Replace with your application's URL

            // Wait for the login form to load and for email input to be visible
            const emailInput = await driver.wait(until.elementLocated(By.id('email')), 10000);
            await driver.wait(until.elementIsVisible(emailInput), 10000);
            await emailInput.sendKeys('admin@admin.com'); // Use a valid email

            // Wait for password input to be visible
            const passwordInput = await driver.wait(until.elementLocated(By.id('password')), 10000);
            await driver.wait(until.elementIsVisible(passwordInput), 10000);
            await passwordInput.sendKeys('admin'); // Use a valid password

            // Click the login button
            const loginButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Log in')]")), 10000);
            await driver.wait(until.elementIsVisible(loginButton), 10000);
            await loginButton.click();

            // Wait for navigation to the next page
            await driver.wait(until.urlIs('http://localhost:3000/admin'), 10000); // Adjust expected URL

            // Validate that the user is on the correct page
            const currentUrl = await driver.getCurrentUrl();
            assert.strictEqual(currentUrl, 'http://localhost:3000/admin', 'The user is not redirected to the admin page after login.');

            // Additional checks: verify the presence of a specific element on the admin page
            const adminPanel = await driver.wait(until.elementLocated(By.id('adminPanel')), 10000); // Replace with an actual ID or selector
            assert(adminPanel.isDisplayed(), 'Admin panel is not displayed after login.');

        } catch (error) {
            console.error('Error during login test:', error);
            throw error; // Re-throw the error after logging it
        }
    });

    // After each test, quit the WebDriver
    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});
