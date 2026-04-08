document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.code-copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const wrapper = btn.closest('.code-block-wrapper');
      if (!wrapper) return;

      const code = wrapper.querySelector('pre code');
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code.textContent || '');
        btn.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.textContent = 'Failed';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 2000);
      }
    });
  });
});
