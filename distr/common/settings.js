"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Settings {
  constructor() {
    this.server = {};
    this.server.port = process.env.PORT || 8585; // ---

    this.detailFields = {
      link: null,
      id: null,
      published: null,
      name: null,
      year: null,
      mileage: null,
      engine: null,
      transmission: null,
      fuel: null,
      price_usd: null,
      price_eur: null,
      price_grn: null,
      body: null,
      color: null,
      location: null,
      additional: null
    };
    this.processStatus = {
      fields: {
        'is_busy': null,
        'step': null,
        'started': null,
        'finished': null,
        'elements_to_process_count': null
      },
      status: {
        not_busy: 0,
        busy: 1
      },
      step: {
        start: 0,
        get_fist_page_start: 1,
        get_fist_page_end: 2,
        get_pagen_pages_start: 3,
        get_pagen_pages_end: 4,
        get_detail_pages_start: 5,
        get_detail_pages_end: 6,
        finish: 7
      }
    }; // this.controller={};
    // this.bot={};
    // this.axios=axios;
    //
    // this.controller.ip= '5.101.121.179';
    // this.controller.host= 'api.marcomarello.ru';
    // this.controller.protocol= 'http://';
    // this.controller.user= 'admin';
    // this.controller.password= '25117600';
    // this.controller.basicAuth= 1;
    // this.controller.api='/api/v1/';
    //
    //
    // this.bot.port=3010;
    // this.bot.cpus=OS.cpus().length;
    // this.bot.pid=process.pid;
    // this.bot.id=5;
  }
  /*
  data.name = findEq($, 'div.product-page__title h1').text();
  data.year = parseInt(data.name.replace(/[^\d{4}]/g, ''));
  data.price_usd = findEq($, 'div.car-short-info div.price-secondary div.price-secondary__item:eq(0)').text();
  data.price_eur = findEq($, 'div.car-short-info div.price-secondary div.price-secondary__item:eq(1)').text();
  data.price_grn = findEq($, 'div.car-short-info div.car-short-info__price-views div.price').text();
  data.published = findEq($, 'div.car-short-info div.car-short-info__location span.car-short-info__published').text();
  data.location = findEq($, 'div.car-short-info div.car-short-info__location > div button').text();
  data.body = findEq($, 'ul.short-characteristics > li.short-characteristics__item:eq(0) div.short-characteristics__item-val').text();
  data.mileage = findEq($, 'ul.short-characteristics > li.short-characteristics__item:eq(1) div.short-characteristics__item-val').text();
  data.fuel = findEq($, 'ul.short-characteristics > li.short-characteristics__item:eq(2) div.short-characteristics__item-val').text();
  data.engine = findEq($, 'ul.short-characteristics > li.short-characteristics__item:eq(3) div.short-characteristics__item-val').text();
  data.additional = findEq($, 'div.car-features ul.car-features__list li span').text();
  * */


}

exports.default = Settings;