const GITHUB_MARKDOWN_PRINTER = 'GITHUB_MARKDOWN_PRINTER';

// Respond to clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  printPageForTab(tab.id);
});

// Create context menu
chrome.contextMenus.create({
  title: 'Print GitHub Markdown',
  id: GITHUB_MARKDOWN_PRINTER,
});

// Respond to context menu clicks
chrome.contextMenus.onClicked.addListener((clickInfo, tab) => {
  if (clickInfo.menuItemId === GITHUB_MARKDOWN_PRINTER) {
    printPageForTab(tab.id);
  }
});

function printPageForTab(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    function: printPage,
  });
}

function printPage() {
  const markdownBody = document.querySelector('.markdown-body');

  if (!markdownBody) {
    alert('No markdown content found on this page');
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('style.css');

  document.head.appendChild(link);
  link.addEventListener('load', async () => {
    const bodyHtml = document.body.innerHTML;
    const theme = document.documentElement.dataset.colorMode;

    // Use light theme or else text contrast is bad
    document.documentElement.dataset.colorMode = 'light';

    // Have markdown content occupy entire page
    document.body.replaceChildren(markdownBody);

    // Wait for any mermaid diagrams to load
    if (document.querySelector('iframe')) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    window.print();

    // Clean up - revert to original
    document.body.innerHTML = bodyHtml;
    document.documentElement.dataset.colorMode = theme;
    document.head.removeChild(link);
  });
}
