<script>
  import { onMount, tick } from 'svelte';
  import { reveal } from '$lib/actions.js';

  /**
   * @typedef {{ kind: string, path: string, line: string, context: string[], why: string }} Case
   * @typedef {{ mechanism: string, technique: string, cases: Case[] }} Example
   * @typedef {{ done: boolean, pick: string, result: string }} CaseState
   */

  /** @type {{ examples: Example[], verdict?: string | null }} */
  let { examples, verdict = $bindable(null) } = $props();

  let mounted = $state(false);
  let selected = $state(0);
  let right = $state(0);
  let total = $state(0);
  /** Case display order per panel (data order until mounted). @type {Record<number, number[]>} */
  let order = $state({});
  /** Active case index per panel. @type {Record<number, number>} */
  let active = $state({});
  /** Answer state per case, keyed "panel-case". @type {Record<string, CaseState>} */
  let cs = $state({});

  /** @type {HTMLElement[]} */
  const tabEls = [];
  /** @type {Record<string, HTMLElement | undefined>} */
  const refs = {};

  const scoreText = $derived(total ? `Score ${right} / ${total}` : '');

  /**
   * @param {number} pi
   * @param {number} ci
   */
  const key = (pi, ci) => `${pi}-${ci}`;
  /**
   * @param {number} pi
   * @param {number} ci
   * @returns {CaseState}
   */
  function get(pi, ci) {
    const k = key(pi, ci);
    cs[k] ??= { done: false, pick: '', result: '' };
    return cs[k];
  }
  /** @param {number} pi */
  const caseOrder = (pi) => order[pi] ?? examples[pi].cases.map((_, i) => i);

  /**
   * @param {number} i
   * @param {boolean} [focus]
   */
  async function select(i, focus = false) {
    selected = i;
    verdict = null;
    if (focus) {
      await tick();
      tabEls[i]?.focus();
    }
  }

  onMount(() => {
    // Randomize which case of each mechanism appears first, so the answer is not always "user".
    examples.forEach((e, pi) => {
      const o = e.cases.map((_, i) => i);
      if (Math.random() < 0.5) o.push(/** @type {number} */ (o.shift()));
      order[pi] = o;
      active[pi] = o[0];
    });
    mounted = true;
    select(0);
  });

  /** @param {KeyboardEvent} e @param {number} i */
  function tabKey(e, i) {
    const n = examples.length;
    if (e.key === 'ArrowRight') select((i + 1) % n, true);
    if (e.key === 'ArrowLeft') select((i - 1 + n) % n, true);
    if (e.key === 'Home') {
      e.preventDefault();
      select(0, true);
    }
    if (e.key === 'End') {
      e.preventDefault();
      select(n - 1, true);
    }
  }

  /**
   * @param {number} pi
   * @param {number} ci
   * @param {string} choice
   */
  async function pick(pi, ci, choice) {
    const s = get(pi, ci);
    if (s.done) return;
    const c = examples[pi].cases[ci];
    const ok = choice === c.kind;
    total++;
    if (ok) right++;
    s.done = true;
    s.pick = choice;
    s.result = ok ? 'Correct' : 'Not quite';
    verdict = c.kind;
    await tick();
    refs['n' + key(pi, ci)]?.focus({ preventScroll: true });
  }

  /**
   * @param {number} pi
   * @param {number} ci
   */
  async function next(pi, ci) {
    const sib = caseOrder(pi).find((x) => x !== ci);
    if (sib !== undefined && !get(pi, sib).done) {
      active[pi] = sib;
      verdict = null;
      await tick();
      refs['c' + key(pi, sib)]?.focus({ preventScroll: true });
    } else {
      // Move to the next mechanism; reset it if it was already played.
      // The finished case stays visible in its own panel for when the user returns.
      const ni = (pi + 1) % examples.length;
      const no = caseOrder(ni);
      const first = no.find((x) => !get(ni, x).done) ?? no[0];
      if (get(ni, first).done) {
        for (const x of no) {
          const s = get(ni, x);
          s.done = false;
          s.pick = '';
          s.result = '';
        }
      }
      active[ni] = first;
      select(ni, true);
    }
  }
</script>

<div class="explorer reveal" id="explorer" use:reveal>
  <div class="ex-tabs" role="tablist" aria-label="Persistence mechanism">
    {#each examples as e, i}
      <button
        role="tab"
        type="button"
        id="tab-{i + 1}"
        aria-controls="ex-{i + 1}"
        aria-selected={selected === i}
        tabindex={selected === i ? 0 : -1}
        bind:this={tabEls[i]}
        onclick={() => select(i)}
        onkeydown={(ev) => tabKey(ev, i)}>{e.mechanism}</button>
    {/each}
  </div>
  <p class="ex-score" id="ex-score" aria-live="polite">{scoreText}</p>

  {#each examples as e, pi}
    <div class="ex-panel" role="tabpanel" id="ex-{pi + 1}" aria-labelledby="tab-{pi + 1}" hidden={mounted && selected !== pi}>
      {#each caseOrder(pi) as ci (ci)}
        {@const c = e.cases[ci]}
        {@const s = cs[key(pi, ci)]}
        <article class="case" class:active={active[pi] === ci} class:done={s?.done} data-kind={c.kind}>
          <p class="case-label">A change appears on the host <a class="tech" href="https://attack.mitre.org/techniques/{e.technique.replaceAll('.', '/')}/">MITRE ATT&amp;CK {e.technique}</a></p>
          <div class="code"><span class="code-path">{c.path}</span><code>{c.line}</code></div>
          <div class="choices">
            <span class="choices-q">Who made it?</span>
            <button type="button" class="choice" class:picked={s?.pick === 'user'} disabled={s?.done} data-pick="user" bind:this={refs['c' + key(pi, ci)]} onclick={() => pick(pi, ci, 'user')}>User change</button>
            <button type="button" class="choice" class:picked={s?.pick === 'attacker'} disabled={s?.done} data-pick="attacker" onclick={() => pick(pi, ci, 'attacker')}>Attacker persistence</button>
          </div>
          <div class="answer">
            <p class="verdict {c.kind}"><span class="v-result">{s?.result ?? ''}</span>{c.kind === 'user' ? 'User change' : 'Attacker persistence'}</p>
            <p class="ctx-title">What the machine knows</p>
            <ul class="ctx">{#each c.context as x}<li>{x}</li>{/each}</ul>
            <p class="why">{c.why}</p>
            <button type="button" class="next" bind:this={refs['n' + key(pi, ci)]} onclick={() => next(pi, ci)}>Next example →</button>
          </div>
        </article>
      {/each}
    </div>
  {/each}
  <p class="fine">Illustrative examples of the problem, not output from a trained model.</p>
</div>
