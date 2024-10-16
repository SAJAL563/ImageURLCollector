// ==UserScript==
// @name         Image URL Collector & Preview with Click-to-Copy and Size Filter
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Collects image URLs (minimum size 900x500), shows previews in a flex container, and allows click-to-copy on each image without duplicates
// @match        https://my.keringeyewear.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Pattern for the image URL
    const urlPattern = /https:\/\/picture-shared-cdn\.azureedge\.net\/cdn\/KEYE_B2B\/images\/\S+/;

    // Set to track processed images and store the first URL
    const processedImages = new Set();
    let firstImageURL = null; // To track the first image URL

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
            showTemporaryAlert(src, "Image URL copied to clipboard!", 1500);
        };

        previewContainer.appendChild(img);
    }

    function showTemporaryAlert(imageUrl, message, duration) {
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

        // Create image element for the alert box
        const imgPreview = document.createElement('img');
        imgPreview.src = imageUrl;
        imgPreview.style.maxWidth = '350px'; // Set max width for the preview
        imgPreview.style.display = 'block'; // Ensure the image displays correctly
        imgPreview.style.marginBottom = '5px'; // Space between the image and the message

        alertBox.appendChild(imgPreview); // Add image to alert box
        alertBox.innerHTML += message; // Append the message after the image

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

                        // Copy the very first valid image URL to clipboard
                        if (!firstImageURL) {
                            firstImageURL = img.src;
                            GM_setClipboard(firstImageURL);
                            showTemporaryAlert(firstImageURL, "First image URL copied to clipboard!", 1500);
                        }
                    }
                }
            }
        });
    }, 1000);
})();
