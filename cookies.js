const bot = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
bot.use(StealthPlugin());
const fs = require('fs').promises;
const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
async function getRandomItem(link) {
    let data = await fs.readFile(link, "utf-8");
    let proccessedData = JSON.parse(data)
    return (proccessedData)
}

(async () => {
    let emails = await getRandomItem("assets/email.json")
    let password = await getRandomItem("assets/password.json");

    for (all in emails) {
        const browser = await bot.launch({
            headless: false,
            ignoreDefaultArgs: ["--enable-automation"],

        });
        const page = await browser.newPage();
        try {
            await page.setDefaultNavigationTimeout(0);

            await page.goto("https://accounts.google.com/signin/v2/identifier", {
                waitUntil: "networkidle2", timeout: 0,
            });
            await sleep(5000)

            await page.waitForSelector('#identifierId')
            await page.type('input[type="email"]', emails[all]);
            await sleep(5000)
            await page.keyboard.press('Enter')


            await sleep(5000)
            await page.type(
                'input[type="password"]',
                password[all]
            );

            await sleep(5000);

            await page.keyboard.press('Enter')
            await sleep(5000)
            await page.waitForSelector('#gbwa > .gb_yf > .gb_A > .gb_Ue > path')
            await sleep(10000)

            // save cookies
            const cookies = await page.cookies();
            fs.appendFile('./cookies.json', JSON.stringify(cookies, null, 2) + ",", 'utf8');

            // await sleep(10000)
            console.log(`====== ${emails[all]} logged in and Cookies has beeen succesfully extracted and saved ======`)
            await sleep(10000)

        } catch (e) {
            console.log(`Either ${emails[all]} or Password is incorrect`)
        } finally {
            await browser.close();
            await sleep(10000)

        }
    }


})();