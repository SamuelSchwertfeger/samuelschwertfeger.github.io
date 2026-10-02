<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { data, children } = $props();

  onMount(() => {
    document.documentElement.classList.add('js');
  });
</script>

<a class="skip" href="#main">Skip to content</a>
<Nav />

<main id="main">
  {@render children()}
</main>

<Footer updated={data.updated} />
