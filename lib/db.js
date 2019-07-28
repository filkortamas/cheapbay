const sqlite3 = require('sqlite3').verbose();

function openDb() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./db/scrape.db', err => {
      if (err) {
        reject(err.message);
      }
    });
    resolve(db);
  });
}

function createSettingsTable(db) {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS settings (
      search text,
      onlyeu integer
    )`,
      err => {
        if (err) {
          reject(err);
        }
      }
    );
    resolve(true);
  });
}

function addItemToDb(db, item) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS items (
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
        )`,
        err => {
          if (err) {
            reject(err);
          }
        }
      );

      db.run(
        `INSERT INTO items VALUES (${Object.values(item)
          .map(el => `'${el}'`)
          .join(', ')});`,
        err => {
          if (err) {
            reject(err);
          }
        }
      );
    });
    resolve(true);
  });
}

function selectSettings(db) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM settings`, [], (err, rows) => {
      if (err) {
        reject(err.message);
      }
      resolve(rows);
    });
  });
}

function selectItemsLink(db) {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS items (
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
      )`,
      err => {
        if (err) {
          reject(err);
        }
      }
    );

    db.all(`SELECT link FROM items`, [], (err, rows) => {
      if (err) {
        reject(err.message);
      }

      const links = [];

      if (!rows) return;

      rows.forEach(row => {
        links.push(row.link);
      });

      resolve(links);
    });
  });
}

function removeItemFromDb(db, link) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM items WHERE link=?`, link, err => {
      if (err) {
        reject(err);
      }
    });

    resolve(resolve);
  });
}

function closeDb(db) {
  return new Promise((resolve, reject) => {
    db.close(err => {
      if (err) {
        reject(err.message);
      }
    });
    resolve(true);
  });
}

module.exports = {
  openDb,
  addItemToDb,
  selectItemsLink,
  closeDb,
  removeItemFromDb,
  createSettingsTable,
  selectSettings
};
