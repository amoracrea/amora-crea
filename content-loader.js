// Loads a JSON file from content/ and hands it to a DC logic class.
// Falls back to an inline <script type="application/json"> snapshot when the
// page is opened straight off the filesystem (fetch of a local file is blocked).
window.AmoraContent = {
  async load(name, key) {
    const inline = document.getElementById('content-' + name);
    try {
      const res = await fetch('content/' + name + '.json', { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        return data[key] || [];
      }
    } catch (e) { /* fall through to the inline snapshot */ }
    if (inline) {
      try { return (JSON.parse(inline.textContent) || {})[key] || []; } catch (e) {}
    }
    return [];
  },
  wa(msg) {
    return 'https://wa.me/543572694076?text=' + encodeURIComponent(msg);
  }
};
