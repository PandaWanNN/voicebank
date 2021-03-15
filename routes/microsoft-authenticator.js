const {Builder, By, until} = require('selenium-webdriver');

const startMicrosoftAuth = async () => {
    let driver = await new Builder().forBrowser('safari').build();
    try {
        await driver.get('http://www.office.com');
        let loginBtn = await driver.findElement(By.linkText("Anmelden"));
        loginBtn.click();

        await driver.wait(until.elementLocated(By.name("loginfmt")), 10000);

        let emailField = await driver.findElement(By.name('loginfmt'));
        await emailField.sendKeys(process.env.OFFICE_MAIL);
        let continueBtn = await driver.findElement(By.xpath('//input[@type="submit" and @value="Weiter"]'));
        continueBtn.click();

        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), '" + process.env.OFFICE_MAIL + "')]")),
                          10000);
        let passwordField = await driver.findElement(By.xpath('//input[@name="passwd"]'));
        await passwordField.sendKeys(process.env.OFFICE_PASSWORD);
        let submitBtn = await driver.findElement(By.xpath('//input[@value="Anmelden"]'));
        await submitBtn.click();
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Angemeldet bleiben?')]")), 20000);
        console.log("microsoft auth button pressed");

    } catch (e) {
        console.log(e);
    } finally {
        await driver.quit();
    }
};

// startMicrosoftAuth().then(r => console.log("success"));

module.exports = startMicrosoftAuth;