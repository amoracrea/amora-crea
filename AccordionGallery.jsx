const { useState, useEffect, useRef } = React;

const LABEL_STYLE = {
  color: 'var(--color-bg)',
  fontFamily: "'Give You Glory', cursive",
  fontSize: '28px',
  overflow: 'hidden',
  pointerEvents: 'auto'
};

function useContainerNarrow(ref, bp) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth || el.getBoundingClientRect().width;
      if (w) setNarrow(w <= bp);
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ref, bp]);
  return narrow;
}

function AccordionGallery({ children, items, defaultIndex = 0, expandRatio = 0.52, trigger = 'hover' }) {
  const kids = React.Children.toArray(children).filter(c => c && c.props);
  const list = kids.length
    ? kids.map(c => ({
        image: c.props['data-image'],
        link: c.props['data-link'],
        node: c
      }))
    : (items || []);

  const count = list.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)));
  const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
  const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;

  const rootRef = useRef(null);
  const isMobile = useContainerNarrow(rootRef, 760);

  const label = (item, style) =>
    item.node
      ? React.cloneElement(item.node, {
          'data-image': undefined,
          'data-link': undefined,
          style: { ...LABEL_STYLE, ...style, ...(item.node.props.style || {}) }
        })
      : React.createElement('span', { style: { ...LABEL_STYLE, ...style } }, item.label);

  // ---- Mobile: vertical stack. Images sit in normal flow so their intrinsic
  // size gives the card its height — no aspect-ratio/flex circularity, and no
  // horizontal scrolling (which gave no hint that more content existed).
  if (isMobile) {
    return React.createElement('div', {
      ref: rootRef,
      style: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }
    }, list.map((item, i) => React.createElement('a', {
      key: i,
      href: item.link || undefined,
      style: {
        position: 'relative',
        display: 'block',
        width: '100%',
        textDecoration: 'none',
        background: 'var(--color-text)'
      }
    },
      React.createElement('img', {
        src: item.image,
        alt: '',
        loading: i === 0 ? 'eager' : 'lazy',
        decoding: 'async',
        draggable: 'false',
        style: { width: '100%', height: 'auto', display: 'block' }
      }),
      React.createElement('span', {
        style: {
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%',
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent 0%, rgba(43,35,32,0.8) 100%)'
        }
      }),
      React.createElement('span', {
        style: {
          position: 'absolute', left: '16px', bottom: '14px', right: '16px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }
      },
        React.createElement('span', { style: { width: '3px', height: '24px', background: 'var(--color-accent)', flex: '0 0 auto' } }),
        label(item, { fontSize: '26px' })
      )
    )));
  }

  // ---- Desktop: hover accordion
  const setActiveHandlers = (i) => trigger === 'hover'
    ? { onMouseEnter: () => setActive(i), onFocus: () => setActive(i) }
    : { onClick: () => setActive(i) };

  return React.createElement('div', {
    ref: rootRef,
    style: { display: 'flex', gap: '10px', width: '100%', height: '460px', overflow: 'hidden' }
  }, list.map((item, i) => {
    const isActive = i === active;
    return React.createElement('a', {
      key: i,
      href: item.link || undefined,
      ...setActiveHandlers(i),
      style: {
        position: 'relative',
        flexGrow: isActive ? grow : 1,
        flexBasis: 0,
        minWidth: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'block',
        transition: 'flex-grow 0.5s ease',
        background: 'var(--color-text)'
      }
    },
      React.createElement('img', {
        src: item.image,
        alt: '',
        loading: 'lazy',
        decoding: 'async',
        draggable: 'false',
        style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
      }),
      React.createElement('span', {
        style: {
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent 45%, rgba(43,35,32,0.85) 100%)',
          opacity: isActive ? 1 : 0.6, transition: 'opacity 0.5s ease'
        }
      }),
      React.createElement('span', {
        style: {
          position: 'absolute', left: '20px', bottom: '20px', right: '20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          opacity: isActive ? 1 : 0, transform: isActive ? 'translateX(0)' : 'translateX(-14px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease'
        }
      },
        React.createElement('span', { style: { width: '3px', height: '26px', background: 'var(--color-accent)' } }),
        label(item, { whiteSpace: 'nowrap', textOverflow: 'ellipsis' })
      )
    );
  }));
}

window.AccordionGallery = AccordionGallery;
