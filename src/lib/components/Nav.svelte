<script>
  import { page } from '$app/state';
  import { toggleTheme } from '$lib/theme.js';

  const home = $derived(page.url.pathname === '/');
  const cvPage = $derived(page.url.pathname === '/cv/');
  let active = $state('');

  // Highlight the nav link of the section currently in view (home page only).
  $effect(() => {
    if (!home || !('IntersectionObserver' in window)) {
      active = '';
      return;
    }
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) active = e.target.id;
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    for (const id of ['research', 'path', 'projects', 'contact']) {
      const s = document.getElementById(id);
      if (s) spy.observe(s);
    }
    return () => spy.disconnect();
  });
</script>

<header class="nav">
  <div class="wrap nav-inner">
    <a class="brand" href="/">
      <span class="mark" aria-hidden="true">SS</span><span class="brand-name">Samuel Schwertfeger</span>
    </a>
    <nav aria-label="Main">
      <a href={home ? '#research' : '/#research'} class:active={active === 'research'}>Research</a>
      <a href={home ? '#path' : '/#path'} class:active={active === 'path'}>Path</a>
      <a href={home ? '#projects' : '/#projects'} class:active={active === 'projects'}>Projects</a>
      <a href="/cv/" aria-current={cvPage ? 'page' : undefined}>CV</a>
      <a href={home ? '#contact' : '/#contact'} class:active={active === 'contact'}>Contact</a>
      <button class="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme" onclick={toggleTheme}>
        <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>
        <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>
      </button>
    </nav>
  </div>
</header>
