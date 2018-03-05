/**
 * When the extension icon is clicked, send the current tab a message
 */
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { message: 'click' });
  });
});
