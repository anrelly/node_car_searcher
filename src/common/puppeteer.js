import Puppeteer from "puppeteer";

class MyPuppeteer {
    constructor(Puppeteer) {
        this.launchOptions = {
            headless: true,
            ignoreHTTPSErrors: true,
            args: [
                '--disable-extensions',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--no-first-run',
                '--no-sandbox',
                '--window-size=1920x1080',
                '--disable-web-security',
            ]
        };
        this.pageOptions = {
            waitUntil: ['networkidle2', 'domcontentloaded'],
            timeout: 9000000//30000
        };

        this.puppeteer = Puppeteer;
    }

    async pageGetContent(url) {
        const browser = await this.puppeteer.launch(this.launchOptions);
        try {
            const page = await browser.newPage();
            await page.goto(url, this.pageOptions);
            const content = await page.content();
            await browser.close();

            return content;
        } catch (e) {
            if(browser){
                await browser.close();
            }
            console.log(e);
            console.log('SEND ERROR FROM PUPPETEER');
            return false;
        }
    }
}

export default new MyPuppeteer(Puppeteer);