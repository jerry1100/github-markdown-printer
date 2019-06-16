const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('https://github.com/electron/electron');
  await page.addStyleTag({ path: '../src/style.css' });
  await page.emulateMedia('print');
  await page.screenshot({ path: 'screenshot.png' });

  await browser.close();
})();
