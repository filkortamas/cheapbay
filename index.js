const scraper = require('./lib/scraper');
const db = require('./lib/db');
const express = require('express');
const app = express();

const port = 3000;


app.get('/scrape', async (req, res) => {
  const html = await scraper.getHtml('thinkpad+x1+6th');
  const scrapedItems = scraper.getItem(html);
  res.json(scrapedItems);
  
  scrapedItems.forEach(item => {
    db.addItemToDb(item)
  });
})

app.listen(port, () => console.log(`Cheabay app listening on port ${port}!`))