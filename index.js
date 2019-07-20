const express = require('express');
const scraper = require('./lib/scraper');
const db = require('./lib/db');
const utility = require('./lib/utility');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
  const html = await scraper.getHtml('thinkpad+x1+6th');
  const scrapedItems = scraper.getItem(html);

  const changedItems = await utility.changedItems(scrapedItems);
  
  if(!changedItems) return;

  const dataBase = await db.openDb();

  for (const item of changedItems) {
    await db.addItemToDb(dataBase, item);
  }

  await db.closeDb(dataBase);

  res.json(scrapedItems);
})

app.get('/kecske', async (req, res) => {
  const dataBase = await db.openDb();
  await db.selectFromDb(dataBase);
  res.json('kecske');
});

app.listen(port, () => console.log(`Cheabay app listening on port ${port}!`))