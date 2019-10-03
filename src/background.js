// Show the extension icon when certain conditions are met
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostContains: 'github' },
        css: ['.markdown-body'],
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
});

// When the extension is clicked, send the current tab a "click" message
chrome.pageAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, { message: 'click' });
});
