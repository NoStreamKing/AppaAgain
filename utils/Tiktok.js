const puppeteer = require('puppeteer');

exports.getTikTokData = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto('https://www.tiktok.com/@itskayeteaa');

  const tiktokElement = await page.$('.tiktok-x6y88p-DivItemContainerV2');
  const firstAnchor = await tiktokElement.$('a');

  let link = await page.evaluate(el => el.href, firstAnchor);
  
  await browser.close();

  await console.log("Tiktok has been checked");

  return link;

}
