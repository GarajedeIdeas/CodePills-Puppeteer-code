const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    });

    const page = await browser.newPage();

    await page.goto('https://www.twitch.tv/');

    await page.waitForSelector('[data-test-selector="side-nav-card"]');

    const recomendados = await page.evaluate(() => {
        const items = document.querySelectorAll('[data-test-selector="side-nav-card"]');

        const arr = [];
        for (let item of items) {
            const canal = {};
            canal.name = item.querySelector('[data-a-target="side-nav-title"]').innerText;
            canal.image = item.querySelector('figure > img').src;
            canal.category = item.querySelector('[data-a-target="side-nav-game-title"] > p').innerText;
            canal.viewers = item.querySelector('[data-a-target="side-nav-live-status"] span').innerText;
            canal.url = item.querySelector('[data-test-selector="recommended-channel"]').href;

            arr.push(canal);
        }

        return arr;
    });


    for (let recomendado of recomendados) {
        await page.goto(recomendado.url);

        await page.waitForSelector('[data-a-target="stream-title"]');
        recomendado.description = await page.evaluate(() => document.querySelector('[data-a-target="stream-title"]').innerText);

        await page.screenshot({
            quality: 100,
            path: `./images/${recomendado.name}.jpg`
        });

        await timeout(4000);
    }

    console.log(recomendados);
    await browser.close();

})();

const timeout = (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
} 