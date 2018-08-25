/**
 * Listen for the 'click' message, then strip!
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'click') {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body {
          visibility: hidden;
        }

        article.markdown-body.entry-content {
          visibility: visible !important;
          position: absolute;
          top: 0;
          left: 0;
          padding: 0;
          border: none;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  }
});
