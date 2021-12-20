var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', scrapePrices, function(req, res) {
  res.json({prices: res.locals.prices});
});

async function scrapePrices(req, res, next) {
  const puppeteer = require('puppeteer');

  const browser = await puppeteer.launch({'args' : [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]});
  const page = await browser.newPage();
  await page.goto(`https://sg.finance.yahoo.com/quote/${req.query.ticker}/history?p=${req.query.ticker}`);

  await page.waitForSelector('.smartphone_Px(20px)'); // wait for input box to appear
  
  const prices = await page.evaluate(() => {
    const table = document.querySelector(".W(100%)");
    let td = Array.from(table.querySelectorAll("tbody tr td"));
    const listOfPrices = {};
    let curr = 0;
    for (let i = 0; i <=)
    return newArray;
    });
}