const { useState, useEffect } = React;

function ProductGallery({ children, images, autoplay, arrows = true, ratio = '4 / 5' }) {
  const fromData = Array.isArray(images) && images.length
    ? images.map((src, i) => React.createElement('figure', {
        key: 'i' + i, className: 'grayscale', style: { margin: 0 }
      }, React.createElement('img', {
        src: src, alt: '', loading: i === 0 ? 'eager' : 'lazy', decoding: 'async',
        style: { width: '100%', aspectRatio: ratio, objectFit: 'cover', display: 'block', background: 'var(--color-surface)' }
      })))
    : null;
  const kids = fromData || React.Children.toArray(children).filter(c => c && c.props);
  const count = kids.length || 5;
  const [active, setActive] = useState(0);
  const ms = Number(autoplay) || 0;
  const showArrows = arrows !== false && arrows !== 'false';
  const pad = showArrows ? '0 52px' : '0';

  useEffect(() => {
    if (!ms || count < 2) return;
    const id = setInterval(() => setActive(a => (a + 1) % count), ms);
    return () => clearInterval(id);
  }, [ms, count]);

  const go = (d) => setActive((active + d + count) % count);

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
    React.createElement('div', { style: { position: 'relative', padding: pad } },
      kids.map((kid, i) => React.createElement('div', {
        key: i,
        style: { display: i === active ? 'block' : 'none' }
      }, kid)),
      showArrows && count > 1 && React.createElement('button', {
        type: 'button', onClick: () => go(-1), 'aria-label': 'Anterior',
        style: {
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: '44px', height: '44px', border: 'none', background: 'var(--color-accent)',
          color: 'var(--color-bg)', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 2
        }
      }, React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('path', { d: 'm15 18-6-6 6-6' }))),
      showArrows && count > 1 && React.createElement('button', {
        type: 'button', onClick: () => go(1), 'aria-label': 'Siguiente',
        style: {
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          width: '44px', height: '44px', border: 'none', background: 'var(--color-accent)',
          color: 'var(--color-bg)', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 2
        }
      }, React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('path', { d: 'm9 18 6-6-6-6' })))
    ),
    React.createElement('div', { style: { display: 'flex', gap: '7px', justifyContent: 'center', alignItems: 'center', padding: pad } },
      kids.map((_, i) => React.createElement('button', {
        key: i, type: 'button', onClick: () => setActive(i), 'aria-label': 'Foto ' + (i + 1),
        style: {
          width: '6px', height: '6px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0,
          background: i === active ? 'var(--color-accent)' : 'var(--color-accent-200)',
          transition: 'background 0.3s ease'
        }
      }))
    )
  );
}

window.ProductGallery = ProductGallery;
