#!/usr/bin/env python3
"""One-off repair for Fujian Qiqi mobile theatre controls and Act V copy."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_PATH = ROOT / "assets/fujian-qiqi-feature.css"
JS_PATH = ROOT / "assets/fujian-qiqi-feature.js"

CSS_MARKER = "/* === External mobile theatre controls and ready copy · 2026-08-21 === */"
JS_MARKER = "/* External mobile theatre controls · 2026-08-21 */"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)


def patch_js(js: str) -> str:
    if JS_MARKER in js and "version: '1.3.4'" in js:
        return js

    js = replace_once(
        js,
        "line.classList.remove('is-current', 'is-spoken');",
        "line.classList.remove('is-current', 'is-spoken', 'is-ready-preview');",
        "clear ready preview class",
    )
    js = replace_once(
        js,
        "line.classList.remove('is-spoken');\n      line.classList.add('is-current');",
        "line.classList.remove('is-spoken', 'is-ready-preview');\n      line.classList.add('is-current');",
        "activate line preview cleanup",
    )
    js = replace_once(
        js,
        """      setProgress(state, 0);
      setStatus(state, format(copy.ready, { act: sceneAct(state) }));

      if (!gsapEngine) return;
""",
        """      setProgress(state, 0);
      setStatus(state, format(copy.ready, { act: sceneAct(state) }));

      /* Keep one real line readable before autoplay begins. This is especially
         important for the final act, whose tall section may not immediately
         cross a mobile IntersectionObserver threshold. */
      const readyLine = !reducedMotion && state.lines.length ? state.lines[0] : null;
      if (readyLine) {
        readyLine.classList.remove('is-spoken');
        readyLine.classList.add('is-current', 'is-ready-preview');
        readyLine.setAttribute('aria-hidden', 'false');
        state.activeLine = readyLine;
        state.activeLineIndex = 0;
        if (gsapEngine) gsapEngine.set(readyLine, { autoAlpha: 1, y: 0, scale: 1 });
      }

      if (!gsapEngine) return;
""",
        "ready line fallback",
    )
    js = replace_once(
        js,
        """      state.lines.forEach((line, index) => {
        const hold = holds[index];
        const entrance = cursor;
        timeline.call(() => activateLine(state, line, index), null, entrance);
        timeline.fromTo(line, {
          autoAlpha: 0,
          y: 14,
          scale: 0.992
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.43,
          ease: 'power2.out'
        }, entrance + 0.06);
""",
        """      state.lines.forEach((line, index) => {
        const hold = holds[index];
        const entrance = cursor;
        const readyPreview = index === 0 && line.classList.contains('is-ready-preview');
        timeline.call(() => activateLine(state, line, index), null, entrance);
        timeline.fromTo(line, {
          autoAlpha: readyPreview ? 1 : 0,
          y: readyPreview ? 0 : 14,
          scale: readyPreview ? 1 : 0.992
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.43,
          ease: 'power2.out',
          immediateRender: false
        }, entrance + 0.06);
""",
        "ready preview timeline",
    )
    js = replace_once(
        js,
        """            && entry.intersectionRatio >= (compactQuery.matches ? 0.36 : 0.44)
""",
        """            && entry.intersectionRatio >= (compactQuery.matches
              ? (sceneAct(state) === '5' ? 0.18 : 0.24)
              : 0.44)
""",
        "mobile autoplay threshold",
    )
    js = replace_once(
        js,
        "threshold: [0, 0.14, 0.36, 0.44, 0.62],",
        "threshold: [0, 0.08, 0.14, 0.18, 0.24, 0.36, 0.44, 0.62],",
        "observer threshold list",
    )
    js = replace_once(js, "version: '1.3.3',", "version: '1.3.4',", "feature version")

    js_patch = r'''
/* External mobile theatre controls · 2026-08-21 */
(() => {
  'use strict';

  const ready = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const media = matchMedia('(max-width: 780px)');
    const language = (document.documentElement.lang || 'zh-Hant').toLowerCase();
    const groupLabel = language.startsWith('en')
      ? 'Act animation controls'
      : language.startsWith('ja')
        ? '幕のアニメーション操作'
        : language === 'zh-hans'
          ? '本折动画控制'
          : '本折動畫控制';

    const records = [...document.querySelectorAll('.fq-act[data-fq-scene], [data-fq-scene]')]
      .filter((scene, index, list) => list.indexOf(scene) === index)
      .map(scene => {
        const stage = scene.querySelector('.fq-stage, [data-fq-stage]');
        const controls = scene.querySelector('.fq-scene-controls, [data-scene-controls]');
        if (!stage || !controls || !controls.parentNode) return null;
        const marker = document.createComment('fq-scene-controls-home');
        controls.parentNode.insertBefore(marker, controls);
        controls.setAttribute('role', 'group');
        if (!controls.getAttribute('aria-label')) controls.setAttribute('aria-label', groupLabel);
        return { scene, stage, controls, marker };
      })
      .filter(Boolean);

    if (!records.length) return;

    const placeControls = () => {
      records.forEach(({ scene, stage, controls, marker }) => {
        if (media.matches) {
          if (!controls.classList.contains('fq-scene-controls--external')) {
            stage.insertAdjacentElement('afterend', controls);
            controls.classList.add('fq-scene-controls--external');
            scene.classList.add('has-external-controls');
          }
        } else {
          if (controls.classList.contains('fq-scene-controls--external') && marker.parentNode) {
            marker.parentNode.insertBefore(controls, marker.nextSibling);
          }
          controls.classList.remove('fq-scene-controls--external');
          scene.classList.remove('has-external-controls');
        }
      });
      if (window.FujianQiqiFeature && typeof window.FujianQiqiFeature.refresh === 'function') {
        window.FujianQiqiFeature.refresh();
      }
    };

    const schedulePlacement = () => requestAnimationFrame(placeControls);
    if (typeof media.addEventListener === 'function') media.addEventListener('change', schedulePlacement);
    else if (typeof media.addListener === 'function') media.addListener(schedulePlacement);
    window.addEventListener('orientationchange', schedulePlacement, { passive: true });
    window.addEventListener('pageshow', schedulePlacement);
    schedulePlacement();

    window.addEventListener('pagehide', () => {
      records.forEach(({ scene, controls, marker }) => {
        if (marker.parentNode) marker.parentNode.insertBefore(controls, marker.nextSibling);
        controls.classList.remove('fq-scene-controls--external');
        scene.classList.remove('has-external-controls');
      });
      if (typeof media.removeEventListener === 'function') media.removeEventListener('change', schedulePlacement);
      else if (typeof media.removeListener === 'function') media.removeListener(schedulePlacement);
      window.removeEventListener('orientationchange', schedulePlacement);
      window.removeEventListener('pageshow', schedulePlacement);
    }, { once: true });
  });
})();
'''
    return js.rstrip() + "\n\n" + js_patch.strip() + "\n"


def patch_css(css: str) -> str:
    if CSS_MARKER in css:
        return css

    css_patch = r'''
/* === External mobile theatre controls and ready copy · 2026-08-21 === */
html.fq-js .fq-act.is-enhanced .fq-line.is-ready-preview,
html.fq-js .fq-act.is-enhanced [data-fq-line].is-ready-preview {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

@media screen and (max-width: 780px) {
  .fq-act.has-external-controls {
    padding-bottom: clamp(2.4rem, 8vw, 3.8rem);
    overflow: visible;
  }

  .fq-act.has-external-controls .fq-stage,
  .fq-act.has-external-controls [data-fq-stage] {
    min-height: clamp(720px, 100dvh, 900px);
    padding-bottom: .9rem;
  }

  .fq-act.has-external-controls .fq-stage > .fq-dialogue,
  .fq-act.has-external-controls .fq-dialogue,
  .fq-act.has-external-controls [data-fq-dialogue] {
    z-index: 72;
    top: clamp(7.7rem, 17dvh, 9.35rem);
    bottom: auto;
    left: 50%;
    width: min(calc(100% - 1.15rem), 34rem);
    min-height: 0;
    transform: translateX(-50%);
    pointer-events: auto;
  }

  .fq-act.has-external-controls .fq-line,
  .fq-act.has-external-controls [data-fq-line] {
    max-height: min(30dvh, 13rem);
    overflow: auto;
    overscroll-behavior: contain;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
  }

  body.fq-page .fq-act.has-external-controls .fq-actors {
    --fq-female-bottom: 1.2rem;
    --fq-male-bottom: 1.2rem;
  }

  .fq-scene-controls.fq-scene-controls--external,
  [data-scene-controls].fq-scene-controls--external {
    position: relative;
    z-index: 18;
    inset: auto;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .45rem;
    width: min(calc(100% - 16px), 1360px);
    min-height: 0;
    margin: .75rem auto 0;
    padding: .7rem;
    overflow: visible;
    border: 1px solid rgba(80, 66, 60, .15);
    border-radius: 18px;
    color: #304448;
    background: rgba(250, 246, 240, .96);
    box-shadow: 0 16px 38px rgba(61, 52, 48, .1), inset 0 1px 0 rgba(255, 255, 255, .8);
    transform: none;
    backdrop-filter: blur(12px) saturate(.88);
  }

  .fq-scene-controls--external .fq-scene-status,
  .fq-scene-controls--external [data-scene-status] {
    position: static;
    grid-column: 1 / -1;
    grid-row: 1;
    justify-self: center;
    width: max-content;
    max-width: 100%;
    min-width: 0;
    margin: 0 0 .1rem;
    padding: .3rem .72rem;
    overflow: hidden;
    border: 1px solid rgba(117, 76, 67, .17);
    border-radius: 999px;
    color: #765047;
    background: rgba(255, 252, 248, .78);
    box-shadow: none;
    font-size: .72rem;
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
    transform: none;
  }

  .fq-scene-controls--external button,
  [data-scene-controls].fq-scene-controls--external button {
    grid-row: 2;
    min-width: 0;
    min-height: 2.8rem;
    padding: .5rem .25rem;
    border-color: rgba(51, 70, 73, .18);
    color: #344a4e;
    background: rgba(255, 255, 255, .78);
    font-size: clamp(.68rem, 3.1vw, .78rem);
    white-space: nowrap;
  }

  .fq-scene-controls--external button:hover,
  .fq-scene-controls--external button:focus-visible,
  [data-scene-controls].fq-scene-controls--external button:hover,
  [data-scene-controls].fq-scene-controls--external button:focus-visible {
    border-color: rgba(126, 77, 70, .4);
    color: #fffaf4;
    background: #6f5550;
  }

  .fq-scene-controls--external [data-scene-pause][aria-pressed="true"] {
    color: #fffaf4;
    background: #496765;
  }

  .fq-scene-controls--external .fq-scene-progress,
  .fq-scene-controls--external [data-scene-progress] {
    right: .8rem;
    bottom: calc(100% + .3rem);
    left: .8rem;
  }
}

@media screen and (max-width: 380px) {
  .fq-act.has-external-controls .fq-stage > .fq-dialogue,
  .fq-act.has-external-controls .fq-dialogue,
  .fq-act.has-external-controls [data-fq-dialogue] {
    top: 7.35rem;
    width: calc(100% - .9rem);
  }

  .fq-scene-controls--external button,
  [data-scene-controls].fq-scene-controls--external button {
    min-height: 2.6rem;
    padding-inline: .12rem;
    font-size: .64rem;
    letter-spacing: 0;
  }
}

@media screen and (max-width: 780px) and (max-height: 560px) and (orientation: landscape) {
  .fq-act.has-external-controls .fq-stage > .fq-dialogue,
  .fq-act.has-external-controls .fq-dialogue,
  .fq-act.has-external-controls [data-fq-dialogue] {
    top: 6.4rem;
    right: auto;
    bottom: auto;
    left: 50%;
    width: min(calc(100% - 1rem), 28rem);
    transform: translateX(-50%);
  }
}
'''
    return css.rstrip() + "\n\n" + css_patch.strip() + "\n"


def main() -> int:
    CSS_PATH.write_text(patch_css(CSS_PATH.read_text(encoding="utf-8")), encoding="utf-8")
    JS_PATH.write_text(patch_js(JS_PATH.read_text(encoding="utf-8")), encoding="utf-8")
    print("Patched Qiqi mobile controls and ready-state dialogue.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
