(() => {
  let ready = false;
  let panel;
  let errorDetails = '';
  const describeError = (error) => {
    if (error instanceof Error) return `${error.name}: ${error.message}`;
    return String(error).slice(0, 400);
  };
  const startupDiagnostics = () => {
    const entries = performance.getEntriesByType('resource');
    const wasm = entries.find((entry) => /canvaskit\/chromium\/canvaskit\.wasm/.test(entry.name));
    const main = entries.find((entry) => /\/main\.dart\.js(?:\?|$)/.test(entry.name));
    return [
      `route=${location.pathname}`,
      `main=${main ? `${Math.round(main.duration)}ms/${main.transferSize}B` : 'not requested'}`,
      `canvasKitWasm=${wasm ? `${Math.round(wasm.duration)}ms/${wasm.transferSize}B` : 'not requested'}`,
      `canvasKit=${typeof window.flutterCanvasKit}`,
      `serviceWorker=${navigator.serviceWorker?.controller?.scriptURL || 'none'}`,
    ].join('\n');
  };
  function showFailure() {
    if (ready || panel) return;
    panel = document.createElement('section');
    panel.setAttribute('role', 'alert');
    panel.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:white;color:#222;font:16px system-ui;text-align:center';
    const message = document.createElement('p');
    message.textContent = '暂时无法打开，请检查网络后重试。';
    const details = document.createElement('pre');
    details.textContent = `${errorDetails || 'No captured JavaScript error'}\n${startupDiagnostics()}`;
    details.style.cssText = 'max-width:min(100%,760px);max-height:45vh;overflow:auto;white-space:pre-wrap;text-align:left;font:12px/1.45 ui-monospace,monospace;color:#555';
    panel.append(details);
    const retry = document.createElement('button');
    retry.textContent = '重新打开';
    retry.style.cssText = 'padding:12px 24px;border:0;border-radius:6px;background:#0072c6;color:white;font:inherit;cursor:pointer';
    retry.addEventListener('click', () => location.reload());
    panel.append(message, retry);
    document.body.append(panel);
  }
  // Cold starts may need extra time to download and initialize CanvasKit.
  const timer = setTimeout(showFailure, 90000);
  window.addEventListener('flutter-first-frame', () => {
    ready = true;
    clearTimeout(timer);
    panel?.remove();
  }, { once: true });
  window.addEventListener('error', (event) => {
    errorDetails = event.target instanceof HTMLScriptElement
      ? `Failed script: ${event.target.src}`
      : `JavaScript error: ${event.message || 'unknown'}`;
    if (event.target instanceof HTMLScriptElement) showFailure();
  }, true);
  window.addEventListener('unhandledrejection', (event) => {
    errorDetails = `Unhandled rejection: ${describeError(event.reason)}`;
  });
})();
