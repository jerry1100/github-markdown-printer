const GITHUB_MARKDOWN_PRINTER = "GITHUB_MARKDOWN_PRINTER";

// Respond to clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
    printPageForTab(tab.id);
});

// Create context menu
chrome.contextMenus.create({
    title: "Print GitHub Markdown",
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
    const markdownBody = document.querySelector(".markdown-body");

    if (!markdownBody) {
        return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("style.css");

    document.head.appendChild(link);
    link.addEventListener("load", () => {
        const bodyHtml = document.body.innerHTML;
        const markdownHtml = markdownBody.outerHTML;
        const theme = document.documentElement.dataset.colorMode;

        // Have markdown content occupy entire page
        document.body.innerHTML = markdownHtml;

        // Use light theme or else text contrast is bad
        document.documentElement.dataset.colorMode = "light";

        window.print();

        // Clean up - revert to original
        document.body.innerHTML = bodyHtml;
        document.documentElement.dataset.colorMode = theme;
        document.head.removeChild(link);
    });
}
