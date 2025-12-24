# 🤖 AI Chat Assistant

A beautiful, real-time AI chat application powered by **Google Gemini AI** with WebSocket communication and modern UI design.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## ✨ Features

- 🤖 **AI-Powered Responses** - Integrated with Google Gemini 2.5 Flash model
- ⚡ **Real-time Communication** - WebSocket for instant messaging
- 🎨 **Beautiful UI** - Modern gradient design with animations
- 💻 **Code Highlighting** - Syntax highlighting for code snippets
- 📝 **Markdown Support** - AI responses rendered with proper formatting
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔒 **Secure** - API keys stored in environment variables

---

## 🖼️ Screenshots

```
┌─────────────────────────────────────────┐
│  🤖 AI Chat Assistant          Online   │
├─────────────────────────────────────────┤
│                                         │
│  ⚙️ System                              │
│  ┌─────────────────────────────────┐    │
│  │ Welcome! You are connected...   │    │
│  └─────────────────────────────────┘    │
│                                         │
│                          👤 You         │
│    ┌─────────────────────────────────┐  │
│    │ How to create a function in JS? │  │
│    └─────────────────────────────────┘  │
│                                         │
│  🤖 AI                                  │
│  ┌─────────────────────────────────┐    │
│  │ Here's how to create a function │    │
│  │ ```javascript                   │    │
│  │ function greet(name) {          │    │
│  │   return `Hello, ${name}!`;     │    │
│  │ }                               │    │
│  │ ```                             │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│  [✨ Ask me anything...]    [Send 🚀]   │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web server framework |
| **WebSocket (ws)** | Real-time bidirectional communication |
| **Google Gemini AI** | AI model for generating responses |
| **Marked.js** | Markdown parsing |
| **Highlight.js** | Code syntax highlighting |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
ai-chat-app/
├── 📄 server.js        # Main server file (Express + WebSocket + AI)
├── 📄 package.json     # Dependencies and scripts
├── 📄 .env             # Environment variables (API keys)
├── 📄 .gitignore       # Git ignore rules
└── 📄 README.md        # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-chat-app.git
   cd ai-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   touch .env
   ```

4. **Add your API key to `.env`**
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   node server.js
   ```

6. **Open in browser**
   ```
   http://localhost:9000
   ```

---

## 🔑 Getting Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key and paste it in your `.env` file

---

## 📡 API Architecture

```
┌──────────────┐     WebSocket      ┌──────────────┐     HTTPS API     ┌──────────────┐
│              │ ◄────────────────► │              │ ◄───────────────► │              │
│   Browser    │    Real-time       │   Server     │     Request/      │   Google     │
│   (Client)   │    Messages        │  (Node.js)   │     Response      │  Gemini AI   │
│              │                    │              │                   │              │
└──────────────┘                    └──────────────┘                   └──────────────┘
```

---

## 🎨 UI Features

- **Gradient Background** - Purple to pink gradient
- **Glass Effect** - Frosted glass card design
- **Message Bubbles** - Different colors for user/AI/system
- **Animations** - Smooth slide-in effects
- **Status Indicator** - Live connection status with pulse animation
- **Code Blocks** - Dark theme syntax highlighting
- **Responsive** - Adapts to all screen sizes

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-restart) |
| `node server.js` | Start production server |

---

## 🔧 Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `9000` |
| `AI_MODEL` | Gemini model name | `gemini-2.5-flash` |
| `GEMINI_API_KEY` | Your API key | Required |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Muhammad**

- GitHub: [@your-username](https://github.com/your-username)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the AI model
- [Express.js](https://expressjs.com/) for the web framework
- [Highlight.js](https://highlightjs.org/) for code highlighting
- [Marked.js](https://marked.js.org/) for Markdown parsing

---

## ⭐ Show Your Support

Give a ⭐ if this project helped you!

---

<p align="center">Made with ❤️ by Muhammad</p>
# ai-chat-app
