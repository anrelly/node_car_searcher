"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _puppeteer = _interopRequireDefault(require("puppeteer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MyPuppeteer {
  constructor(Puppeteer) {
    this.launchOptions = {
      headless: true,
      ignoreHTTPSErrors: true,
      args: ['--disable-extensions', '--disable-setuid-sandbox', '--disable-gpu', '--no-first-run', '--no-sandbox', '--window-size=1920x1080', '--disable-web-security']
    };
    this.pageOptions = {
      waitUntil: ['networkidle2', 'domcontentloaded'],
      timeout: 9000000 //30000

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
      if (browser) {
        await browser.close();
      }

      console.log(e);
      console.log('SEND ERROR FROM PUPPETEER');
      return false;
    }
  }

}

var _default = new MyPuppeteer(_puppeteer.default);

exports.default = _default;