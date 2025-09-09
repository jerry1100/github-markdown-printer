const GITHUB_MARKDOWN_PRINTER = 'GITHUB_MARKDOWN_PRINTER';

// Respond to keyboard shortcut commands
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    let currentTab = tabs[0];
    printPageForTab(currentTab.id);
  });
});

// Respond to clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  printPageForTab(tab.id);
});

// Create context menu
chrome.contextMenus.create({
  title: 'Print GitHub Markdown',
  id: GITHUB_MARKDOWN_PRINTER,
  documentUrlPatterns: ['https://*.github.com/*'],
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
  const content =
    document.querySelector('.markdown-body') ??
    document.querySelector('div[data-type="ipynb"]');

  if (!content) {
    alert('No printable content found on this page');
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

    // For all iframes, change 'color_mode=dark' to 'color_mode=light' so that content
    // is visible when printed
    for (const iframe of document.querySelectorAll('iframe')) {
      iframe.src = iframe.src.replace('color_mode=dark', 'color_mode=light');
    }

    // Have markdown content occupy entire page
    document.body.replaceChildren(content);

    await waitForMermaidDiagramsToLoad();
    await waitForJupyterNotebooksToLoad();
    const revertHeadingsLinkable = makeHeadingsLinkable();

    window.print();

    // Clean up - revert to original
    revertHeadingsLinkable();
    document.body.innerHTML = bodyHtml;
    document.documentElement.dataset.colorMode = theme;
    document.head.removeChild(link);
  });

  async function waitForMermaidDiagramsToLoad() {
    // Keep track of iframes that have loaded. We aren't able to peer inside the frame
    // due to cross-origin restrictions, so we just wait for the frame to send us a
    // message when it's ready.
    const loadedFrames = new Set();

    window.addEventListener('message', ({ data }) => {
      if (data.body === 'ready') {
        loadedFrames.add(data.identity);
      }
    });

    // Wait for all mermaid diagrams to load
    const mermaidIds = Array.from(
      document.querySelectorAll('section[data-type="mermaid"]')
    ).map((node) => node.dataset.identity);

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (mermaidIds.every((id) => loadedFrames.has(id))) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  async function waitForJupyterNotebooksToLoad() {
    // Give jupyter notebooks some time to load before attempting to print. Tried to
    // extend iframe waiting logic to handle this case, but for some reason the iframe
    // doesn't send the ready event after content is replaced.
    const notebook = document.querySelector('div[data-type="ipynb"]');
    if (notebook) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  function makeHeadingsLinkable() {
    const headings = [
      ...document.getElementsByTagName('h1'),
      ...document.getElementsByTagName('h2'),
      ...document.getElementsByTagName('h3'),
      ...document.getElementsByTagName('h4'),
      ...document.getElementsByTagName('h5'),
      ...document.getElementsByTagName('h6'),
    ];

    const normalize = (text) => {
      return text
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-')
        .replace(/[^a-z0-9\-]/g, ''); // only keep letters, numbers, and hyphens
    };

    // Add ids to all headings
    const ids = new Set();
    for (const heading of headings) {
      heading.id = normalize(heading.textContent);
      ids.add(heading.id);
    }

    // Update internal links to point to the new ids
    const internalLinks = document.querySelectorAll(
      'a[href^="#"]:not(.markdown-heading a)'
    );
    const originalHrefs = new Map(); // store original hrefs to revert later
    for (const link of internalLinks) {
      const href = link.getAttribute('href');
      const normalized = normalize(href.slice(1)); // remove leading '#'

      if (ids.has(normalized)) {
        originalHrefs.set(link, href);
        link.href = `#${normalized}`;
      }
    }

    // Cleanup
    return () => {
      // Revert all heading ids
      for (const heading of headings) {
        heading.removeAttribute('id');
      }

      // Revert internal links back to their original hrefs
      for (const [link, href] of originalHrefs) {
        link.setAttribute('href', href);
      }
    };
  }
}
