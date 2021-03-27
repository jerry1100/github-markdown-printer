const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { PNG } = require('pngjs');
const pixelMatch = require('pixelmatch');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const STYLE_CSS_PATH = path.join(__dirname, '..', 'src', 'style.css');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR);
}

class TestRunner {
  constructor(testName, urlToTest) {
    this.urlToTest = urlToTest;

    const baseScreenshotName = testName.toLowerCase().replace(/\s+/g, '-');
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
    await page.evaluate(this.replaceBodyHtmlWithMarkdown);
    await page.emulateMediaType('print');
    await page.screenshot({ path: this.actualScreenshotPath });
    await browser.close();

    return this.actualScreenshotPath;;
  }

  async replaceBodyHtmlWithMarkdown() {
    document.body.innerHTML = document.querySelector('.markdown-body').outerHTML;
  }

  async doesScreenshotMatchExpectedAndGenerateDiff(actualScreenshotPath) {
    const expectedScreenshot = this.getScreenshotData(this.expectedScreenshotPath);
    const actualScreenshot = this.getScreenshotData(actualScreenshotPath);
    const numDiffPixels = this.generateDiffScreenshot(expectedScreenshot, actualScreenshot);

    return numDiffPixels;
  }

  getScreenshotData(screenshotPath) {
    return PNG.sync.read(fs.readFileSync(screenshotPath));
  }

  generateDiffScreenshot(expectedScreenshot, actualScreenshot) {
    const { width, height } = expectedScreenshot;
    const diffScreenshot = new PNG({ width, height });
    const numDiffPixels = pixelMatch(expectedScreenshot.data, actualScreenshot.data, diffScreenshot.data, width, height);

    fs.writeFileSync(this.diffScreenshotPath, PNG.sync.write(diffScreenshot));

    return numDiffPixels;
  }
}

module.exports = TestRunner;
