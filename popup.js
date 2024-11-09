document.getElementById('dictionaryData').addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const target = e.target;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        target.value = target.value.substring(0, start) + '\t' +
            target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + 1;
    }
});

document.getElementById('save').addEventListener('click', () => {
    const tsvData = document.getElementById('dictionaryData').value;
    const dictionary = {};

    tsvData.split('\n').forEach(line => {
        const [key, value] = line.split('\t');
        if (key && value) {
            dictionary[key.trim()] = value.trim();
        }
    });

    chrome.storage.local.set({ dictionary }, () => {
        const saveStatus = document.getElementById('saveStatus');
        saveStatus.style.display = 'inline';
        setTimeout(() => {
            saveStatus.style.display = 'none';
        }, 1000);
    });
});

chrome.storage.local.get(['dictionary'], (result) => {
    if (result.dictionary) {
        const tsvString = Object.entries(result.dictionary)
            .map(([key, value]) => `${key}\t${value}`)
            .join('\n');
        document.getElementById('dictionaryData').value = tsvString;
    }
});