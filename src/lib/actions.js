const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fade an element in once it scrolls into view.
 * @type {import('svelte/action').Action<HTMLElement>}
 */
export function reveal(node) {
  if (!('IntersectionObserver' in window) || reduced()) {
    node.classList.add('in');
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          node.classList.add('in');
          io.unobserve(node);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  io.observe(node);
  return { destroy: () => io.disconnect() };
}

/**
 * Make the hero spotlight follow the pointer.
 * @type {import('svelte/action').Action<HTMLElement>}
 */
export function spotlight(node) {
  if (reduced()) return;
  /** @param {PointerEvent} e */
  const move = (e) => {
    const r = node.getBoundingClientRect();
    node.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
    node.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
  };
  node.addEventListener('pointermove', move);
  return { destroy: () => node.removeEventListener('pointermove', move) };
}
