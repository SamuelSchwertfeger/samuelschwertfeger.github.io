<script>
  import Seo from '$lib/components/Seo.svelte';
  import { site } from '$lib/site.js';
</script>

<Seo title="Page not found" path="/404" noindex />

<section class="wrap page e404">
  <header class="page-head">
    <p class="kicker">Error 404</p>
    <h1>Page not found</h1>
  </header>
  <div class="code"><span class="code-path">~</span><code>$ cd requested-page
cd: no such file or directory</code></div>
  <p class="muted">The page you are looking for does not exist or has moved.</p>
  <p class="buttons">
    <a class="btn btn-line" href="/">← Back to home</a>
    <a class="btn btn-line" href="/cv/">CV</a>
    <a class="btn btn-line" href="mailto:{site.email}">Email</a>
  </p>
</section>
