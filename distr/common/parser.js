"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const cheerio = require('cherio');

const url = require('url');

const findEq = require('cheerio-eq');

class Parser {
  constructor(myPuppeteer, request, settings, processLogger) {
    this.request = request;
    this.puppeteer = myPuppeteer;
    this.settings = settings;
    this.processLogger = processLogger;
  }

  async handlePost(post) {
    console.log(post);
    this.processLogger.startProcess(); // Log Process

    this.processLogger.setStatusStep('get_fist_page_start'); // Log Process

    let content = await this.puppeteer.pageGetContent(post.url);
    const $ = cheerio.load(content, {
      normalizeWhitespace: true,
      decodeEntities: false
    }); // let firstPageLinks = this.getLinksFromContent($, "div.catalog__items-container div.catalog__products section h2.catalog-product__title a, div.col-lg-8 > div.catalog__products > section h2.catalog-product__title a");

    let firstPageLinks = this.getLinksFromContent($, post.search.pages.page_links); // console.log(firstPageLinks);

    this.processLogger.setStatusStep('get_fist_page_end'); // Log Process

    this.processLogger.setStatusStep('get_pagen_pages_start'); // Log Process
    // let countPages = this.getPagenFromFirstPageContent($, "aside div.count-btn-box button:eq(0)", firstPageLinks.length);

    let countPages = this.getPagenFromFirstPageContent($, post.search.pages.pagen, firstPageLinks.length); // console.log(countPages);

    this.processLogger.setStatusElementsCount(countPages); // Log Process
    // let pagenLinks = await this.getLinksFromPagenPages(countPages, post.url, "div.catalog__items-container div.catalog__products section h2.catalog-product__title a, div.col-lg-8 > div.catalog__products > section h2.catalog-product__title a");

    let pagenLinks = await this.getLinksFromPagenPages(countPages, post.url, post.search.pages.page_links, post.options.pagen); //console.log(pagenLinks);

    this.processLogger.setStatusStep('get_pagen_pages_end'); // Log Process

    let allLinks = [].concat(firstPageLinks, pagenLinks);
    console.log(allLinks);
    console.log(allLinks.length);
    this.processLogger.setStatusStep('get_detail_pages_start'); // Log Process

    this.processLogger.setStatusElementsCount(allLinks.length); // Log Process

    let result = await this.getDetailPagesData(allLinks, post.url, post.search.detail);
    console.log(result);
    console.log(result.length);
    this.processLogger.setStatusStep('get_detail_pages_end'); // Log Process

    this.processLogger.finishProcess(); // Log Process
  }

  execCherioSelect(node, func, arg) {
    let rez = null;

    if (['text', 'html'].includes(func)) {
      rez = node[func]().trim();
    } else {
      rez = node[func](arg);
    }

    return rez;
  }

  getLinksFromContent($, pageLinksSearchOptions) {
    let self = this;
    let pageLinks = [];
    findEq($, pageLinksSearchOptions.selector).each(function (i, elem) {
      let curNode = $(elem);
      let link = self.execCherioSelect(curNode, pageLinksSearchOptions.method.function, pageLinksSearchOptions.method.args);
      pageLinks.push(link);
    });
    return pageLinks;
  } // getLinksFromContent($, linksSelector) {
  //     let pageLinks = [];
  //     findEq($, linksSelector).each(function (i, elem) {
  //         let curNode = $(elem);
  //         let link = curNode.attr('href');
  //         pageLinks.push(link);
  //     });
  //     return pageLinks;
  // }


  getPagenFromFirstPageContent($, pagenSearchOptions, firstPageCountLinks) {
    let countPages = 1;

    if (firstPageCountLinks > 0) {
      let allCountItemsText = this.execCherioSelect(findEq($, pagenSearchOptions.selector), pagenSearchOptions.method.function, pagenSearchOptions.method.args);
      let countAllItems = parseInt(allCountItemsText.replace(/[^\d]/g, ''));
      countPages = Math.ceil(countAllItems / firstPageCountLinks);
    }

    return countPages;
  } // getPagenFromFirstPageContent($, pagenSelector, firstPageCountLinks) {
  //     let countPages = 1;
  //     if (firstPageCountLinks > 0) {
  //         let allCountItemsText = findEq($, pagenSelector).text();
  //         let countAllItems = parseInt(allCountItemsText.replace(/[^\d]/g, ''));
  //         countPages = Math.ceil(countAllItems / firstPageCountLinks);
  //     }
  //     return countPages;
  // }


  async getLinksFromPagenPages(countPages, sourceUrl, pageLinksSearchOptions, pagenOptions) {
    let linksFromPagen = [];

    if (countPages > 1) {
      for (let page = 2; page <= countPages; page++) {
        const currentUrl = this.processCurrentPageUrl(sourceUrl, pagenOptions, page);
        console.log('page = ' + page);
        console.log(currentUrl); //let currentUrl = sourceUrl.replace(/page=\d{1}/, `page=${page}`);

        let pagenPageContent = await this.puppeteer.pageGetContent(currentUrl);
        let currentPagelinks = this.getLinksFromContent(cheerio.load(pagenPageContent, {
          normalizeWhitespace: true,
          decodeEntities: false
        }), pageLinksSearchOptions);
        linksFromPagen.push(...currentPagelinks);
      }
    }

    return linksFromPagen;
  }

  processCurrentPageUrl(sourceUrl, pagenOptions, pageNum) {
    let rezUrl = '';
    const pagenOptionsLocal = { ...pagenOptions
    }; // clone

    const regex = new RegExp(pagenOptionsLocal.regex);
    let correction = isNaN(parseInt(pagenOptionsLocal.correction)) ? 0 : parseInt(pagenOptionsLocal.correction);
    const page = pageNum + correction;
    let replaсement = pagenOptionsLocal.replaсement;
    replaсement = replaсement.replace(new RegExp('#iterator#'), page);

    if (regex.test(sourceUrl)) {
      rezUrl = sourceUrl.replace(regex, replaсement);
    } else {
      rezUrl = sourceUrl + pagenOptionsLocal.separator + replaсement;
    }

    return rezUrl;
  }

  async getDetailPagesData(links, sourceUrl, detailSearchOptions) {
    let detailData = [];
    let urlParts = new URL(sourceUrl);

    for await (let link of links) {
      let detailUrl = new URL(link, `${urlParts.origin}`).href;
      let detailPageContent = await this.puppeteer.pageGetContent(detailUrl);
      let currentDetailData = this.parseDetail(cheerio.load(detailPageContent, {
        normalizeWhitespace: true,
        decodeEntities: false
      }), detailSearchOptions, detailUrl);
      detailData.push(currentDetailData);
    }

    return detailData;
  }

  parseDetail($, detailSearchOptions, link = null) {
    const self = this;
    let fields = { ...self.settings.detailFields
    }; // clone

    fields.link = link;

    for (const option in detailSearchOptions) {
      if (fields.hasOwnProperty(option)) {
        fields[option] = self.execCherioSelect(findEq($, detailSearchOptions[option].selector), detailSearchOptions[option].method.function, detailSearchOptions[option].method.args);
      }
    } // trying ty get year make(if not sets) from name(if it sets)


    if (fields.year === null && fields.name !== null) {
      const found = fields.name.match(/(\d{4})+/g);
      const tmp = parseInt(Array.isArray(found) ? found.pop() : null);
      fields.year = isNaN(tmp) ? null : tmp;
    } // fields.name = findEq($,'div.product-page__title h1').text();
    // fields.year = parseInt(fields.name.replace(/[^\d{4}]/g, ''));
    // fields.price_usd = findEq($,'div.car-short-info div.price-secondary div.price-secondary__item:eq(0)').text();
    // fields.price_eur = findEq($,'div.car-short-info div.price-secondary div.price-secondary__item:eq(1)').text();
    // fields.price_grn = findEq($,'div.car-short-info div.car-short-info__price-views div.price').text();
    // fields.published = findEq($,'div.car-short-info div.car-short-info__location span.car-short-info__published').text();
    // fields.location = findEq($,'div.car-short-info div.car-short-info__location > div button').text();
    // fields.body = findEq($,'ul.short-characteristics > li.short-characteristics__item:eq(0) div.short-characteristics__item-val').text();
    // fields.mileage = findEq($,'ul.short-characteristics > li.short-characteristics__item:eq(1) div.short-characteristics__item-val').text();
    // fields.fuel = findEq($,'ul.short-characteristics > li.short-characteristics__item:eq(2) div.short-characteristics__item-val').text();
    // fields.engine = findEq($,'ul.short-characteristics > li.short-characteristics__item:eq(3) div.short-characteristics__item-val').text();
    // fields.additional = findEq($,'div.car-features ul.car-features__list li span').text();


    return fields;
  } //------------------------------
  // getStatus() {
  //     return this.status;
  // }
  // setStatusBusy(linksCount = -1) {
  //     this.status['is_busy'] = 1;
  //     this.status['started'] = +new Date;
  //     this.status['countItems'] = linksCount;
  // }
  // setStatusStep(stepKey) {
  //     if (this.settings.processStatus.step.hasOwnProperty(stepKey)) {
  //         this.status['step'] = this.settings.processStatus.step[stepKey];
  //     }
  // }
  // setStatusFree() {
  //     let self = this;
  //     for (let key in self.status) {
  //         self.status[key] = null;
  //     }
  // }


}

exports.default = Parser;