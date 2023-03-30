const { chromium } = require('playwright');

exports.getLatestInstagramPost = async () => {
  // start timer console
  console.time('getLatestInstagramPost');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const url = 'https://www.inststalk.com/user/kayeteaa_/';
  await page.goto(url);
  await page.waitForSelector('[alt="kayeteaa_ instagram post image"]', { timeout: 10000 });

  const imageSelector = '[alt="kayeteaa_ instagram post image"]';
  const captionSelector = '.info-area > .description';
  let imageUrl,caption = undefined;


  // do while imageUrl is undefined or is the loader gif
  do{

    imageUrl = await page.$eval(imageSelector, (el) => el.getAttribute('src'));
    caption = await page.$eval(captionSelector, (el) => el.textContent);

  }while(imageUrl === undefined || imageUrl == '/public/img/template/loader-card.gif');
  console.timeEnd('getLatestInstagramPost');
  await browser.close();
  return { imageUrl, caption };
};
