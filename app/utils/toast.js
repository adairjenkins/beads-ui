/**
 * Show a transient global toast message anchored to the viewport.
 *
 * @param {string} text - Message text.
 * @param {'info'|'success'|'error'} [variant] - Visual variant.
 * @param {number} [duration_ms] - Auto-dismiss delay in milliseconds.
 */
export function showToast(text, variant = 'info', duration_ms = 2800) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  el.style.position = 'fixed';
  el.style.right = '12px';
  el.style.bottom = '12px';
  el.style.zIndex = '1000';
  el.style.padding = '8px 10px';
  el.style.borderRadius = '4px';
  el.style.fontSize = '12px';
  if (variant === 'success') {
    el.style.background = 'var(--success)';
    el.style.color = 'var(--success-fg)';
  } else if (variant === 'error') {
    el.style.background = 'var(--danger)';
    el.style.color = 'var(--danger-fg)';
  } else {
    el.style.background = 'var(--panel-bg)';
    el.style.color = 'var(--fg)';
    el.style.border = '1px solid var(--border)';
  }
  (document.body || document.documentElement).appendChild(el);
  setTimeout(() => {
    try {
      el.remove();
    } catch {
      /* ignore */
    }
  }, duration_ms);
}
