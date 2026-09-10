const { useState, useEffect } = React;

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

function AccordionGallery({ items, defaultIndex = 0, expandRatio = 0.52, trigger = 'hover', children }) {
  // Prefer children (editable template markup) over the items prop.
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

  const rootRef = React.useRef(null);
  const isMobile = useContainerNarrow(rootRef, 760);

  const setActiveHandlers = (i) => isMobile
    ? {}
    : (trigger === 'hover'
        ? { onMouseEnter: () => setActive(i), onFocus: () => setActive(i) }
        : { onClick: () => setActive(i) });

  const containerStyle = isMobile
    ? { display: 'flex', gap: '12px', width: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', paddingBottom: '4px' }
    : { display: 'flex', gap: '10px', width: '100%', height: '460px', borderRadius: '0', overflow: 'hidden' };

  return React.createElement('div', { ref: rootRef, style: containerStyle }, list.map((item, i) => {
    const isActive = isMobile ? true : i === active;
    return React.createElement('a', {
      key: i,
      href: item.link || undefined,
      ...setActiveHandlers(i),
      style: isMobile ? {
        position: 'relative',
        flex: '0 0 78%',
        aspectRatio: '4 / 5',
        scrollSnapAlign: 'start',
        overflow: 'hidden',
        textDecoration: 'none',
        display: 'block',
        background: 'var(--color-text)'
      } : {
        position: 'relative',
        flexGrow: isActive ? grow : 1,
        flexBasis: 0,
        minWidth: 0,
        overflow: 'hidden',
        borderRadius: '0',
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
        style: {
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'
        }
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
          transition: isMobile ? 'none' : 'opacity 0.4s ease, transform 0.4s ease'
        }
      },
        React.createElement('span', { style: { width: '3px', height: '26px', background: 'var(--color-accent)' } }),
        item.node
          ? React.cloneElement(item.node, {
              'data-image': undefined,
              'data-link': undefined,
              style: { ...LABEL_STYLE, ...(isMobile ? { fontSize: '24px' } : { whiteSpace: 'nowrap', textOverflow: 'ellipsis' }), ...(item.node.props.style || {}) }
            })
          : React.createElement('span', { style: { ...LABEL_STYLE, ...(isMobile ? { fontSize: '24px' } : { whiteSpace: 'nowrap', textOverflow: 'ellipsis' }) } }, item.label)
      )
    );
  }));
}

window.AccordionGallery = AccordionGallery;
