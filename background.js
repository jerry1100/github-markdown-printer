/**
 * Enables the page action when the conditions are met
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'github.com' },
        css: ['article.markdown-body.entry-content'],
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
});

/**
 * When the extension icon is clicked, send the current tab a message
 */
chrome.pageAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, { message: 'click' });
});
