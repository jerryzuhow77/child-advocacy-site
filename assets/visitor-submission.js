(function () {
  'use strict';

  var promptLastShownKey = 'child-advocacy-visitor-prompt-last-shown-v3';
  var promptIntervalMs = 8 * 60 * 60 * 1000;

  function wasPromptShownRecently(rawLastShownAt, now) {
    var lastShownAt = Number(rawLastShownAt);
    var elapsed = now - lastShownAt;
    return lastShownAt > 0 && elapsed >= 0 && elapsed < promptIntervalMs;
  }

  function initVisitorSubmission() {
    var launch = document.querySelector('[data-visitor-launch]');
    var dialog = document.querySelector('[data-visitor-submit-dialog]');
    var gsap = window.gsap;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var locale = document.documentElement.lang;

    if (['zh-Hant', 'zh-Hans', 'en', 'ja'].indexOf(locale) < 0) locale = 'zh-Hant';
    document.querySelectorAll('[data-visitor-wall-link]').forEach(function (link) {
      link.href = 'https://global-protection.jerryzuhow77.chatgpt.site/?lang=' + encodeURIComponent(locale) + '#guest-message';
    });

    if (launch && gsap && !reduceMotion) {
      gsap.fromTo(launch.querySelector('.home-visitor-launch-link'), {
        autoAlpha: 0,
        y: -22,
        scale: 0.985
      }, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.72,
        delay: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility'
      });
    }

    if (!dialog) return;

    var stage = dialog.querySelector('.visitor-submit-dialog-stage');
    var card = dialog.querySelector('.visitor-submit-dialog-card');
    var primary = dialog.querySelector('.visitor-submit-dialog-primary');
    var directToForm = window.location.hash === '#guest-message';
    var forcePrompt = new URLSearchParams(window.location.search).get('showVisitorPrompt') === '1';
    var shownWithinInterval = false;
    var closing = false;
    var previousOverflow = '';

    try {
      shownWithinInterval = wasPromptShownRecently(window.localStorage.getItem(promptLastShownKey), Date.now());
    } catch (error) { /* Keep the reminder available without storage. */ }
    if ((directToForm || shownWithinInterval) && !forcePrompt) return;

    function finishClose() {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
      document.body.style.overflow = previousOverflow;
      closing = false;
    }

    function closePrompt() {
      if (closing || !dialog.hasAttribute('open')) return;
      closing = true;
      if (!gsap || reduceMotion || !stage || !card) {
        finishClose();
        return;
      }
      gsap.timeline({ onComplete: finishClose })
        .to(card, { autoAlpha: 0, y: 24, scale: 0.96, duration: 0.25, ease: 'power2.in' })
        .to(stage, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, '-=0.12');
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

    window.setTimeout(function () {
      if (!forcePrompt) {
        try { window.localStorage.setItem(promptLastShownKey, String(Date.now())); } catch (error) { /* The reminder still opens without storage. */ }
      }
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
      gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: function () { if (primary) primary.focus(); } })
        .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.36 })
        .fromTo(card, { autoAlpha: 0, y: 46, scale: 0.92, rotate: -1.2 }, { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.72, ease: 'back.out(1.25)' }, '-=0.19')
        .fromTo(accents, { autoAlpha: 0, y: 18, scale: 0.7, rotate: -12 }, { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.48, stagger: 0.08, ease: 'back.out(1.7)' }, '-=0.43')
        .fromTo(copy, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.055 }, '-=0.34');
    }, 680);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVisitorSubmission, { once: true });
  else initVisitorSubmission();
}());
