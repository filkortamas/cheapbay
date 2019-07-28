const express = require('express');
const scraper = require('./lib/scraper');
const db = require('./lib/db');
const utility = require('./lib/utility');

const app = express();
const port = 3000;

async function initSettings() {
  const dataBase = await db.openDb();
  await db.createSettingsTable(dataBase);
}

app.get('/scrape', async (req, res, next) => {
  const result = {
    hasChange: false,
    changes: []
  };
  const dataBase = await db.openDb();
  const setting = await db.selectSettings(dataBase);
  // TODO: Create convertSearchString utility function and upgrade screaper.js
  // const searchString = utility.convertSearchString(setting);
  // const html = await scraper.getHtml(searchString)
  const html = await scraper.getHtml('thinkpad+x1+6th');
  const scrapedItems = scraper.getItem(html);

  result.changes = await utility.changedItems(scrapedItems);

  if (!result.changes) {
    res.json(result);
    return;
  }

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
initSettings();
