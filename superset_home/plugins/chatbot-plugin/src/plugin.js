import { Component } from 'react';

export default class ChatbotPlugin extends Component {
  componentDidMount() {
    this.injectChatbot();
  }

  injectChatbot = () => {
    // Remove existing chatbot if any
    const existingChat = document.getElementById('superset-chatbot');
    if (existingChat) {
      existingChat.remove();
    }

    // Create chatbot HTML
    const html = `
    <div id="superset-chatbot" style="position: fixed; bottom: 20px; right: 20px; width: 350px; height: 520px; background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; flex-direction: column; z-index: 10000; font-family: system-ui;">
      <div style="background: #3366CC; color: white; padding: 15px; border-radius: 10px 10px 0 0; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
        <span>🤖 AI Assistant</span>
        <button id="minimize-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px; padding: 5px 10px;">−</button>
      </div>
      <div id="chat-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
        <div style="padding: 10px 14px; border-radius: 18px; background: #e9ecef; color: #333; align-self: flex-start; max-width: 80%;">
          Hello! I'm your AI assistant. How can I help with your data?
        </div>
      </div>
      <div id="input-area" style="padding: 15px; border-top: 1px solid #e0e0e0; display: flex; gap: 10px;">
        <input type="text" id="chat-input" placeholder="Ask about your data..." style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 20px; outline: none; font-size: 14px;">
        <button id="send-btn" style="background: #3366CC; color: white; border: none; border-radius: 20px; padding: 0 20px; cursor: pointer; font-weight: bold;">Send</button>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    this.attachEventListeners();
  };

  attachEventListeners = () => {
    const messages = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const minimizeBtn = document.getElementById('minimize-btn');
    const chatbot = document.getElementById('superset-chatbot');
    const inputArea = document.getElementById('input-area');

    // Scroll to bottom helper
    const scrollToBottom = () => {
      messages.scrollTop = messages.scrollHeight;
    };
    
    // Add message helper
    const addMessage = (text, isUser = false) => {
      const div = document.createElement('div');
      div.textContent = text;
      div.style.cssText = 'padding:10px 14px;border-radius:18px;max-width:80%;word-wrap:break-word;' + 
        (isUser ? 'background:#3366CC;color:white;align-self:flex-end;' : 'background:#e9ecef;color:#333;align-self:flex-start;');
      messages.appendChild(div);
      scrollToBottom();
    };

    // Send message function
    const sendMessage = () => {
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, true);
      input.value = '';
      
      // Simulate AI response
      setTimeout(() => {
        addMessage('I received: "' + text + '". This is a demo - will connect to Gemini AI soon!');
      }, 600);
    };

    // Attach event listeners
    sendBtn.onclick = sendMessage;
    
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    };

    minimizeBtn.onclick = () => {
      if (chatbot.style.height === 'auto') {
        // Expand
        chatbot.style.height = '520px';
        messages.style.display = 'flex';
        inputArea.style.display = 'flex';
        minimizeBtn.textContent = '−';
      } else {
        // Minimize
        chatbot.style.height = 'auto';
        messages.style.display = 'none';
        inputArea.style.display = 'none';
        minimizeBtn.textContent = '+';
      }
    };

    // Focus input and scroll to bottom
    input.focus();
    scrollToBottom();
    
    console.log('Superset Chatbot plugin loaded successfully!');
  };

  render() {
    return null;
  }
}
