// Chatbot for Superset - Complete version
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for page to fully load
    setTimeout(createChatbot, 2000);
});

function createChatbot() {
    // Check if already exists
    if (document.getElementById('superset-chatbot')) return;

    console.log('Injecting Superset Chatbot...');

    const chatbotHTML = `
    <div id="superset-chatbot" style="position: fixed; bottom: 20px; right: 20px; width: 350px; height: 500px; background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; flex-direction: column; z-index: 10000; font-family: system-ui;">
        <div style="background: #3366CC; color: white; padding: 15px; border-radius: 10px 10px 0 0; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
            <span>🤖 AI Assistant</span>
            <button id="chatbot-toggle" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">−</button>
        </div>
        <div id="chatbot-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
            <div style="padding: 10px 15px; border-radius: 18px; background: #f1f1f1; color: #333; align-self: flex-start; max-width: 80%;">
                Hello! I'm your Superset AI assistant. How can I help you today?
            </div>
        </div>
        <div style="padding: 15px; border-top: 1px solid #e0e0e0; display: flex; gap: 10px;">
            <input type="text" id="chatbot-input" placeholder="Ask about your data..." style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 20px; outline: none; font-size: 14px;">
            <button id="chatbot-send" style="background: #3366CC; color: white; border: none; border-radius: 20px; padding: 0 20px; cursor: pointer; font-weight: bold;">Send</button>
        </div>
    </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = chatbotHTML;
    document.body.appendChild(div);
    
    // Add functionality
    setupChatbot();
}

function setupChatbot() {
    let isMinimized = false;
    const chatbot = document.getElementById('superset-chatbot');
    const toggleBtn = document.getElementById('chatbot-toggle');
    const messages = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    
    toggleBtn.addEventListener('click', function() {
        if (isMinimized) {
            chatbot.style.height = '500px';
            messages.style.display = 'flex';
            input.parentElement.style.display = 'flex';
            toggleBtn.textContent = '−';
            isMinimized = false;
        } else {
            chatbot.style.height = 'auto';
            messages.style.display = 'none';
            input.parentElement.style.display = 'none';
            toggleBtn.textContent = '+';
            isMinimized = true;
        }
    });
    
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        
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
            aiMsg.textContent = "I'm a demo chatbot. We'll connect to Gemini AI soon!";
            messages.appendChild(aiMsg);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
        
        messages.scrollTop = messages.scrollHeight;
    }
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    console.log('Superset Chatbot loaded successfully!');
}
