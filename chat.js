(function () {
  const STARTERS = [
    "What's Iura's background?",
    "Tell me about the Order Help project",
    "What are Iura's key skills?",
    "What tools does Iura work with?",
  ];

  const STORAGE_OPEN = 'chatOpen';
  const STORAGE_HISTORY = 'chatHistory';

  function saveHistory(history) {
    sessionStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
  }

  function loadHistory() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_HISTORY)) || []; } catch { return []; }
  }

  function createWidget() {
    const bubble = document.createElement('button');
    bubble.className = 'chat-bubble';
    bubble.setAttribute('aria-label', 'Ask about Iura');
    bubble.setAttribute('aria-expanded', 'false');
    bubble.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.253 2 11.5c0 2.32.87 4.444 2.295 6.07L3 21l3.82-1.17A10.1 10.1 0 0 0 12 21c5.523 0 10-4.253 10-9.5S17.523 2 12 2Z"/>
    </svg>`;

    const drawer = document.createElement('div');
    drawer.className = 'chat-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Chat about Iura\'s work');

    drawer.innerHTML = `
      <div class="chat-drawer__header">
        Ask about Iura's work
        <button class="chat-drawer__close" aria-label="Close chat">×</button>
      </div>
      <div class="chat-drawer__messages" id="chat-messages">
        <div class="chat-msg chat-msg--assistant">Hi! I can answer questions about Iura's experience, skills, and case studies. What would you like to know?</div>
      </div>
      <div class="chat-drawer__starters" id="chat-starters"></div>
      <div class="chat-drawer__input-row">
        <textarea class="chat-drawer__input" id="chat-input" placeholder="Ask a question…" rows="1" aria-label="Type your question"></textarea>
        <button class="chat-drawer__send" id="chat-send" disabled>Send</button>
      </div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(drawer);

    const messagesEl = drawer.querySelector('#chat-messages');
    const inputEl = drawer.querySelector('#chat-input');
    const sendBtn = drawer.querySelector('#chat-send');
    const startersEl = drawer.querySelector('#chat-starters');
    const closeBtn = drawer.querySelector('.chat-drawer__close');

    const history = loadHistory();
    let isOpen = false;
    let loading = false;

    // Restore previous conversation
    if (history.length > 0) {
      startersEl.style.display = 'none';
      history.forEach(({ role, content }) => appendMessage(content, role, false));
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    STARTERS.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'chat-starter';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        startersEl.style.display = 'none';
        sendMessage(text);
      });
      startersEl.appendChild(btn);
    });

    function toggleDrawer(suppressFocus) {
      isOpen = !isOpen;
      drawer.classList.toggle('chat-drawer--open', isOpen);
      bubble.setAttribute('aria-expanded', String(isOpen));
      if (isOpen && !suppressFocus) inputEl.focus({ preventScroll: true });
      sessionStorage.setItem(STORAGE_OPEN, isOpen ? '1' : '0');
    }

    bubble.addEventListener('click', toggleDrawer);
    closeBtn.addEventListener('click', toggleDrawer);

    const path = window.location.pathname;
    const isHome = path === '/' || path.endsWith('/index.html');
    const storedState = sessionStorage.getItem(STORAGE_OPEN);
    const wasOpen = storedState === '1';
    const explicitlyClosed = storedState === '0';
    if (wasOpen || (isHome && !explicitlyClosed)) toggleDrawer(true);

    inputEl.addEventListener('input', () => {
      sendBtn.disabled = inputEl.value.trim() === '' || loading;
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) sendBtn.click();
      }
    });

    sendBtn.addEventListener('click', () => {
      const text = inputEl.value.trim();
      if (!text || loading) return;
      inputEl.value = '';
      inputEl.style.height = 'auto';
      sendBtn.disabled = true;
      startersEl.style.display = 'none';
      sendMessage(text);
    });

    function appendMessage(text, role, scroll = true) {
      const el = document.createElement('div');
      el.className = `chat-msg chat-msg--${role}`;
      el.textContent = text;
      messagesEl.appendChild(el);
      if (scroll) messagesEl.scrollTop = messagesEl.scrollHeight;
      return el;
    }

    async function sendMessage(text) {
      if (typeof gtag === 'function') gtag('event', 'chat_question', { question: text });
      appendMessage(text, 'user');
      history.push({ role: 'user', content: text });
      saveHistory(history);

      loading = true;
      sendBtn.disabled = true;
      const thinking = appendMessage('Thinking…', 'thinking');

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });

        const data = await res.json();
        thinking.remove();

        if (data.reply) {
          appendMessage(data.reply, 'assistant');
          history.push({ role: 'assistant', content: data.reply });
          saveHistory(history);
        } else {
          appendMessage('Sorry, something went wrong. Please try again.', 'assistant');
        }
      } catch {
        thinking.remove();
        appendMessage('Sorry, something went wrong. Please try again.', 'assistant');
      }

      loading = false;
      sendBtn.disabled = inputEl.value.trim() === '';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
