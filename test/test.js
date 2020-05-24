const TestCase = require('./test-case');
const TestRunner = require('./test-runner');

const testCases = [
  new TestCase('project root', 'https://github.com/torvalds/linux'),
  new TestCase('folder root', 'https://github.com/jerry1100/github-markdown-printer/tree/master/test/sample'),
  new TestCase('readme file', 'https://github.com/jerry1100/github-markdown-printer/blob/master/test/sample/README.md'),
  new TestCase('wiki', 'https://github.com/jerry1100/github-markdown-printer/wiki'),
];

(async () => {
  const testResults = await getTestResults(testCases);
  const didTestsPass = testResults.every(didPass => didPass);

  process.exit(didTestsPass ? 0 : 1);
})();

async function getTestResults(testCases) {
  const results = testCases.map(async ({ testName, urlToTest }) => await tryRunTest(testName, urlToTest));

  return await Promise.all(results);
}

async function tryRunTest(testName, urlToTest) {
  try {
    return await runTest(testName, urlToTest);
  } catch (e) {
    console.error(`[${testName}] Exception during test: ${e}`);

    return false;
  }
}

async function runTest(testName, urlToTest) {
  const testRunner = new TestRunner(testName, urlToTest);
  const actualScreenshotPath = await testRunner.takeScreenshotAndSaveToFs();
  const numDiffPixels = await testRunner.doesScreenshotMatchExpectedAndGenerateDiff(actualScreenshotPath);
  const didPass = numDiffPixels === 0;

  if (didPass) {
    console.log(`[${testName}] Passed`);
  } else {
    console.log(`[${testName}] Failed - actual screenshot differs from expected by ${numDiffPixels} pixels`);
  }

  return didPass;
}
