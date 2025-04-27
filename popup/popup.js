function loadHighlights() {
    chrome.storage.local.get({ highlights: [] }, function (result) {
        const list = document.getElementById('highlightList');
        list.innerHTML = '';

        result.highlights.forEach((text, index) => {
            const li = document.createElement('li');
            li.textContent = text;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => {
                const updatedHighlights = [...result.highlights];
                updatedHighlights.splice(index, 1);
                chrome.storage.local.set({ highlights: updatedHighlights }, loadHighlights);
            };

            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    });
}

document.getElementById('clearHighlights').addEventListener('click', () => {
    chrome.storage.local.set({ highlights: [] }, loadHighlights);
});

document.getElementById('summarizeHighlights').addEventListener('click', async () => {
    chrome.storage.local.get({ highlights: [] }, async function (result) {
        if (result.highlights.length === 0) {
            alert("No highlights to summarize!");
            return;
        }
        const fullText = result.highlights.join(' ');
        const summary = await summarizeText(fullText);
        alert("Summary:\n" + summary);
    });
});

async function summarizeText(text) {
    const apiKey = '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'; 

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: `Summarize the following text briefly:\n\n${text}` }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            alert(`Error: ${errorData.error.message}`);
            return "Failed to summarize. API Error.";
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        } else {
            console.error('Invalid API response:', data);
            return "Failed to summarize.";
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        alert(`Fetch error: ${error.message}`);
        return "Error during summarization.";
    }
}

loadHighlights();
