var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', scrapeEPS, function(req, res) {
  res.json({eps: res.locals.eps});
});

async function scrapeEPS(req, res, next) {
  const puppeteer = require('puppeteer');

  const browser = await puppeteer.launch({'args' : [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  ignoreDefaultArgs: ['--disable-extensions']});
  const page = await browser.newPage();

  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    browser.close();
  });

  await page.goto("https://www.macrotrends.net/stocks/charts/GOOG/alphabet/eps-earnings-per-share-diluted");

  await page.waitForSelector('#jqxInput'); // wait for input box to appear
  await page.focus('#jqxInput'); 
  await page.keyboard.type(req.query.ticker); // fill in input box with ticker
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter'); // click enter on keyboard as there is no submit button
  await page.waitForSelector('.historical_data_table.table'); // wait for page to load before searching

  const EPS = await page.evaluate(() => {
      const table = document.querySelector(".historical_data_table.table");
      let td = Array.from(table.querySelectorAll("tbody tr td"));
      const newArray = new Array(10).fill(0);
      let curr = 1;
      for (let i = 0; i <= 9; i += 1) {
          if (curr + (i*2) >= td.length) {
              break;
          }
          newArray[i] = td[curr + (i*2)].innerText.substring(1);
      }
      return newArray;
      });

  console.log(EPS);
  await browser.close();
  res.locals.eps = EPS;
  next();
}

module.exports = router;
