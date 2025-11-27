// Chatbot Injector for Superset
(function() {
    'use strict';
    
    function injectChatbot() {
        // Check if chatbot already exists
        if (document.getElementById('superset-chatbot')) {
            return;
        }
        
        // Create chatbot container
        const chatHTML = `
        <div id="superset-chatbot" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="background: #3366CC; color: white; padding: 15px; border-radius: 10px 10px 0 0; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                AI Assistant
                <button id="chat-toggle" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">−</button>
            </div>
            <div id="chat-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
                <div style="padding: 10px 15px; border-radius: 18px; background: #f1f1f1; color: #333; align-self: flex-start; max-width: 80%;">
                    Hello! I'm your Superset AI assistant. How can I help you today?
                </div>
            </div>
            <div style="padding: 15px; border-top: 1px solid #e0e0e0; display: flex; gap: 10px;">
                <input type="text" id="chat-input" placeholder="Type your question..." style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 20px; outline: none; font-size: 14px;">
                <button id="chat-send" style="background: #3366CC; color: white; border: none; border-radius: 20px; padding: 0 20px; cursor: pointer; font-weight: bold;">Send</button>
            </div>
        </div>
        `;
        
        // Inject into body
        const chatContainer = document.createElement('div');
        chatContainer.innerHTML = chatHTML;
        document.body.appendChild(chatContainer);
        
        // Add chatbot functionality
        let isMinimized = false;
        
        document.getElementById('chat-toggle').addEventListener('click', function() {
            const chat = document.getElementById('superset-chatbot');
            const messages = document.getElementById('chat-messages');
            const input = document.getElementById('chat-input');
            const sendBtn = document.getElementById('chat-send');
            const toggleBtn = document.getElementById('chat-toggle');
            
            if (isMinimized) {
                chat.style.height = '500px';
                messages.style.display = 'flex';
                input.parentElement.style.display = 'flex';
                toggleBtn.textContent = '−';
                isMinimized = false;
            } else {
                chat.style.height = 'auto';
                messages.style.display = 'none';
                input.parentElement.style.display = 'none';
                toggleBtn.textContent = '+';
                isMinimized = true;
            }
        });
        
        function sendMessage() {
            const input = document.getElementById('chat-input');
            const messages = document.getElementById('chat-messages');
            const text = input.value.trim();
            
            if (text === '') return;
            
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.style.cssText = 'padding: 10px 15px; border-radius: 18px; background: #3366CC; color: white; align-self: flex-end; max-width: 80%; word-wrap: break-word;';
            userMsg.textContent = text;
            messages.appendChild(userMsg);
            
            input.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.style.cssText = 'padding: 10px 15px; border-radius: 18px; background: #f1f1f1; color: #333; align-self: flex-start; max-width: 80%; word-wrap: break-word;';
                aiMsg.textContent = "I'm a demo chatbot. In the next steps, we'll connect me to Gemini AI!";
                messages.appendChild(aiMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 1000);
            
            messages.scrollTop = messages.scrollHeight;
        }
        
        document.getElementById('chat-send').addEventListener('click', sendMessage);
        
        document.getElementById('chat-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatbot);
    } else {
        injectChatbot();
    }
})();
