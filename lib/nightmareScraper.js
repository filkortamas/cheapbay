/* const Nightmare = require('nightmare');

const nightmare = Nightmare({show: false});

async function getT480s() {
  nightmare
    .goto('https://global.momondo.com/flight-search/BUD-RMA/2019-08-10/2019-08-14?sort=price_a')
    .wait('.Common-Results-SpinnerWithProgressBar.finished')
    .evaluate(() => (
      Array.from(document.querySelectorAll('.above-button .display-price'))
        .map(el => el.innerHTML.trim().replace('&nbsp;', ''))
    ))
    .end()
    .then(price => {
      console.log(price)
    });
}

getT480s(); */
