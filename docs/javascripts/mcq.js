// mcq.js
(function () {
    if (!document.getElementById('mcq-styles')) {
        const style = document.createElement('style');
        style.id = 'mcq-styles';
        style.innerHTML = `
            /* 容器样式 */
            .quiz-card { 
                background-color: var(--md-default-bg-color); 
                border-radius: 8px; 
                margin: 2em 0; 
                overflow: hidden; 
                box-shadow: 0 4px 10px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.2);
                border: 1px solid var(--md-typeset-table-color, #e1e4e8);
                font-family: var(--md-text-font-family);
            }

            /* 标题页眉设计 */
            .quiz-header {
                background-color: var(--md-primary-fg-color);
                color: var(--md-primary-bg-color);
                padding: 12px 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 700;
                font-size: 0.9rem;
                letter-spacing: 0.05em;
            }
            .quiz-header svg {
                fill: currentColor;
                width: 20px;
                height: 20px;
            }

            /* 内容区域 */
            .quiz-content {
                padding: 20px 24px;
            }
            .quiz-question {
                font-size: 1rem;
                line-height: 1.6;
                color: var(--md-default-fg-color);
                margin-bottom: 1.2em;
            }

            /* 选项标签 */
            .option-label { 
                display: flex;
                align-items: center;
                margin: 8px 0; 
                cursor: pointer; 
                padding: 12px 16px; 
                border: 1px solid var(--md-typeset-table-color, #f0f2f5); 
                border-radius: 6px; 
                transition: all 0.25s; 
                font-size: 0.9rem;
            }
            .option-label:hover { 
                background-color: var(--md-code-bg-color); 
                border-color: var(--md-primary-fg-color); 
            }
            .option-label input[type="radio"] {
                margin-right: 12px;
                accent-color: var(--md-primary-fg-color);
                width: 16px;
                height: 16px;
                cursor: pointer;
            }

            /* 选中状态 */
            .option-label.selected {
                border-color: var(--md-primary-fg-color);
                background-color: var(--md-primary-fg-color--accent);
                box-shadow: 0 0 0 1px var(--md-primary-fg-color);
            }

            /* 按钮设计 */
            .quiz-action {
                margin-top: 1.5em;
            }
            .btn-quiz { 
                background-color: var(--md-primary-fg-color); 
                color: var(--md-primary-bg-color); 
                border: none; 
                padding: 10px 24px; 
                border-radius: 4px; 
                font-size: 0.8rem;
                font-weight: 700; 
                text-transform: uppercase; 
                letter-spacing: 0.08em;
                cursor: pointer; 
                box-shadow: 0 2px 5px rgba(0,0,0,0.15);
                transition: all 0.2s ease; 
            }
            .btn-quiz:hover { 
                filter: brightness(1.1);
                box-shadow: 0 4px 10px rgba(0,0,0,0.25);
                transform: translateY(-1px);
            }
            .btn-quiz:active { 
                transform: translateY(0);
            }

            /* 反馈区域 */
            .feedback-box { 
                margin-top: 20px; 
                padding: 16px; 
                border-radius: 4px; 
                font-size: 0.9rem; 
                display: none; 
                border-left: 6px solid;
                line-height: 1.5;
            }
            .feedback-correct { 
                background-color: rgba(0, 200, 83, 0.08); 
                color: var(--md-default-fg-color); 
                border-left-color: #00c853; 
            }
            .feedback-wrong { 
                background-color: rgba(255, 82, 82, 0.08); 
                color: var(--md-default-fg-color); 
                border-left-color: #ff5252; 
            }
        `;
        document.head.appendChild(style);
    }

    window.renderMCQ = function (containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { title, question, options, correctIndex, feedback } = config;

        const optionsHTML = options.map((opt, index) => `
            <label class="option-label" for="${containerId}-opt-${index}">
                <input type="radio" id="${containerId}-opt-${index}" name="${containerId}-input" value="${index}">
                <span>${opt}</span>
            </label>
        `).join('');

        container.innerHTML = `
            <div class="quiz-card">
                <div class="quiz-header">
                    <!-- 新的 Clipboard List 图标 -->
                    <svg viewBox="0 0 24 24"><path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" /></svg>
                    <span>${title.toUpperCase()}</span>
                </div>
                <div class="quiz-content">
                    <div class="quiz-question">${question}</div>
                    <div class="options-container">${optionsHTML}</div>
                    <div class="quiz-action">
                        <button class="btn-quiz" id="${containerId}-btn">Check Answer</button>
                    </div>
                    <div id="${containerId}-res" class="feedback-box"></div>
                </div>
            </div>
        `;

        const labels = container.querySelectorAll('.option-label');
        const btn = document.getElementById(`${containerId}-btn`);
        const res = document.getElementById(`${containerId}-res`);

        labels.forEach(label => {
            label.addEventListener('click', () => {
                labels.forEach(l => l.classList.remove('selected'));
                label.classList.add('selected');
            });
        });

        btn.addEventListener('click', function () {
            const selected = container.querySelector(`input[name="${containerId}-input"]:checked`);

            if (!selected) return;

            res.style.display = "block";
            const isCorrect = parseInt(selected.value) === correctIndex;

            if (isCorrect) {
                res.className = "feedback-box feedback-correct";
                res.innerHTML = `<b>🎉 Correct!</b><br>${feedback.correct}`;
            } else {
                res.className = "feedback-box feedback-wrong";
                res.innerHTML = `<b>❌ Incorrect</b><br>${feedback.wrong}`;
            }

            if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([res]);
        });

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([container]);
    };
})();