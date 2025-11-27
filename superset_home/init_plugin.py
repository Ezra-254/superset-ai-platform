#!/usr/bin/env python3
"""
Script to initialize the chatbot plugin in Superset
"""

import os
import sys

def init_plugin():
    plugin_path = os.path.join(os.path.dirname(__file__), 'plugins')
    
    # Add plugins to Python path
    if plugin_path not in sys.path:
        sys.path.insert(0, plugin_path)
    
    print("Chatbot plugin initialization complete")
    
    # For now, we'll use a simpler approach - create a custom template
    # that injects our chat component
    template_content = """
{% extends "superset/basic.html" %}

{% block head_js %}
    {{ super() }}
    <script>
    // Inject chatbot component when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
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
                <button onclick="toggleChat()" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">−</button>
            </div>
            <div id="chat-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
                <div style="padding: 10px 15px; border-radius: 18px; background: #f1f1f1; color: #333; align-self: flex-start; max-width: 80%;">
                    Hello! I'm your Superset AI assistant. How can I help you today?
                </div>
            </div>
            <div style="padding: 15px; border-top: 1px solid #e0e0e0; display: flex; gap: 10px;">
                <input type="text" id="chat-input" placeholder="Type your question..." style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 20px; outline: none; font-size: 14px;">
                <button onclick="sendMessage()" style="background: #3366CC; color: white; border: none; border-radius: 20px; padding: 0 20px; cursor: pointer; font-weight: bold;">Send</button>
            </div>
        </div>
        
        <script>
        let isMinimized = false;
        
        function toggleChat() {
            const chat = document.getElementById('superset-chatbot');
            const messages = document.getElementById('chat-messages');
            const input = document.getElementById('chat-input');
            
            if (isMinimized) {
                chat.style.height = '500px';
                messages.style.display = 'flex';
                input.parentElement.style.display = 'flex';
                isMinimized = false;
            } else {
                chat.style.height = 'auto';
                messages.style.display = 'none';
                input.parentElement.style.display = 'none';
                isMinimized = true;
            }
        }
        
        function sendMessage() {
            const input = document.getElementById('chat-input');
            const messages = document.getElementById('chat-messages');
            const text = input.value.trim();
            
            if (text === '') return;
            
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.style.cssText = 'padding: 10px 15px; border-radius: 18px; background: #3366CC; color: white; align-self: flex-end; max-width: 80%;';
            userMsg.textContent = text;
            messages.appendChild(userMsg);
            
            input.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.style.cssText = 'padding: 10px 15px; border-radius: 18px; background: #f1f1f1; color: #333; align-self: flex-start; max-width: 80%;';
                aiMsg.textContent = "I'm a demo chatbot. In the next steps, we'll connect me to Gemini AI!";
                messages.appendChild(aiMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 1000);
            
            messages.scrollTop = messages.scrollHeight;
        }
        
        // Handle Enter key
        document.getElementById('chat-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        </script>
        `;
        
        // Inject into body
        const chatContainer = document.createElement('div');
        chatContainer.innerHTML = chatHTML;
        document.body.appendChild(chatContainer);
    });
    </script>
{% endblock %}
"""
    
    # Write the custom template
    template_file = os.path.join(os.path.dirname(__file__), 'templates', 'my_custom_template.html')
    os.makedirs(os.path.dirname(template_file), exist_ok=True)
    
    with open(template_file, 'w') as f:
        f.write(template_content)
    
    print(f"Custom template created at: {template_file}")

if __name__ == "__main__":
    init_plugin()
