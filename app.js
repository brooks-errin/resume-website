/* app.js — interactivity: menu, accordion, counters, scroll spy, reveals */

(function () {
  'use strict';

  /* Mobile menu */
  var menuToggle = document.getElementById('menuToggle');
  var siteNav = document.getElementById('siteNav');
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function () {
      var open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      siteNav.classList.toggle('is-open', !open);
    });
    siteNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Timeline accordion — one open at a time */
  var heads = document.querySelectorAll('.timeline-head');
  heads.forEach(function (head) {
    head.addEventListener('click', function () {
      var expanded = head.getAttribute('aria-expanded') === 'true';
      heads.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        var panel = document.getElementById(other.getAttribute('aria-controls'));
        if (panel) panel.hidden = true;
      });
      if (!expanded) {
        head.setAttribute('aria-expanded', 'true');
        var panel = document.getElementById(head.getAttribute('aria-controls'));
        if (panel) panel.hidden = false;
      }
    });
  });

  /* Scoreboard counters */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var pad = parseInt(el.getAttribute('data-pad'), 10) || 0;
    var duration = 1200;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(eased * target);
      el.textContent = String(val).padStart(pad, '0');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var stats = document.querySelectorAll('.stat-value');
  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(function (s) { statObserver.observe(s); });
  }

  /* Scroll spy for nav */
  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ link: link, section: section });
  });

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
          var match = sections.find(function (s) { return s.section === entry.target; });
          if (match) match.link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s.section); });
  }

  /* Reveal on scroll */
  var revealTargets = document.querySelectorAll(
    '.work-card, .lead-card, .pillar, .story-body, .timeline-item'
  );
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (t) { t.classList.add('reveal'); });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (t) { revealObserver.observe(t); });
  }
})();
