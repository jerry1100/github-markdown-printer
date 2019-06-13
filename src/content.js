/**
 * Listen for the 'click' message, then strip!
 */
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
