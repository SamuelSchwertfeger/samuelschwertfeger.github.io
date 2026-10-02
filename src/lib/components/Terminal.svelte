<script>
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { toggleTheme } from '$lib/theme.js';
  import { site } from '$lib/site.js';

  /**
   * @typedef {{ t?: string, b?: string, pr?: string, href?: string }} Seg
   * @typedef {{ id: number, cls?: string, segs: Seg[] }} Line
   */

  /** @type {{ title: string }} */
  let { title } = $props();

  let nextId = 0;
  /**
   * @param {string | undefined} cls
   * @param {Seg[]} segs
   * @returns {Line}
   */
  const mk = (cls, segs) => ({ id: nextId++, cls, segs });

  /** @type {Line[]} */
  let lines = $state([
    mk(undefined, [{ pr: '$' }, { t: ' whoami' }]),
    mk('o', [{ t: 'Samuel Schwertfeger, Ph.D. student in Computer & Cyber Sciences' }]),
    mk(undefined, [{ pr: '$' }, { t: ' cat research.txt' }]),
    mk('o', [{ t: 'Machine-aware local LLMs for Linux persistence detection' }]),
    mk('o hint', [{ t: 'Type ' }, { b: 'help' }, { t: ' to explore.' }])
  ]);

  /** @type {HTMLElement | undefined} */
  let out = $state();
  /** @type {HTMLInputElement | undefined} */
  let input = $state();
  /** @type {string[]} */
  const history = [];
  let hi = 0;

  /**
   * @param {string} text
   * @param {string} [cls]
   */
  const say = (text, cls = 'o') => lines.push(mk(cls, [{ t: text }]));
  /** @param {string} id */
  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  /** @type {Record<string, () => void>} */
  const cmds = {
    help: () => say('commands: whoami  research  play  path  projects  cv  contact  github  theme  clear'),
    whoami: () =>
      say(
        'Samuel Schwertfeger. First-year Ph.D. student in Computer & Cyber Sciences at Augusta University, and Cyber officer in the U.S. Army National Guard.'
      ),
    research: () => {
      say(title);
      say('→ scrolling to Research');
      go('research');
    },
    play: () => {
      say('→ opening "You make the call"');
      go('explore');
    },
    path: () => {
      say('→ scrolling to Path');
      go('path');
    },
    projects: () => {
      say('→ scrolling to Projects');
      go('projects');
    },
    cv: () => {
      say('→ opening CV');
      setTimeout(() => goto('/cv/'), 350);
    },
    contact: () => lines.push(mk('o', [{ href: 'mailto:' + site.email, t: site.email }])),
    email: () => cmds.contact(),
    github: () =>
      lines.push(mk('o', [{ href: 'https://github.com/' + site.github, t: 'github.com/' + site.github }])),
    theme: () => say('theme: ' + toggleTheme()),
    ls: () => say('research/  path/  projects/  cv.txt  contact.txt'),
    clear: () => {
      lines.length = 0;
    },
    sudo: () => say('Permission denied. This incident will be reported.')
  };

  /** @param {SubmitEvent} e */
  async function submit(e) {
    e.preventDefault();
    if (!input) return;
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;
    history.push(raw);
    hi = history.length;
    lines.push(mk(undefined, [{ pr: '$' }, { t: raw }]));
    const words = raw.split(/\s+/);
    let name = words[0].toLowerCase();
    if (name === 'cat' || name === 'cd') name = (words[1] || '').replace(/[/.].*$/, '').toLowerCase() || name;
    if (Object.prototype.hasOwnProperty.call(cmds, name)) cmds[name]();
    else say('command not found: ' + words[0] + '. Type help.');
    await tick();
    if (out) out.scrollTop = out.scrollHeight;
  }

  /** @param {KeyboardEvent} e */
  function keydown(e) {
    if (!input) return;
    if (e.key === 'ArrowUp' && hi > 0) {
      hi--;
      input.value = history[hi];
      e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
      hi = Math.min(history.length, hi + 1);
      input.value = history[hi] || '';
      e.preventDefault();
    }
    if (e.key === 'Tab' && input.value) {
      const m = Object.keys(cmds).filter((k) => k.indexOf(/** @type {HTMLInputElement} */ (input).value) === 0);
      if (m.length === 1) {
        input.value = m[0];
        e.preventDefault();
      }
    }
  }
</script>

<div class="term" aria-label="Interactive terminal">
  <div class="term-bar" aria-hidden="true"><span></span><span></span><span></span><em>samuel@augusta: ~</em></div>
  <div class="term-body" id="term-out" aria-live="polite" bind:this={out}>
    {#each lines as l (l.id)}
      <p class={l.cls}>{#each l.segs as s}{#if s.href}<a href={s.href}>{s.t}</a>{:else if s.pr}<span class="pr">{s.pr}</span>{:else if s.b}<b>{s.b}</b>{:else}{s.t}{/if}{/each}</p>
    {/each}
  </div>
  <form class="term-in" id="term-form" autocomplete="off" onsubmit={submit}>
    <label for="term-cmd" class="pr">$</label>
    <input id="term-cmd" type="text" spellcheck="false" aria-label="Terminal command, type help" placeholder="help" bind:this={input} onkeydown={keydown}>
  </form>
</div>
