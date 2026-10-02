<script>
  import { site } from '$lib/site.js';

  /** @type {{ title?: string, description?: string, path?: string, noindex?: boolean }} */
  let { title = '', description = site.description, path = '/', noindex = false } = $props();

  const home = $derived(path === '/');
  const fullTitle = $derived(home ? `${site.title} | ${site.tagline}` : `${title} | ${site.title}`);
  const ogTitle = $derived(home ? site.title : title);
  const url = $derived(site.url + path);
  const image = site.url + site.image;
  const ld = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': home ? 'WebSite' : 'WebPage',
      description,
      headline: ogTitle,
      image,
      name: site.title,
      url
    }).replace(/</g, '\\u003c')
  );
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  {#if noindex}
    <meta name="robots" content="noindex" />
  {:else}
    <link rel="canonical" href={url} />
    <meta property="og:url" content={url} />
  {/if}
  <meta property="og:title" content={ogTitle} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:description" content={description} />
  <meta property="og:site_name" content={site.title} />
  <meta property="og:image" content={image} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:image" content={image} />
  <meta property="twitter:title" content={ogTitle} />
  {@html `<script type="application/ld+json">${ld}</script>`}
</svelte:head>
