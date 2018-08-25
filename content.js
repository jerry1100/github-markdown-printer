/**
 * Listen for the 'click' message, then strip!
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'click') {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
          position: static !important;
        }

        article.markdown-body.entry-content {
          position: absolute !important;
          top: 0;
          left: 0;
          padding: 0;
          border: none;
        }

        article.markdown-body.entry-content * {
          visibility: visible !important;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  }
});
