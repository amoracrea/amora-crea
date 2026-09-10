(() => {
  const BP = 860;
  const CSS_ID = 'amora-mobile-nav-css';

  function injectCss() {
    if (document.getElementById(CSS_ID)) return;
    const s = document.createElement('style');
    s.id = CSS_ID;
    s.textContent = `
      .nav-burger{display:none;align-items:center;justify-content:center;width:44px;height:44px;
        border:2px solid var(--color-text);background:transparent;cursor:pointer;padding:0;margin-left:auto}
      .nav-burger:focus-visible{outline:2px solid var(--color-accent);outline-offset:2px}
      .nav-burger span{display:block;width:20px;height:2px;background:var(--color-text);position:relative}
      .nav-burger span::before,.nav-burger span::after{content:"";position:absolute;left:0;width:20px;height:2px;background:var(--color-text)}
      .nav-burger span::before{top:-6px}
      .nav-burger span::after{top:6px}
      @media (max-width:${BP}px){
        .nav{flex-wrap:wrap !important;gap:0 !important;height:auto !important;
          padding-top:12px !important;padding-bottom:12px !important;align-items:center !important}
        .nav-brand{flex:0 1 auto !important}
        .nav-burger{display:flex}
        .nav > a:not(.nav-brand){display:none !important}
        .nav[data-open="1"] > a:not(.nav-brand){
          display:block !important;flex:0 0 100% !important;padding:14px 2px !important;
          border-top:2px solid var(--color-divider) !important;font-size:15px !important}
        .nav[data-open="1"]{padding-bottom:4px !important}
      }
    `;
    document.head.appendChild(s);
  }

  function wire(nav) {
    if (nav.querySelector('.nav-burger')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-burger';
    btn.setAttribute('aria-label', 'Abrir menú');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span>';
    btn.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === '1';
      nav.setAttribute('data-open', open ? '0' : '1');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      btn.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
    });
    const brand = nav.querySelector('.nav-brand');
    brand && brand.nextSibling ? nav.insertBefore(btn, brand.nextSibling) : nav.appendChild(btn);
  }

  function scan() {
    injectCss();
    document.querySelectorAll('nav.nav').forEach(wire);
  }

  scan();
  document.addEventListener('DOMContentLoaded', scan);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
