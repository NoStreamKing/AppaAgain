const puppeteer = require('puppeteer');

exports.getLatestInstagramPost = async () => {
    const url = 'https://www.instagram.com/idkkatietrinh/';
    try {
        const browser = await puppeteer.launch({ headless: true});
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
    
        const postLinkSelector = '._aabd._aa8k._aanf a';
        await page.waitForSelector(postLinkSelector);
        const postLink = await page.$eval(postLinkSelector, (el) => el.getAttribute('href'));
    
        await browser.close();

        return postLink;
      } catch (error) {
        console.error(error);
      }
};