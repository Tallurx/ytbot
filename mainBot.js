// require your node modules
const bot = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
bot.use(StealthPlugin());
const fs = require("fs");
const useProxy = require('puppeteer-page-proxy')


// this getRandomItem function will be getting a random item from a link (json file)
async function getRandomItem(link) {
    let data = await fs.readFileSync(link, "utf-8");
    let proccessedData = JSON.parse(data)
    let proccessedDataLength = proccessedData.length;
    let urlIndex = Math.floor(Math.random() * proccessedDataLength)
    return (proccessedData[urlIndex])
}


const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// this gets random time
function timer(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

const pages = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"]

// The runAsenseBot is the main function (thing) that will run when ever we lauch this

async function runAdsenseBot() {
    const bcTime = timer(1200000, 240000)
    console.log(`>>>>>>All Browsers will be closed in : ${bcTime / 60000} minutes <<<<<<`)

    const nTime = timer(0, 10)
    console.log(`>>>>>>>> The number of pages to be opened is : ${nTime} pages <<<<<<<< \n`)

    const args = [
        '--no-zygote',
        `--proxy-server=premium.residential.proxyrack.net:9000`,
        '--no-sandbox',
        '--disable-gpu',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--disable-accelerated-2d-canvas',
        '--disable-dev-shm-usage',
    ];

    const botConfiguration = {
        args: args,
        headless: false,
        ignoreHTTPSErrors: true,
        ignoreDefaultArgs: ["--enable-automation"],
        defaultViewport: null,
        devtools: false,
    }

    // lets launch the browser here (chrome)
    const chromeBrowser = await bot.launch(botConfiguration)
    try {
        for (pag in pages.slice(0, nTime)) {
            const npTime = timer(180000, 600000)
            console.log(`====== Another link  will be opened in ${npTime / 60000} minutes ======`)
            utile(chromeBrowser)
            await sleep(npTime)
            console.log(`======= browser ${pag} created ====== \n`)
        }

    } catch (e) {
        if (e) {
            chromeBrowser.close()
            runAdsenseBot()
        }
        console.log(e)
    } finally {
        if (nTime == 0) {
            chromeBrowser.close()
            runAdsenseBot()
        } else {
            setTimeout(async function () {
                const nbtime = timer(60000, 180000)
                chromeBrowser.close()

                console.log(`\n ======== Entire Browser has closed. Please wait for restart in ${nbtime / 1000} seconds =========`)
                await sleep(nbtime);

                runAdsenseBot()

            }, bcTime)
        }
    }



    async function utile(browser) {
        let userAgent = await getRandomItem("assets/list-of-UA.json")
        //console.log(" we have picked a user agent  :", userAgent)


        let url = await getRandomItem("assets/list-of-links.json")
        // console.log(" we have picked a link", url)


        let proxy = await getRandomItem("assets/proxyrack.json");
        console.log(`====== we have picked this proxy: ${proxy} ======`)

        let cookies = await getRandomItem("assets/list-of-cookies.json");
        //console.log("the cookies are : ", cookies)

        try {
            const chromeBrowserPage = await browser.newPage()
            await chromeBrowserPage.setDefaultNavigationTimeout(0);
            // await chromeBrowserPage.setViewport({
            //     width: 1920 + Math.floor(Math.random() * 100),
            //     height: 3000 + Math.floor(Math.random() * 100),
            //     deviceScaleFactor: 1,
            //     hasTouch: true,
            //     isLandscape: false,
            //     isMobile: false,
            // });

            await chromeBrowserPage.setUserAgent(userAgent);
            await chromeBrowserPage.setCookie(...cookies);
            await chromeBrowserPage.goto(url, { waitUntil: 'networkidle2', setTimeout: 0 })

            await chromeBrowserPage.keyboard.press('Space')
        } catch (e) {
            console.log(e)
        }
    }
}

runAdsenseBot()