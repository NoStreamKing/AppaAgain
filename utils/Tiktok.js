const puppeteer = require('puppeteer');

exports.getTikTokData = async (isHeadless) => {
  const browser = await puppeteer.launch({headless: isHeadless});
  const page = await browser.newPage();

  await page.goto('https://www.tiktok.com/@itskayeteaa');

  const tiktokElement = await page.$('.tiktok-x6y88p-DivItemContainerV2');
  const firstAnchor = await tiktokElement.$('a');

  let link = await page.evaluate(el => el.href, firstAnchor);
  
  await browser.close();

  return link;

}
