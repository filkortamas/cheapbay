const express = require('express');
const scraper = require('./lib/scraper');
const db = require('./lib/db');
const utility = require('./lib/utility');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
  const result = {
    hasChange: false,
    changes: []
  };
  const html = await scraper.getHtml('thinkpad+x1+6th');
  const scrapedItems = scraper.getItem(html);

  result.changes = await utility.changedItems(scrapedItems);

  if (!result.changes) {
    res.json(result);
    return;
  }

  const dataBase = await db.openDb();

  if (result.changes.new.length > 0) {
    for (const newItem of result.changes.new) {
      await db.addItemToDb(dataBase, newItem);
    }
  }

  if (result.changes.removableItemLinks.length > 0) {
    for (const removableItemLink of result.changes.removableItemLinks) {
      await db.removeItemFromDb(dataBase, removableItemLink);
    }
  }

  await db.closeDb(dataBase);

  res.json(result.changes);
});

app.get('/kecske', async (req, res) => {
  const dataBase = await db.openDb();
  await db.selectFromDb(dataBase);
  res.json('kecske');
});

app.listen(port, () => console.log(`Cheabay app listening on port ${port}!`));
