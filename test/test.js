const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelMatch = require('pixelmatch');
const puppeteer = require('puppeteer');
const testCases = require('./test-cases');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const STYLE_CSS_PATH = path.join(__dirname, '..', 'src', 'style.css');

testCases.forEach(async ({ testName, urlToTest }) => {
  const testRunner = new TestRunner(testName, urlToTest);
  const screenshotPath = await testRunner.takeScreenshotAndSaveToFs();

  const diff = testRunner.compareScreenshotWithExpectedAndGenerateDiff(testName);

})

class TestRunner {
  constructor(testName, urlToTest) {
    this.urlToTest = urlToTest;

    const baseScreenshotName = testName.replace(/\s+/g, '-');

    this.expectedScreenshotPath = path.join(SCREENSHOTS_DIR, `${baseScreenshotName}-expected.png`);
    this.actualScreenshotPath = path.join(SCREENSHOTS_DIR, `${baseScreenshotName}-actual.png`);
    this.diffScreenshotPath = path.join(SCREENSHOTS_DIR, `${baseScreenshotName}-diff.png`);
  }

  async takeScreenshotAndSaveToFs() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(this.urlToTest);
    await page.addStyleTag({ path: STYLE_CSS_PATH });
    await page.emulateMedia('print');
    await page.screenshot({ path: this.actualScreenshotPath });
    await browser.close();

    return this.actualScreenshotPath;;
  }

  async compareScreenshotWithExpectedAndGenerateDiff(screenshotPath) {
    const screenshot = this.getScreenshotData(screenshotPath);

    const { width, height } = testImage;

    const diff = new PNG({ width, height });
    const numDiffPixels = pixelMatch(referenceImage.data, testImage.data, diff.data, width, height);
  
    fs.writeFileSync(DIFF_SCREENSHOT_PATH, PNG.sync.write(diff));
  
    return numDiffPixels;
  }

  getScreenshotData(screenshotPath) {
    PNG.sync.read(fs.readFileSync(screenshotPath));
  }

  
}






















const referenceImage = PNG.sync.read(fs.readFileSync(REF_SCREENSHOT_PATH));

let shouldReturnNonZeroExitCode = false;

(async () => {
  try {
    //await testURL('https://github.com/jerry1100/github-markdown-printer/tree/master/test/sample');
    await testURL('https://github.com/jerry1100/github-markdown-printer');
    //await testURL('https://github.com/jerry1100/github-markdown-printer/wiki');
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
