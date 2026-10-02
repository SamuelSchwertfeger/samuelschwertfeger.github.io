<script>
  import { site } from '$lib/site.js';

  /** @type {{ updated: string }} */
  let { updated } = $props();
</script>

<footer>
  <div class="wrap footer-inner">
    <div>
      <p class="footer-name">Samuel Schwertfeger</p>
      <p class="muted small">Ph.D. Student · Computer &amp; Cyber Sciences · Augusta University</p>
    </div>
    <p class="footer-links">
      <a href="mailto:{site.email}">Email</a>
      <a href="https://github.com/{site.github}">GitHub</a>
      <a href="/cv/">CV</a>
    </p>
  </div>
  <div class="wrap footer-meta">
    <p class="muted small">Views expressed here are my own and do not represent the U.S. Army or the Department of Defense.</p>
    <p class="muted small">Last updated {updated}</p>
  </div>
</footer>
