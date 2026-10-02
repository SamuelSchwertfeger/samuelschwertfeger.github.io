/** Toggle between the light and dark theme and remember the choice. */
export function toggleTheme() {
  const root = document.documentElement;
  const t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', t);
  try {
    localStorage.setItem('theme', t);
  } catch (e) {
    /* storage unavailable */
  }
  return t;
}
