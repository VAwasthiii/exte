document.addEventListener('mouseup', function () {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length) {
        const save = confirm("Save Highlight?");
        if (save) {
            chrome.storage.local.get({ highlights: [] }, function (result) {
                const highlights = result.highlights;
                highlights.push(selectedText);
                chrome.storage.local.set({ highlights });
                alert("Highlight saved!");
            });
        }
    }
});
