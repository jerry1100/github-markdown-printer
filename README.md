# github-markdown-printer

Print GitHub Flavored Markdown _exactly_ as it appears on GitHub, with just two clicks.

Get it from the [Chrome Web Store](https://chrome.google.com/webstore/detail/github-markdown-printer/fehpdlpmcegfpbkgcnaleindodeegapk) or the [Edge Web Store](https://microsoftedge.microsoft.com/addons/detail/github-markdown-printer/njdhaokfdmnighagdlhbfpkmcgojljcl).

![GitHub Markdown Printer demo image](./img/preview.png)

### Advantages over other markdown converters

This is easier and faster than downloading the markdown file and running it through a converter. This also produces better results.

## Usage

1. Go to any page on GitHub where there's a markdown preview
2. Right-click the page and select "Print GitHub Markdown"
3. Select your printer or save as PDF and print

![GitHub Markdown Printer usage](./img/usage.png)

## Troubleshooting

If you're experiencing an issue that isn't listed below, please [submit an issue](https://github.com/jerry1100/github-markdown-printer/issues/new).

### Code blocks aren't shaded

Make sure "Background graphics" are enabled in the print preview. To check, click "More settings" in the print preview, then look for "Background graphics".

<img src="./img/graphics.png" height="350" alt="Background graphics setting" />

### Indentation is weird in code blocks

Long pieces of code that do not fit within the page will be wrapped to the next line. This wrapping may mess up the indentation.

### Jupyter notebooks formatting is off

Keep trying until the formatting looks correct. Notebooks are rendered using iframes, which we don't have much control over, so the formatting can often be wrong. For whatever reason, it sometimes gets it right after several attempts.

### Mermaid diagrams are cut off

Keep trying until they're not cut off. Like notebooks, mermaid diagrams are rendered using iframes, which we don't have much control over. Despite many hours of trying, I haven't been able to get them to render correctly on the first try.
