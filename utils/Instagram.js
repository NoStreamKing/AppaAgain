const puppeteer = require('puppeteer');

exports.getLatestInstagramPost = async () => {

  const browser = await puppeteer.launch({ headless: true});
  const page = await browser.newPage();
  const url = 'https://www.inststalk.com/user/idkkatietrinh?id=3965101965';
  await page.goto(url);
  await page.waitForTimeout(5000);
  const imageSelector = '[alt="idkkatietrinh instagram post image"]';
  await page.waitForSelector(imageSelector);
  const imageUrl = await page.$eval(imageSelector, img => img.src);

  await browser.close();


  return imageUrl;
};


/*
    const browser = await puppeteer.launch({ headless: false });
    // set user agent for firefox windows 10
    browser.userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0');
    const page = await browser.newPage();

    // 1. Go to the Instagram login page
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    const postLinkSelector = '._aabd._aa8k._aanf a';
    await page.waitForSelector(postLinkSelector);
    const postLink = await page.$eval(
      postLinkSelector,
      (el) => el.getAttribute('href')
    );
    await browser.close();
 
    return postLink;
*/