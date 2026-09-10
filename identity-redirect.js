// Netlify Identity sends invite / password-recovery links to the site root with
// the token in the URL hash. Nothing on the homepage consumes it, so the visit
// looks like a no-op. Forward those links to /admin/, hash intact.
(() => {
  const h = window.location.hash || '';
  const isToken = /(^|[#&])(invite_token|recovery_token|confirmation_token|email_change_token)=/.test(h);
  if (!isToken) return;
  const base = window.location.pathname.replace(/[^/]*$/, '');
  window.location.replace(base + 'admin/' + h);
})();
