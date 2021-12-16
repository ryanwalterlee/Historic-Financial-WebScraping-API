var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', scrapePE, function(req, res, next) {
  res.json({pe: res.locals.pe});
});

async function scrapePE(req, res, next) {
  const puppeteer = require('puppeteer');

  const browser = await puppeteer.launch({'args' : [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]});
  const page = await browser.newPage();
  await page.goto("https://www.macrotrends.net/stocks/charts/GOOG/alphabet/pe-ratio");

  await page.waitForSelector('#jqxInput'); // wait for input box to appear
  await page.focus('#jqxInput');
  await page.keyboard.type(req.query.ticker); // fill in input box with ticker
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter'); // click enter on keyboard as there is no submit button
  await page.waitForSelector('.table'); // wait for page to load before searching

  const PE = await page.evaluate(() => {
      const table = document.querySelector(".table");
      let td = Array.from(table.querySelectorAll("tbody tr td"));
      const newArray = new Array(10).fill(0);
      let curr = 3; // position of PEratio wanted
      for (let i = 0; i <= 9; i += 1) {
          if (curr + (i*16) >= td.length) {
              break;
          }
          newArray[i] = (td[curr + (i*16)].innerText);
      }
      return newArray;

      });

  console.log(PE);
  await browser.close();
  res.locals.pe = PE;
  next();
}

module.exports = router;

