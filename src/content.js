// Listen for "click" messages from the background script, then perform action
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'click') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('style.css');

    document.head.appendChild(link);
    link.addEventListener('load', () => {
      const bodyHtml = document.body.innerHTML;
      const markdownHtml = document.querySelector('.markdown-body').outerHTML;

      // Have markdown content occupy entire page
      document.body.innerHTML = markdownHtml;
      window.print();

      // Clean up - revert to original
      document.body.innerHTML = bodyHtml;
      document.head.removeChild(link);
    });
  }
});
