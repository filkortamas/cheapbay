const db = require('./db');

function formatPrice(price) {
  return parseFloat(price.replace(',', ''));
}

async function changedItems(currentItems) {
  const dataBase = await db.openDb();
  const previousItemsLinks = await db.selectItemsLink(dataBase);
  const changed = {
    removableItemLinks: []
  };

  changed.new = currentItems.filter(
    currentItem => !previousItemsLinks.includes(currentItem.link)
  );

  changed.removableItemLinks = previousItemsLinks.filter(
    previousItemsLink =>
      !currentItems
        // Only current items' links
        .map(currentItem => currentItem.link)
        .includes(previousItemsLink)
  );

  await db.closeDb(dataBase);
  return new Promise(resolve => {
    if (changed.new.length > 0 || changed.removableItemLinks.length > 0) {
      resolve(changed);
    }
    resolve(null);
  });
}

module.exports = {
  formatPrice,
  changedItems
};
