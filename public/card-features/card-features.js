(() => {
  'use strict';
  const buttons = document.querySelectorAll('[data-share-card]');
  for (const button of buttons) {
    const url = button.dataset.shareUrl;
    const row = button.closest('.card-button-row');
    const status = document.createElement('span');
    status.className = 'share-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    row.after(status);
    const fallback = document.createElement('div');
    fallback.className = 'share-copy-panel';
    fallback.hidden = true;
    const label = document.createElement('label');
    label.textContent = 'Copy this card link';
    const input = document.createElement('input');
    input.type = 'url';
    input.readOnly = true;
    input.value = url;
    input.setAttribute('aria-label', 'Card link');
    label.append(input);
    fallback.append(label);
    status.after(fallback);
    let pending = false;
    button.addEventListener('click', async () => {
      if (pending) return;
      pending = true;
      fallback.hidden = true;
      status.textContent = '';
      try {
        if (typeof navigator.share === 'function') {
          try {
            // Share the URL, not a JPEG attachment: recipients retain a tappable
            // card link and the destination page supplies its full-size OG image.
            await navigator.share({ url });
            return;
          } catch (error) {
            if (error && error.name === 'AbortError') return;
            // A blocked/unsupported native share falls back to copying the URL.
          }
        }
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          try {
            await navigator.clipboard.writeText(url);
            status.textContent = 'Card link copied. Paste it into a message to share.';
            button.querySelector('.share-label').textContent = 'Link Copied';
            window.setTimeout(() => {
              button.querySelector('.share-label').textContent = 'Share Card';
            }, 2500);
            return;
          } catch (_) { /* Show a selectable URL if clipboard access is denied. */ }
        }
        fallback.hidden = false;
        input.focus();
        input.select();
        status.textContent = 'Copy the selected card link to share it.';
      } finally {
        pending = false;
      }
    });
  }
})();
