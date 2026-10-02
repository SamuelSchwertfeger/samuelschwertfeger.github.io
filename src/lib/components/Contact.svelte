<script>
  import { reveal } from '$lib/actions.js';
  import { site } from '$lib/site.js';

  const original = 'Copy email';
  let label = $state(original);

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(site.email);
      label = 'Copied';
      setTimeout(() => (label = original), 1600);
    } catch (e) {
      label = site.email;
    }
  }
</script>

<section id="contact" class="wrap section">
  <div class="contact reveal" use:reveal>
    <div>
      <p class="kicker">05 · Contact</p>
      <h2>Let's talk research</h2>
      <p class="muted">I'm happy to discuss collaboration, Linux security, or questions about this work.</p>
    </div>
    <div class="contact-actions">
      <a class="btn" href="mailto:{site.email}">{site.email}</a>
      <button type="button" class="btn btn-ghost copy" data-copy={site.email} onclick={copy}>{label}</button>
    </div>
  </div>
</section>
