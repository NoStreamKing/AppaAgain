const { chromium } = require('playwright');

exports.getTikTokData = async (isHeadless) => {
  console.time('getTikTokData');
  const browser = await chromium.launch({ headless: isHeadless });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.tiktok.com/@itskayeteaa');

  const tiktokElement = await page.$('.tiktok-x6y88p-DivItemContainerV2');
  const firstAnchor = await tiktokElement.$('a');

  let link = await page.evaluate(el => el.href, firstAnchor);

  await browser.close();

  console.timeEnd('getTikTokData');

  return link;
}