const puppeteer = require('puppeteer');

exports.getLatestInstagramPost = async (isHeadless) => {

  const browser = await puppeteer.launch({ headless: isHeadless});
  const page = await browser.newPage();
  const url = 'https://www.inststalk.com/user/idkkatietrinh?id=3965101965';
  await page.goto(url);
  await page.waitForTimeout(5000);
  const imageSelector = '[alt="idkkatietrinh instagram post image"]';
  await page.waitForSelector(imageSelector);

  const captionSelector = '.info-area > .description';

  const imageUrl = await page.$eval(imageSelector, img => img.src);
  const caption = await page.$eval(captionSelector, caption => caption.innerText);

  await browser.close();


  return {imageUrl, caption};
};