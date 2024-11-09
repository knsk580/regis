// content.js
// ツールチップ要素の作成
const createTooltip = () => {
    const tooltip = document.createElement('div');
    tooltip.id = "tooltip"
    document.body.appendChild(tooltip);
    return tooltip;
};

const tooltip = createTooltip();
let isMouseDown = false;

// マウスボタンが押されたとき
document.addEventListener('mousedown', (e) => {
    // ツールチップ内のクリックは無視
    if (tooltip.contains(e.target)) {
        return;
    }

    isMouseDown = true;
    tooltip.style.display = 'none';
});

// マウスボタンが離されたとき
document.addEventListener('mouseup', (e) => {
    // ツールチップ内のクリックは無視
    if (tooltip.contains(e.target)) {
        return;
    }

    isMouseDown = false;

    // 選択テキストを取得して検索
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
        chrome.storage.local.get(['dictionary'], (result) => {
            const dictionary = result.dictionary || {};
            const meaning = dictionary[selectedText];

            if (meaning) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // ツールチップの位置を設定
                const tooltipX = Math.max(0, rect.left + window.scrollX);
                const tooltipY = rect.bottom + window.scrollY + 5;

                tooltip.style.left = `${tooltipX}px`;
                tooltip.style.top = `${tooltipY}px`;
                tooltip.textContent = meaning;
                tooltip.style.display = 'block';
            }
        });
    }
});

// 画面スクロール時にツールチップの位置を調整
document.addEventListener('scroll', () => {
    if (tooltip.style.display === 'block') {
        const selection = window.getSelection();
        if (selection.toString().trim()) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            tooltip.style.left = `${Math.max(0, rect.left + window.scrollX)}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        }
    }
}, { passive: true });

// ページ内でのクリック処理
document.addEventListener('click', (e) => {
    // ツールチップ内のクリックは無視
    if (tooltip.contains(e.target)) {
        return;
    }

    // 新しい選択を開始する場合のみツールチップを非表示に
    const selection = window.getSelection();
    if (!selection.toString().trim()) {
        tooltip.style.display = 'none';
    }
});