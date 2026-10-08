(() => {
  let ready = false;

  const style = document.createElement('style');
  style.textContent = '@keyframes hx-preview-spin { to { transform: rotate(360deg); } }';
  document.head.append(style);

  const panel = document.createElement('section');
  panel.setAttribute('role', 'status');
  panel.setAttribute('aria-live', 'polite');
  panel.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;background:#f7f4ee;color:#3b332b;font:15px/1.5 system-ui,-apple-system,"Microsoft YaHei",sans-serif;text-align:center';

  const spinner = document.createElement('span');
  spinner.setAttribute('aria-hidden', 'true');
  spinner.style.cssText = 'width:28px;height:28px;border:2px solid rgba(160,125,80,.22);border-top-color:#a63227;border-radius:50%;animation:hx-preview-spin .9s linear infinite';
  const message = document.createElement('p');
  message.textContent = '正在打开华享未来预览…';
  message.style.margin = '0';
  const retry = document.createElement('button');
  retry.textContent = '重新打开';
  retry.style.cssText = 'display:none;padding:12px 24px;border:0;border-radius:6px;background:#a63227;color:white;font:inherit;cursor:pointer';
  retry.addEventListener('click', () => location.reload());
  panel.append(spinner, message, retry);
  document.body.append(panel);

  function showFailure() {
    if (ready) return;
    panel.setAttribute('role', 'alert');
    panel.setAttribute('aria-live', 'assertive');
    spinner.remove();
    message.textContent = '加载时间较长，请检查网络后重试。';
    retry.style.display = 'inline-flex';
  }

  // Cold starts may need extra time to download and initialize CanvasKit.
  const timer = setTimeout(showFailure, 90000);
  window.addEventListener('flutter-first-frame', () => {
    ready = true;
    clearTimeout(timer);
    panel.remove();
  }, { once: true });
  window.addEventListener('error', (event) => {
    if (event.target instanceof HTMLScriptElement) showFailure();
  }, true);
})();
