const db = require('./db');

function formatPrice(price) {
  return parseFloat(price.replace(',', ''));
}

async function changedItems(currentItems) {
  const dataBase = await db.openDb();
  const previousItemsLinks = await db.selectItemsLink(dataBase);
  const changed = {
    removable: []
  };

  changed.new = currentItems.filter(currentItem => {
    if (!previousItemsLinks.includes(currentItem.link)) {
      return currentItem;
    } else {
      changed.removable.push(
        previousItemsLinks[previousItemsLinks.indexOf(currentItem.link)]
      );
    }
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
