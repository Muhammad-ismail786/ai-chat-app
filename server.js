const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();



const PORT = 9000;
const AI_MODEL = "gemini-2.5-flash";

let geminiModel;
try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        throw new Error('Missing Gemini API key. Please set GEMINI_API_KEY in your .env file.');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({ model: AI_MODEL });
    console.log('Gemini client initialized successfully.');
} catch (error) {
    console.error('Error initializing Gemini client:', error.message);
    geminiModel = null;
}

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

async function getAiResponse(prompt) {
    if (!geminiModel) {
        return "AI service is currently unavailable. Please check the API key configuration.";
    }

    try {
        const chat = geminiModel.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(
            `You are an expert AI programming assistant. You help developers by providing detailed, accurate answers with working code examples when relevant. 

Guidelines:
- Always provide complete, runnable code when asked for code
- Explain your code with comments
- Use best practices and modern syntax
- Be thorough but concise
- Format code properly with correct indentation
- If asked about errors, explain the cause and provide the fix

User's question: ${prompt}`
        );

        const aiText = result.response?.text?.();
        if (!aiText) {
            console.error('Gemini returned an unexpected response format:', result);
            return 'Sorry, I could not get a response from the AI.';
        }
        return aiText.trim();
    } catch (error) {
        console.error('Error calling Gemini API:', error.message || error);

        // Friendly messages for common errors
        const msg = error.message || '';
        if (error.status === 429 || msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate')) {
            return '⚠️ The AI service is temporarily unavailable due to usage limits. Please try again later.';
        }
        if (error.status === 401 || error.status === 403 || msg.includes('API key') || msg.toLowerCase().includes('invalid')) {
            return '⚠️ There is a problem with the AI service configuration. Please contact the administrator.';
        }

        return 'An error occurred while getting the AI response.';
    }
}

const html = `<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>✨ AI Chat Assistant</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                --card-bg: rgba(255,255,255,0.95);
                --accent: #667eea;
                --accent-secondary: #764ba2;
                --user-bubble: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                --ai-bubble: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                --system-bubble: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                --text-dark: #1e293b;
                --text-light: #64748b;
                --shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
                --shadow-sm: 0 4px 15px rgba(0,0,0,0.1);
            }
            * { box-sizing: border-box; }
            html, body { height: 100%; margin: 0; }
            body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                background: var(--bg-gradient);
                background-attachment: fixed;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                min-height: 100vh;
            }
            .chat {
                width: 100%;
                max-width: 900px;
                height: 92vh;
                background: var(--card-bg);
                border-radius: 24px;
                box-shadow: var(--shadow);
                overflow: hidden;
                display: grid;
                grid-template-rows: auto 1fr auto;
                backdrop-filter: blur(10px);
            }
            header {
                padding: 20px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                gap: 14px;
            }
            header .logo {
                width: 44px;
                height: 44px;
                background: rgba(255,255,255,0.2);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 22px;
            }
            header .title {
                font-weight: 700;
                font-size: 20px;
                color: white;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            header .subtitle {
                font-size: 12px;
                color: rgba(255,255,255,0.8);
                margin-top: 2px;
            }
            .status {
                margin-left: auto;
                padding: 8px 16px;
                background: rgba(255,255,255,0.2);
                border-radius: 20px;
                font-size: 13px;
                color: white;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .status::before {
                content: '';
                width: 8px;
                height: 8px;
                background: #4ade80;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            .status.disconnected::before { background: #f87171; animation: none; }
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
            }
            main {
                padding: 20px;
                overflow-y: auto;
                background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
            }
            main::-webkit-scrollbar { width: 6px; }
            main::-webkit-scrollbar-track { background: transparent; }
            main::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
            .messages { display: flex; flex-direction: column; gap: 16px; }
            .msg { display: flex; gap: 12px; align-items: flex-start; animation: slideIn 0.3s ease; }
            .msg.me { flex-direction: row-reverse; }
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .avatar {
                width: 42px;
                height: 42px;
                border-radius: 14px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: var(--shadow-sm);
            }
            .msg.me .avatar { background: var(--user-bubble); }
            .msg.ai .avatar { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
            .msg.sys .avatar { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
            .bubble {
                max-width: 75%;
                padding: 14px 18px;
                border-radius: 18px;
                line-height: 1.6;
                box-shadow: var(--shadow-sm);
            }
            .msg.me .bubble {
                background: var(--user-bubble);
                color: white;
                border-bottom-right-radius: 6px;
            }
            .msg.ai .bubble {
                background: var(--ai-bubble);
                color: var(--text-dark);
                border-bottom-left-radius: 6px;
                border: 1px solid #e2e8f0;
            }
            .msg.sys .bubble {
                background: var(--system-bubble);
                color: #92400e;
                border-bottom-left-radius: 6px;
                font-size: 14px;
            }
            .bubble pre {
                background: #1e293b;
                color: #e2e8f0;
                padding: 14px;
                border-radius: 12px;
                overflow-x: auto;
                margin: 12px 0;
                font-size: 13px;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
            }
            .bubble code {
                font-family: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
                font-size: 13px;
            }
            .bubble p code {
                background: rgba(102, 126, 234, 0.1);
                padding: 3px 8px;
                border-radius: 6px;
                color: #667eea;
                font-size: 12px;
            }
            .msg.me .bubble p code {
                background: rgba(255,255,255,0.2);
                color: white;
            }
            .bubble p { margin: 0 0 10px 0; }
            .bubble p:last-child { margin-bottom: 0; }
            .bubble ul, .bubble ol { margin: 10px 0; padding-left: 20px; }
            .bubble li { margin: 4px 0; }
            .bubble h1, .bubble h2, .bubble h3 { margin: 16px 0 8px 0; color: var(--accent); }
            .bubble h1 { font-size: 1.4em; }
            .bubble h2 { font-size: 1.2em; }
            .bubble h3 { font-size: 1.1em; }
            .bubble blockquote {
                border-left: 4px solid var(--accent);
                margin: 12px 0;
                padding: 8px 16px;
                background: rgba(102, 126, 234, 0.05);
                border-radius: 0 8px 8px 0;
            }
            .meta {
                font-size: 11px;
                color: var(--text-light);
                margin-top: 6px;
                padding-left: 4px;
            }
            .msg.me .meta { text-align: right; padding-right: 4px; color: rgba(255,255,255,0.7); }
            footer {
                padding: 16px 20px;
                background: white;
                border-top: 1px solid #e2e8f0;
            }
            .input-wrap {
                display: flex;
                gap: 12px;
                align-items: center;
            }
            input[type=text] {
                flex: 1;
                padding: 14px 20px;
                border-radius: 25px;
                border: 2px solid #e2e8f0;
                background: #f8fafc;
                font-size: 15px;
                font-family: inherit;
                transition: all 0.2s ease;
            }
            input[type=text]:focus {
                outline: none;
                border-color: var(--accent);
                background: white;
                box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            }
            input[type=text]::placeholder { color: #94a3b8; }
            button.send {
                background: var(--user-bubble);
                color: white;
                border: none;
                padding: 14px 28px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                font-size: 15px;
                font-family: inherit;
                transition: all 0.2s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            button.send:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
            button.send:active { transform: translateY(0); }
            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 8px 0;
            }
            .typing-indicator span {
                width: 8px;
                height: 8px;
                background: var(--accent);
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }
            .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                30% { transform: translateY(-8px); opacity: 1; }
            }
            @media (max-width: 600px) {
                body { padding: 10px; }
                .chat { height: 95vh; border-radius: 16px; }
                header { padding: 16px; }
                .bubble { max-width: 85%; }
                input[type=text] { padding: 12px 16px; }
                button.send { padding: 12px 20px; }
            }
        </style>
    </head>
    <body>
        <div class="chat">
            <header>
                <div class="logo">🤖</div>
                <div>
                    <div class="title">AI Chat Assistant</div>
                    <div class="subtitle">Powered by Gemini • Always here to help</div>
                </div>
                <div class="status" id="status">Connecting…</div>
            </header>
            <main>
                <div class="messages" id="messages"></div>
            </main>
            <footer>
                <form id="message-form" class="input-wrap" onsubmit="sendMessage(event)">
                    <input id="message-input" type="text" placeholder="✨ Ask me anything... code, explanations, debugging help" autocomplete="off" />
                    <button class="send" id="send-button">Send 🚀</button>
                </form>
            </footer>
        </div>

        <script>
            const statusEl = document.getElementById('status');
            const messagesEl = document.getElementById('messages');
            const inputEl = document.getElementById('message-input');

            // Configure marked for code highlighting
            marked.setOptions({
                highlight: function(code, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        return hljs.highlight(code, { language: lang }).value;
                    }
                    return hljs.highlightAuto(code).value;
                },
                breaks: true
            });

            function timestamp() { return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); }

            function addMessage(sender, text, who) {
                const wrap = document.createElement('div');
                wrap.className = 'msg ' + who;

                const avatar = document.createElement('div');
                avatar.className = 'avatar';
                avatar.textContent = who === 'me' ? '👤' : (sender === 'AI' ? '🤖' : '⚙️');

                const body = document.createElement('div');
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                
                // Render markdown for AI messages, plain text for user
                if (who === 'ai') {
                    bubble.innerHTML = marked.parse(text);
                    // Re-highlight any code blocks
                    bubble.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                } else {
                    bubble.textContent = text;
                }

                const meta = document.createElement('div');
                meta.className = 'meta';
                meta.textContent = sender + ' • ' + timestamp();

                body.appendChild(bubble);
                body.appendChild(meta);

                wrap.appendChild(avatar);
                wrap.appendChild(body);
                messagesEl.appendChild(wrap);
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }

            // Build ws url based on page protocol (supports wss over https)
            function wsUrl() {
                const proto = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
                return proto + window.location.host;
            }

            let ws;
            function connect() {
                statusEl.textContent = 'Connecting…';
                statusEl.classList.add('disconnected');
                ws = new WebSocket(wsUrl());

                ws.onopen = () => { 
                    statusEl.textContent = 'Online'; 
                    statusEl.classList.remove('disconnected');
                };
                ws.onmessage = (ev) => {
                    try {
                        const d = JSON.parse(ev.data);
                        if (d.sender === 'AI') addMessage('AI', d.message, 'ai');
                        else if (d.sender === 'System') addMessage('System', d.message, 'sys');
                        else if (d.sender === 'You') addMessage('You', d.message, 'me');
                    } catch (e) { console.error('Invalid message', e); }
                };
                ws.onclose = () => {
                    statusEl.textContent = 'Offline';
                    statusEl.classList.add('disconnected');
                    setTimeout(connect, 5000);
                };
                ws.onerror = (err) => { console.error('WS error', err); ws.close(); };
            }

            function sendMessage(e) {
                e.preventDefault();
                const val = inputEl.value.trim();
                if (!val || !ws || ws.readyState !== WebSocket.OPEN) return;
                ws.send(JSON.stringify({ message: val }));
                inputEl.value = '';
            }

            window.addEventListener('load', () => { connect(); });
        </script>
    </body>
</html>`;

app.get('/chat', (req, res) => {
    res.send(html);
});

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify({
        sender: "System",
        message: "Welcome! You are connected to the chat. Type a message to talk to the AI."
    }));

    ws.on('message', async (message) => {
        let userMessage = '';
        try {
            // Assuming the client sends a JSON string with a 'message' key
            const data = JSON.parse(message.toString());
            userMessage = data.message;
        } catch (e) {
            console.error("Error parsing incoming message:", e);
            return;
        }

        if (!userMessage) return;

        ws.send(JSON.stringify({
            sender: "You",
            message: userMessage
        }));

        const aiResponseText = await getAiResponse(userMessage);

        ws.send(JSON.stringify({
            sender: "AI",
            message: aiResponseText
        }));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// --- Start Server ---
server.listen(PORT, () => {
    console.log('Server started on http://localhost:' + PORT);
});