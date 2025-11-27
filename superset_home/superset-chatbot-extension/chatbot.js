// Superset Chatbot Extension
(function() {
    'use strict';

    function initChatbot() {
        if (document.getElementById('superset-chatbot')) {
            document.getElementById('superset-chatbot').remove();
        }

        var html = `<div id="superset-chatbot" style="position:fixed;bottom:20px;right:20px;width:350px;height:520px;background:white;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;flex-direction:column;z-index:10000;font-family:system-ui">
          <div style="background:#3366CC;color:white;padding:15px;border-radius:10px 10px 0 0;font-weight:bold;display:flex;justify-content:space-between;align-items:center">
            <span>🤖 AI Assistant</span>
            <button id="minimize-btn" style="background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:5px 10px">−</button>
          </div>
          <div id="chat-messages" style="flex:1;padding:15px;overflow-y:auto;display:flex;flex-direction:column;gap:10px">
            <div style="padding:10px 14px;border-radius:18px;background:#e9ecef;color:#333;align-self:flex-start;max-width:80%">Hello! I'm your AI assistant. How can I help with your data?</div>
          </div>
          <div id="input-area" style="padding:15px;border-top:1px solid #e0e0e0;display:flex;gap:10px">
            <input type="text" id="chat-input" placeholder="Ask about your data..." style="flex:1;padding:12px;border:1px solid #ddd;border-radius:20px;outline:none;font-size:14px">
            <button id="send-btn" style="background:#3366CC;color:white;border:none;border-radius:20px;padding:0 20px;cursor:pointer;font-weight:bold">Send</button>
          </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        
        var messages = document.getElementById('chat-messages');
        var input = document.getElementById('chat-input');
        var sendBtn = document.getElementById('send-btn');
        var minimizeBtn = document.getElementById('minimize-btn');
        var chatbot = document.getElementById('superset-chatbot');
        var inputArea = document.getElementById('input-area');

        function scrollToBottom() {
            messages.scrollTop = messages.scrollHeight;
        }

        function addMessage(text, isUser) {
            var div = document.createElement('div');
            div.textContent = text;
            div.style.cssText = 'padding:10px 14px;border-radius:18px;max-width:80%;word-wrap:break-word;' + 
                (isUser ? 'background:#3366CC;color:white;align-self:flex-end;' : 'background:#e9ecef;color:#333;align-self:flex-start;');
            messages.appendChild(div);
            scrollToBottom();
        }

        function sendMessage() {
            var text = input.value.trim();
            if (!text) return;
            addMessage(text, true);
            input.value = '';
            setTimeout(function() {
                addMessage('I received: "' + text + '". This is a demo - will connect to Gemini AI soon!');
            }, 600);
        }

        sendBtn.onclick = sendMessage;
        input.onkeydown = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        };
        minimizeBtn.onclick = function() {
            if (chatbot.style.height === 'auto') {
                chatbot.style.height = '520px';
                messages.style.display = 'flex';
                inputArea.style.display = 'flex';
                minimizeBtn.textContent = '−';
            } else {
                chatbot.style.height = 'auto';
                messages.style.display = 'none';
                inputArea.style.display = 'none';
                minimizeBtn.textContent = '+';
            }
        };
        input.focus();
        scrollToBottom();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();
