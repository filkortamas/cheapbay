const db = require('./db');

function formatPrice(price) {
  return parseFloat(price.replace(',', ''));
}

async function changedItems(currentItems) {
  const dataBase = await db.openDb();
  const previousItemsLinks = await db.selectItemsLink(dataBase);
  const changed = currentItems.filter((currentItem, i) => {
    return currentItem.link !== previousItemsLinks[i];
  });
  await db.closeDb(dataBase);
  return new Promise(resolve => {
    if (changed.length > 0) {
      resolve(changed);
    }
    resolve(null);
  });
}

module.exports = {
  formatPrice,
  changedItems
};
