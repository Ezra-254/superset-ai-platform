(function() {
  if (document.getElementById('ai-assistant-injected')) return;
  
  const btn = document.createElement('div');
  btn.innerHTML = '<i class="fa fa-robot"></i> AI';
  btn.style.cssText = 'position:fixed;top:20px;right:20px;background:#007bff;color:white;padding:12px 16px;border-radius:50px;font-weight:bold;cursor:pointer;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.4);font-size:14px;';
  btn.onclick = function() {
    const id = 'smart-ai-chat';
    const existing = document.getElementById(id);
    if (existing) { existing.remove(); return; }
    const iframe = document.createElement('iframe');
    iframe.id = id;
    iframe.src = '/static/ai-chat/index.html';
    iframe.style.cssText = 'position:fixed;right:0;top:0;width:440px;height:100vh;border:none;border-left:3px solid #007bff;z-index:9999;box-shadow:-10px 0 30px rgba(0,0,0,0.6);';
    document.body.appendChild(iframe);
  };
  document.body.appendChild(btn);
  btn.id = 'ai-assistant-injected';
})();
