// Listen for "click" messages from the background script, then perform action
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'click') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('style.css');

    document.head.appendChild(link);
    link.addEventListener('load', () => {
      window.print();
      document.head.removeChild(link);
    });
  }
});
