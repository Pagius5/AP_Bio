(function () {
    function renderAutoFigures() {
        const figures = document.querySelectorAll(".auto-figure");

        figures.forEach((figure, index) => {
            const src = figure.dataset.src;
            const alt = figure.dataset.alt || "";
            const width = figure.dataset.width;
            const creditText = figure.dataset.creditText;
            const creditUrl = figure.dataset.creditUrl;
            const captionHtml = figure.innerHTML.trim();

            if (!src || !captionHtml) return;

            const img = document.createElement("img");
            img.src = src;
            img.alt = alt;

            if (width) {
                if (/^\d+$/.test(width)) {
                    img.width = Number(width);
                } else {
                    img.style.width = width;
                }
            }

            const caption = document.createElement("p");
            caption.className = "figure-caption";

            let creditHtml = "";
            if (creditText && creditUrl) {
                creditHtml = ` <span class="figure-credit">(credit: <a href="${creditUrl}" target="_blank" rel="noopener noreferrer">${creditText}</a>)</span>`;
            } else if (creditText) {
                creditHtml = ` <span class="figure-credit">(credit: ${creditText})</span>`;
            }

            caption.innerHTML = `<strong>Figure ${index + 1}:</strong> ${captionHtml}${creditHtml}`;

            figure.classList.add("figure-block");
            figure.replaceChildren(img, caption);
        });

        if (window.MathJax?.typesetPromise) {
            window.MathJax.typesetPromise(Array.from(figures));
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderAutoFigures);
    } else {
        renderAutoFigures();
    }
})();
