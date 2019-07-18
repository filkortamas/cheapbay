const sqlite3 = require('sqlite3').verbose();

function addItemToDb(item) {
  const db = new sqlite3.Database('./db/scrape.db', (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS items (
        title text,
        link text PRIMARY KEY,
        currency text,
        price real,
        shipping real,
        fullPrice real,
        location text,
        status text,
        topSeller integer,
        auctionTimeLeft text
      )`, (err, rows) => {
        if (err) {
          throw err;
        }
    });

    db.run(`INSERT INTO items VALUES (${Object.values(item).map(el => `'${el}'`).join(', ')});`, (err, rows) => {
        if (err) {
          throw err;
        }
    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
}

module.exports = {
  addItemToDb
}