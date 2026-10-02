<script>
  import Seo from '$lib/components/Seo.svelte';
  import Terminal from '$lib/components/Terminal.svelte';
  import Pipeline from '$lib/components/Pipeline.svelte';
  import Explorer from '$lib/components/Explorer.svelte';
  import Timeline from '$lib/components/Timeline.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import { reveal, spotlight } from '$lib/actions.js';
  import { site } from '$lib/site.js';

  let { data } = $props();
  const r = $derived(data.research);

  /** @type {string | null} */
  let verdict = $state(null);
</script>

<Seo path="/" />

<section class="hero" id="top" use:spotlight>
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <div class="hero-text">
      <div class="hero-id">
        <img class="avatar" src={site.avatar} alt="Portrait of Samuel Schwertfeger" width="88" height="88">
        <p class="eyebrow"><span class="dot" aria-hidden="true"></span>First-year Ph.D. student · Augusta University</p>
      </div>
      <h1>Samuel Schwertfeger</h1>
      <p class="lead">I study how local language models can tell a machine owner's everyday changes apart from an attacker's persistence on Linux. I also serve as a Cyber officer in the U.S. Army National Guard.</p>
      <p class="buttons">
        <a class="btn" href="#research">See my research</a>
        <a class="btn btn-ghost" href="/cv/">CV</a>
        <a class="btn btn-ghost" href="mailto:{site.email}">Email</a>
        <a class="btn btn-ghost" href="https://github.com/{site.github}">GitHub</a>
      </p>
    </div>

    <Terminal title={r.title} />
  </div>
</section>

<section class="wrap glance reveal" aria-label="At a glance" use:reveal>
  <div class="g"><p class="g-k">Now</p><p class="g-v">Ph.D. student</p><p class="g-s">Augusta University, 2026 –</p></div>
  <div class="g"><p class="g-k">Focus</p><p class="g-v">Linux persistence</p><p class="g-s">Local LLMs for host intrusion detection</p></div>
  <div class="g"><p class="g-k">Service</p><p class="g-v">Army Cyber officer</p><p class="g-s">U.S. Army National Guard</p></div>
  <div class="g"><p class="g-k">B.S.</p><p class="g-v">Magna cum laude</p><p class="g-s">Information Technology, Georgia Southern</p></div>
</section>

<section id="research" class="wrap section">
  <header class="sec-head reveal" use:reveal>
    <p class="kicker">01 · Research</p>
    <h2>{r.title}</h2>
  </header>
  <p class="prose reveal" use:reveal>{r.summary}</p>
  <figure class="figure reveal" id="pipe-fig" data-verdict={verdict} use:reveal>
    <Pipeline />
    <figcaption>Proposed approach</figcaption>
  </figure>
  <p class="tags reveal" use:reveal>{#each r.interests as i}<span>{i}</span>{/each}</p>
</section>

<section id="explore" class="wrap section">
  <header class="sec-head reveal" use:reveal>
    <p class="kicker">02 · You make the call</p>
    <h2>User change or attacker persistence?</h2>
    <p class="muted">Both look like ordinary configuration changes. Make your call, then see what the machine's history says.</p>
  </header>

  <Explorer examples={r.examples} bind:verdict />
</section>

<section id="path" class="wrap section">
  <header class="sec-head reveal" use:reveal>
    <p class="kicker">03 · Path</p>
    <h2>How I got here</h2>
  </header>
  <Timeline items={data.cv.path} />
</section>

{#if data.publications.length > 0}
  <section id="publications" class="wrap section">
    <header class="sec-head reveal" use:reveal>
      <p class="kicker">Publications</p>
      <h2>Publications</h2>
    </header>
    <ul class="pubs">
      {#each data.publications as p}
        <li class="reveal" use:reveal>
          <strong>{#if p.url}<a href={p.url}>{p.title}</a>{:else}{p.title}{/if}</strong><br>
          <span class="muted">{p.authors} · <em>{p.venue}</em>, {p.year}</span>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<section id="projects" class="wrap section">
  <header class="sec-head reveal" use:reveal>
    <p class="kicker">04 · Projects</p>
    <h2>Projects</h2>
  </header>
  <div class="cards">
    {#each data.projects as p}
      <article class="card reveal" use:reveal>
        <p class="card-year">{p.year}</p>
        <h3>{#if p.url}<a class="stretch" href={p.url}>{p.name}</a>{:else}{p.name}{/if}</h3>
        <p>{p.summary}</p>
        <p class="tags">{#each p.tags as t}<span>{t}</span>{/each}</p>
        {#if p.url}<p class="more" aria-hidden="true">View on GitHub <span>→</span></p>{/if}
      </article>
    {/each}
  </div>
</section>

<Contact />
