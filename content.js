/**
 * Listen for the 'click' message, then strip!
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'click') {
    const preview = document.getElementsByClassName('markdown-body entry-content')[0];

    preview.style.maxWidth = '980px';
    preview.style.margin = '0 auto';
    preview.style.padding = '50px';
    preview.style.border = 0;

    document.body.innerHTML = preview.outerHTML;
    window.print();
  }
});
