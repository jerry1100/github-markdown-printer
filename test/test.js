const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelMatch = require('pixelmatch');
const puppeteer = require('puppeteer');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const REF_SCREENSHOT_PATH = path.join(SCREENSHOTS_DIR, 'ref.png');
const TEST_SCREENSHOT_PATH = path.join(SCREENSHOTS_DIR, 'test.png');
const DIFF_SCREENSHOT_PATH = path.join(SCREENSHOTS_DIR, 'diff.png');

const referenceImage = PNG.sync.read(REF_SCREENSHOT_PATH);

let shouldReturnNonZeroExitCode = false;

(async () => {
  try {
    await testURL('https://github.com/jerry1100/github-markdown-printer/tree/master/test');
    await testURL('https://github.com/jerry1100/github-markdown-printer/blob/master/test/README.md');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

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
  await page.addStyleTag({ path: path.join(__dirname, '..', 'src', 'styles.css') });
  await page.emulateMedia('print');
  await page.screenshot({ path: TEST_SCREENSHOT_PATH });
  await browser.close();
}

async function compareWithReference() {
  const testImage = PNG.sync.read(fs.readFileSync(TEST_SCREENSHOT_PATH));
  const { width, height } = testImage;
  const diff = new PNG({ width, height });
  const numDiffPixels = pixelMatch(referenceImage.data, testImage.data, diff.data, width, height);
  fs.writeFileSync(DIFF_SCREENSHOT_PATH, PNG.sync.write(diff));

  return numDiffPixels;
}
