# Image URL Collector & Preview Script

This Tampermonkey script collects image URLs from web pages that match a specific pattern, displays previews of the images, and allows users to copy the URLs to the clipboard. The script only displays images that meet certain size requirements and avoids duplicates.

## Features

- **Collects Image URLs**: Identifies image URLs from a specified pattern.
- **Size Filter**: Only displays images that are at least 900 pixels wide and 500 pixels tall.
- **Preview Container**: Displays image previews in a fixed container at the bottom of the page.
- **Click-to-Copy**: Users can click on an image to copy its URL to the clipboard.
- **Duplicate Prevention**: Ensures that each unique image URL is only added once to the preview container.

## Installation

1. **Install Tampermonkey**: If you haven't already, install the Tampermonkey browser extension from the [Tampermonkey website](https://www.tampermonkey.net/).

2. **Add the Script**:
   - Open Tampermonkey in your browser.
   - Click on the **Dashboard**.
   - Click the **Add a new script** button.
   - Delete any template code in the editor and replace it with the code from the script below.

```javascript
// ==UserScript==
// @name         Image URL Collector & Preview with Click-to-Copy and Size Filter
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Collects image URLs (minimum size 900x500), shows previews in a flex container, and allows click-to-copy on each image without duplicates
// @match        *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Pattern for the image URL
    const urlPattern = /https:\/\/picture-shared-cdn\.azureedge\.net\/cdn\/KEYE_B2B\/images\/\S+/;

    // Set to track processed images
    const processedImages = new Set();

    // Function to create a preview container for images
    function createPreviewContainer() {
        const container = document.createElement('div');
        container.id = 'image-preview-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '20px';
        container.style.width = '90%';
        container.style.height = '200px';
        container.style.overflowX = 'auto';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        container.style.padding = '10px';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.gap = '10px';
        container.style.zIndex = '10000';
        container.style.borderRadius = '5px';
        document.body.appendChild(container);
        return container;
    }

    // Initialize preview container
    const previewContainer = createPreviewContainer();

    // Function to add image to the preview container
    function addImageToPreview(src) {
        const img = document.createElement('img');
        img.src = src;
        img.style.height = '180px';
        img.style.cursor = 'pointer';
        img.style.borderRadius = '5px';

        img.onclick = function() {
            GM_setClipboard(src);
            showTemporaryAlert("Image URL copied to clipboard!", 1500);
        };

        previewContainer.appendChild(img);
    }

    function showTemporaryAlert(message, duration) {
        var alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.right = '20px';
        alertBox.style.padding = '10px 20px';
        alertBox.style.backgroundColor = '#000';
        alertBox.style.color = '#fff';
        alertBox.style.fontSize = '16px';
        alertBox.style.borderRadius = '5px';
        alertBox.style.zIndex = '9999';
        alertBox.innerText = message;

        document.body.appendChild(alertBox);

        setTimeout(function() {
            document.body.removeChild(alertBox);
        }, duration);
    }

    // Poll for new images and add them to the preview container
    setInterval(() => {
        document.querySelectorAll('img').forEach(img => {
            if (urlPattern.test(img.src) && img.complete) {
                if (img.naturalWidth >= 900 && img.naturalHeight >= 500) {
                    // Check for duplicates using the URL
                    if (!processedImages.has(img.src)) {
                        processedImages.add(img.src);
                        addImageToPreview(img.src);
                    }
                }
            }
        });
    }, 2000);
})();
```
## Usage

<ol><li>Once the script is installed, navigate to a webpage containing images.</li><li>The script will automatically detect and collect images matching the specified URL pattern.</li><li>Images meeting the size requirements will appear in the preview container at the bottom of the page.</li><li>Click on an image to copy its URL to your clipboard. A temporary alert will confirm the action.</li></ol>


### Notes:
- Customize the `@namespace`, `@description`, and any other details as needed.
- Make sure the script block is correctly indented to ensure proper formatting in Markdown.
- You can add more sections, such as "Contributing" or "Issues," if relevant.

Let me know if you need further changes or additional sections!


### License
This project is licensed under the MIT License. Feel free to modify and use it as needed.
