const puppeteer = require('puppeteer');

exports.getLatestInstagramPost = async () => {
    const url = 'https://www.instagram.com/idkkatietrinh/';
    try {
        const browser = await puppeteer.launch({ headless: true});
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "load"});
    
        const postLinkSelector = '._aabd._aa8k._aanf a';
        await page.waitForSelector(postLinkSelector);
        const postLink = await page.$eval(postLinkSelector, (el) => el.getAttribute('href'));
  
        await browser.close();
        await console.log("Instagram has been checked");
        return postLink;
      } catch (error) {
        console.error(error);
      }
};