(function () {
  'use strict';

  var promptSeenKey = 'child-advocacy-visitor-prompt-seen-v4';

  function initVisitorSubmission() {
    var launch = document.querySelector('[data-visitor-launch]');
    var dialog = document.querySelector('[data-visitor-submit-dialog]');
    var gsap = window.gsap;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var locale = document.documentElement.lang;

    if (['zh-Hant', 'zh-Hans', 'en', 'ja'].indexOf(locale) < 0) locale = 'zh-Hant';
    var officialWall = 'https://jerryzuhow77.github.io/child-advocacy-site/global-protection-wall/?section=guest-message';
    if (locale !== 'zh-Hant') officialWall += '&lang=' + encodeURIComponent(locale);
    document.querySelectorAll('[data-visitor-wall-link]').forEach(function (link) {
      link.href = officialWall;
    });

    if (launch && gsap && !reduceMotion) {
      gsap.set(launch, { autoAlpha: 0, display: 'none' });
    } else if (launch) {
      launch.hidden = true;
    }

    if (!dialog) return;

    var stage = dialog.querySelector('.visitor-submit-dialog-stage');
    var card = dialog.querySelector('.visitor-submit-dialog-card');
    var primary = dialog.querySelector('.visitor-submit-dialog-primary');
    var directToForm = window.location.hash === '#guest-message';
    var forcePrompt = new URLSearchParams(window.location.search).get('showVisitorPrompt') === '1';
    var shownBefore = false;
    var closing = false;
    var previousOverflow = '';

    try { shownBefore = window.localStorage.getItem(promptSeenKey) === '1'; } catch (error) { /* Keep the first-visit reminder available without storage. */ }
    if (!forcePrompt || directToForm || shownBefore) return;

    function rememberPrompt() {
      if (forcePrompt) return;
      try { window.localStorage.setItem(promptSeenKey, '1'); } catch (error) { /* The reminder still works without storage. */ }
    }

    function finishClose() {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
      document.body.style.overflow = previousOverflow;
      closing = false;
    }

    function closePrompt() {
      if (closing || !dialog.hasAttribute('open')) return;
      closing = true;
      rememberPrompt();
      if (!gsap || reduceMotion || !stage || !card) {
        finishClose();
        return;
      }
      gsap.timeline({ onComplete: finishClose })
        .to(card, { autoAlpha: 0, y: 18, scale: 0.975, duration: 0.22, ease: 'power2.in' })
        .to(stage, { autoAlpha: 0, duration: 0.18, ease: 'power1.out' }, '-=0.1');
    }

    dialog.querySelectorAll('[data-visitor-prompt-close]').forEach(function (button) {
      button.addEventListener('click', closePrompt);
    });
    dialog.addEventListener('cancel', function (event) {
      event.preventDefault();
      closePrompt();
    });
    if (stage) stage.addEventListener('mousedown', function (event) {
      if (event.target === stage) closePrompt();
    });
    if (primary) primary.addEventListener('click', rememberPrompt);

    window.setTimeout(function () {
      if (document.querySelector('dialog[open], [aria-modal="true"]')) return;
      rememberPrompt();
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');

      if (!gsap || reduceMotion || !stage || !card) {
        if (primary) primary.focus();
        return;
      }

      var accents = card.querySelectorAll('.visitor-submit-dialog-accent i');
      var copy = card.querySelectorAll('.visitor-submit-dialog-copy > *, .visitor-submit-dialog-actions > *');
      gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: function () { if (primary) primary.focus(); } })
        .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
        .fromTo(card, { autoAlpha: 0, y: 28, scale: 0.965 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.52 }, '-=0.12')
        .fromTo(accents, { autoAlpha: 0, y: 10, scale: 0.84 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, stagger: 0.055 }, '-=0.28')
        .fromTo(copy, { autoAlpha: 0, y: 9 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.04 }, '-=0.22');
    }, 780);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVisitorSubmission, { once: true });
  else initVisitorSubmission();
}());
