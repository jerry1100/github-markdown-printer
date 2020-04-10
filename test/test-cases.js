class TestCase {
  constructor(testName, urlToTest) {
    this.testName = testName;
    this.urlToTest = urlToTest;
  }
}

module.exports = [
  new TestCase('project root', 'https://github.com/jerry1100/github-markdown-printer'),
  new TestCase('folder root', 'https://github.com/jerry1100/github-markdown-printer/tree/master/test/sample'),
  new TestCase('readme file', 'https://github.com/jerry1100/github-markdown-printer/blob/master/test/sample/README.md'),
  new TestCase('wiki', 'https://github.com/jerry1100/github-markdown-printer/wiki'),
];