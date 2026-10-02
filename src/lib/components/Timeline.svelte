<script>
  import { reveal } from '$lib/actions.js';

  /** @type {{ items: { year: string | number, title: string, org: string, text: string, now?: boolean }[] }} */
  let { items } = $props();
</script>

<ol class="timeline">
  {#each items as p}
    <li class="reveal{p.now ? ' now' : ''}" use:reveal>
      <span class="t-year">{p.year}{p.now ? ' · now' : ''}</span>
      <h3>{p.title}</h3>
      <p class="t-org">{p.org}</p>
      <p>{p.text}</p>
    </li>
  {/each}
</ol>
