// Inline <video> tags: don't fetch until scrolled into view; autoplay looping
// ones only while visible. Keeps heavy mp4s off the initial page load.
(() => {
  function prep(v) {
    if (v.dataset.lazyReady) return;
    v.dataset.lazyReady = '1';
    v.dataset.autoloop = v.hasAttribute('loop') ? '1' : '';
    v.removeAttribute('autoplay');
    v.autoplay = false;
    v.preload = 'none';
  }

  const io = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
        for (const e of entries) {
          const v = e.target;
          if (e.isIntersecting) {
            if (v.preload === 'none') { v.preload = 'metadata'; v.load(); }
            if (v.dataset.autoloop) {
              v.preload = 'auto';
              v.play().catch(() => {});
            }
          } else if (v.dataset.autoloop && !v.paused) {
            v.pause();
          }
        }
      }, { rootMargin: '300px' })
    : null;

  const seen = new WeakSet();
  function scan() {
    document.querySelectorAll('video').forEach((v) => {
      prep(v);
      if (io && !seen.has(v)) { seen.add(v); io.observe(v); }
    });
  }

  scan();
  document.addEventListener('DOMContentLoaded', scan);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
