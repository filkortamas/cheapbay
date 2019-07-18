
const cheerio = require('cheerio');
const axios = require('axios');

function formatPrice(price) {
  return parseFloat(price.replace(',', ''));
}

async function getHtml(searchString) {
  const { data: html } = await axios.get(`https://www.ebay.com/sch/i.html?_nkw=${searchString}&rt=nc&LH_PrefLoc=5`);
  return html;
}

function getItem(html) {
  const $ = cheerio.load(html);
  const items = $(`.s-item`).toArray()
    .filter(el => !$(el).find('.s-item__title--tag').length)
    .filter(el => !$(el).prevAll('.srp-river-answer--REWRITE_START').length)
    .map(el => {
      let [price, currency] = $(el).find('.s-item__price').text().split(' ');
      price = formatPrice(price);
      const shipping = formatPrice($(el).find('.s-item__logisticsCost').text());
      const fullPrice = price + shipping;
      return {
        title: $(el).find('.s-item__title').text(),
        link: $(el).find('.s-item__link').attr('href'),
        currency,
        price,
        shipping,
        fullPrice,
        location: $(el).find('.s-item__itemLocation').text().replace('From ', ''),
        status: $(el).find('.s-item__subtitle .SECONDARY_INFO').text(),
        topSeller: $(el).find('.s-item__etrs-text').length ? true : false,
        auctionTimeLeft: $(el).find('.s-item__time-left').text() || null,
      }
    })
  return items;
}

module.exports = {
  getHtml,
  getItem
};