(function () {
  'use strict';
  var root = document.documentElement;
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* Theme toggle */
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  $$('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  /* Scroll reveal */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Active section in nav */
  var navLinks = $$('.nav nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = byId[e.target.id];
        if (a && e.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* Hero spotlight follows the pointer */
  var hero = $('.hero');
  if (hero && !reduceMotion) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  /* Copy email */
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var label = b.textContent;
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = label; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.getAttribute('data-copy')).then(done, function () {});
    });
  });

  var dataEl = $('#site-data');
  var site = dataEl ? JSON.parse(dataEl.textContent) : {};

  /* Terminal */
  var out = $('#term-out'), form = $('#term-form'), input = $('#term-cmd');
  if (out && form) {
    var history = [], hi = 0;
    var line = function (html, cls) {
      var p = document.createElement('p');
      if (cls) p.className = cls;
      p.innerHTML = html;
      out.appendChild(p);
    };
    var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var go = function (id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); };
    var cmds = {
      help: function () { line('commands: whoami  research  play  path  projects  cv  contact  github  theme  clear', 'o'); },
      whoami: function () { line('Samuel Schwertfeger. First-year Ph.D. student in Computer &amp; Cyber Sciences at Augusta University, and U.S. Army Cyber officer.', 'o'); },
      research: function () { line(esc(site.title || ''), 'o'); line('→ scrolling to Research', 'o'); go('research'); },
      play: function () { line('→ opening "You make the call"', 'o'); go('explore'); },
      path: function () { line('→ scrolling to Path', 'o'); go('path'); },
      projects: function () { line('→ scrolling to Projects', 'o'); go('projects'); },
      cv: function () { line('→ opening CV', 'o'); setTimeout(function () { location.href = site.cv; }, 350); },
      contact: function () { line('<a href="mailto:' + esc(site.email) + '">' + esc(site.email) + '</a>', 'o'); },
      email: function () { cmds.contact(); },
      github: function () { line('<a href="https://github.com/' + esc(site.github) + '">github.com/' + esc(site.github) + '</a>', 'o'); },
      theme: function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); line('theme: ' + root.getAttribute('data-theme'), 'o'); },
      ls: function () { line('research/  path/  projects/  cv.txt  contact.txt', 'o'); },
      clear: function () { out.innerHTML = ''; },
      sudo: function () { line('Permission denied. This incident will be reported.', 'o'); }
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = input.value.trim();
      input.value = '';
      if (!raw) return;
      history.push(raw); hi = history.length;
      line('<span class="pr">$</span>' + esc(raw));
      var name = raw.split(/\s+/)[0].toLowerCase();
      if (name === 'cat' || name === 'cd') name = (raw.split(/\s+/)[1] || '').replace(/[\/.].*$/, '').toLowerCase() || name;
      (cmds[name] || function () { line('command not found: ' + esc(raw.split(/\s+/)[0]) + '. Type help.', 'o'); })();
      out.scrollTop = out.scrollHeight;
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp' && hi > 0) { hi--; input.value = history[hi]; e.preventDefault(); }
      if (e.key === 'ArrowDown') { hi = Math.min(history.length, hi + 1); input.value = history[hi] || ''; e.preventDefault(); }
      if (e.key === 'Tab' && input.value) {
        var m = Object.keys(cmds).filter(function (k) { return k.indexOf(input.value) === 0; });
        if (m.length === 1) { input.value = m[0]; e.preventDefault(); }
      }
    });
  }

  /* "You make the call" explorer */
  var ex = $('#explorer');
  if (ex) {
    var tabs = $$('[role="tab"]', ex), panels = $$('[role="tabpanel"]', ex);
    var fig = $('#pipe-fig'), scoreEl = $('#ex-score');
    var right = 0, total = 0;

    // Randomize which case of each mechanism appears first, so the answer is not always "user".
    panels.forEach(function (p) {
      var cases = $$('.case', p);
      if (Math.random() < 0.5) p.appendChild(cases[0]);
      $('.case', p).classList.add('active');
    });

    var select = function (i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (fig) fig.removeAttribute('data-verdict');
    };
    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') select((i + 1) % tabs.length, true);
        if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length, true);
      });
    });

    $$('.case', ex).forEach(function (c) {
      $$('.choice', c).forEach(function (b) {
        b.addEventListener('click', function () {
          if (c.classList.contains('done')) return;
          var ok = b.getAttribute('data-pick') === c.getAttribute('data-kind');
          total++; if (ok) right++;
          c.classList.add('done');
          b.classList.add('picked');
          $$('.choice', c).forEach(function (x) { x.disabled = true; });
          $('.v-result', c).textContent = ok ? 'Correct' : 'Not quite';
          if (fig) fig.setAttribute('data-verdict', c.getAttribute('data-kind'));
          scoreEl.textContent = 'Score ' + right + ' / ' + total;
          $('.next', c).focus({ preventScroll: true });
        });
      });
      $('.next', c).addEventListener('click', function () {
        var panel = c.parentNode, pi = panels.indexOf(panel);
        var sib = $$('.case', panel).filter(function (x) { return x !== c; })[0];
        c.classList.remove('active');
        if (sib && !sib.classList.contains('done')) {
          sib.classList.add('active');
          if (fig) fig.removeAttribute('data-verdict');
          $('.choice', sib).focus({ preventScroll: true });
        } else {
          // Move to the next mechanism; reset it if it was already played.
          var ni = (pi + 1) % panels.length, np = panels[ni];
          var first = $('.case:not(.done)', np) || $('.case', np);
          $$('.case', np).forEach(function (x) { x.classList.remove('active'); });
          if (first.classList.contains('done')) $$('.case', np).forEach(function (x) {
            x.classList.remove('done');
            $$('.choice', x).forEach(function (b) { b.disabled = false; b.classList.remove('picked'); });
          });
          first.classList.add('active');
          // Keep the finished case visible in its own panel for when the user returns.
          if (!$('.case.active', panel)) c.classList.add('active');
          select(ni, true);
        }
      });
    });
  }
})();
