(() => {
  let ready = false;
  let panel;
  function showFailure() {
    if (ready || panel) return;
    panel = document.createElement('section');
    panel.setAttribute('role', 'alert');
    panel.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:white;color:#222;font:16px system-ui;text-align:center';
    const message = document.createElement('p');
    message.textContent = '暂时无法打开，请检查网络后重试。';
    const retry = document.createElement('button');
    retry.textContent = '重新打开';
    retry.style.cssText = 'padding:12px 24px;border:0;border-radius:6px;background:#0072c6;color:white;font:inherit;cursor:pointer';
    retry.addEventListener('click', () => location.reload());
    panel.append(message, retry);
    document.body.append(panel);
  }
  const timer = setTimeout(showFailure, 20000);
  window.addEventListener('flutter-first-frame', () => {
    ready = true;
    clearTimeout(timer);
    panel?.remove();
  }, { once: true });
  window.addEventListener('error', (event) => {
    if (event.target instanceof HTMLScriptElement) showFailure();
  }, true);
})();
