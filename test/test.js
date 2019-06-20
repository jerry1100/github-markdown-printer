const fs = require('fs');
const { PNG } = require('pngjs');
const pixelMatch = require('pixelmatch');
const puppeteer = require('puppeteer');

const TEST_SCREENSHOT_FILENAME = 'test-screenshot.png';
const DIFF_SCREENSHOT_FILENAME = 'screenshot-diff.png';
const referenceImage = PNG.sync.read(fs.readFileSync('./reference-screenshot.png'));

let shouldReturnNonZeroExitCode = false;

(async () => {
  await testURL('https://github.com/jerry1100/github-markdown-printer/tree/master/test');
  await testURL('https://github.com/jerry1100/github-markdown-printer/blob/master/test/README.md');
  process.exit(shouldReturnNonZeroExitCode ? 1 : 0);
})();

async function testURL(url) {
  await takeScreenshot(url);

  const numDiffPixels = await compareWithReference();
  if (numDiffPixels !== 0) {
    console.log(`[Failed]: Rendered markdown at ${url} has ${numDiffPixels} different pixels`);
    shouldReturnNonZeroExitCode = true;
    return;
  }

  console.log(`[Passed]: Rendered markdown at ${url}`);
}

async function takeScreenshot(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(url);
  await page.addStyleTag({ path: '../src/style.css' });
  await page.emulateMedia('print');
  console.log('Waiting...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  await page.screenshot({ path: TEST_SCREENSHOT_FILENAME });
  await browser.close();
}

async function compareWithReference() {
  const testImage = PNG.sync.read(fs.readFileSync(TEST_SCREENSHOT_FILENAME));
  const { width, height } = testImage;
  const diff = new PNG({ width, height });
  const numDiffPixels = pixelMatch(referenceImage.data, testImage.data, diff.data, width, height);
  fs.writeFileSync(DIFF_SCREENSHOT_FILENAME, PNG.sync.write(diff));

  return numDiffPixels;
}
