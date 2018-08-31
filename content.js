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
          top: 0 !important;
          left: 0 !important;
          padding: 0 !important;
          border: none !important;
        }

        article.markdown-body.entry-content * {
          visibility: visible !important;
        }
      }

      @page {
        size: auto;
        margin: 54pt;
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  }
});
