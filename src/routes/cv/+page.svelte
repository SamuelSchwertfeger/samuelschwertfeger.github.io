<script>
  import Seo from '$lib/components/Seo.svelte';
  import { site } from '$lib/site.js';

  let { data } = $props();
  const cv = $derived(data.cv);
</script>

<Seo
  title="CV"
  path="/cv/"
  description="Curriculum vitae of Samuel Schwertfeger, Ph.D. student in Computer and Cyber Sciences at Augusta University."
/>

<section class="wrap page">
  <header class="page-head">
    <p class="kicker">Curriculum Vitae</p>
    <h1>Samuel Schwertfeger</h1>
    <p class="muted">Ph.D. Student · Computer &amp; Cyber Sciences · Augusta University · <a href="mailto:{site.email}">{site.email}</a></p>
    <p class="print"><button type="button" class="btn btn-line" onclick={() => window.print()}>Print or save as PDF</button></p>
  </header>

  <h2>Education</h2>
  <ul class="cv">
    {#each cv.education as e}
      <li><div><strong>{e.degree}</strong><br><span class="muted">{e.school}{e.note ? ' · ' + e.note : ''}</span></div><span class="year">{e.years}</span></li>
    {/each}
  </ul>

  <h2>Research</h2>
  <p><strong>{data.research.title}</strong></p>
  <p class="tags">{#each data.research.interests as i}<span>{i}</span>{/each}</p>

  <h2>Experience</h2>
  <ul class="cv">
    {#each cv.experience as e}
      <li><div><strong>{e.role}</strong><br><span class="muted">{e.org}</span>{#if e.note}<br>{e.note}{/if}</div><span class="year">{e.years}</span></li>
    {/each}
  </ul>

  {#if data.publications.length > 0}
    <h2>Publications</h2>
    <ul class="cv">
      {#each data.publications as p}
        <li><div><strong>{p.title}</strong><br><span class="muted">{p.authors} · <em>{p.venue}</em></span></div><span class="year">{p.year}</span></li>
      {/each}
    </ul>
  {/if}

  <h2>Honors and Awards</h2>
  <ul class="cv">
    {#each cv.honors as h}
      <li><div><strong>{h.name}</strong><br><span class="muted">{h.org}</span></div><span class="year">{h.years}</span></li>
    {/each}
  </ul>

  <h2>Conferences Attended</h2>
  <ul class="cv">
    {#each cv.conferences as c}
      <li><div>{c.name}</div><span class="year">{c.years}</span></li>
    {/each}
  </ul>

  <h2>Skills</h2>
  <ul class="cv">
    {#each cv.skills as s}
      <li><div><strong>{s.area}</strong><br><span class="muted">{s.items}</span></div></li>
    {/each}
  </ul>
</section>
