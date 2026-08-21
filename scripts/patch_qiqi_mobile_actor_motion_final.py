#!/usr/bin/env python3
"""Finalize Fujian Qiqi phone actor proportions and restrained GSAP motion."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_PATH = ROOT / "assets/fujian-qiqi-feature.css"
JS_PATH = ROOT / "assets/fujian-qiqi-feature.js"
CSS_MARKER = "/* === Final mobile actor proportions · 2026-08-21 === */"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)


def patch_js(js: str) -> str:
    if "version: '1.3.6'," in js:
        return js

    js = replace_once(
        js,
        """      if (compactQuery.matches) {
        profile.shift *= 0.74;
        profile.lift *= 0.76;
        profile.lean *= 0.72;
        profile.listenerShift *= 0.72;
        profile.nod *= 0.78;
      }
""",
        """      if (compactQuery.matches) {
        /* Phone figures are visually larger, so body-weight motion must remain
           restrained: enough to feel alive, never enough to invade the copy. */
        profile.shift *= 0.62;
        profile.lift *= 0.68;
        profile.lean *= 0.6;
        profile.listenerShift *= 0.62;
        profile.nod *= 0.72;
      }
""",
        "compact gesture profile",
    )

    js = replace_once(
        js,
        """      actors.forEach(actor => {
        const isFemale = actor.dataset.actor === 'female';
        timeline.fromTo(actor, {
          autoAlpha: 1,
          xPercent: isFemale ? -2.5 : 2.5,
          y: 9,
          rotation: isFemale ? -0.35 : 0.35
        }, {
          autoAlpha: 1,
          xPercent: 0,
          y: 0,
          rotation: 0,
          duration: 1.08,
          ease: 'power2.out',
          immediateRender: false
        }, Math.max(0.18, cursor - 0.28));
      });
""",
        """      actors.forEach(actor => {
        const isFemale = actor.dataset.actor === 'female';
        const mobileEntrance = compactQuery.matches;
        timeline.fromTo(actor, {
          autoAlpha: 1,
          xPercent: isFemale
            ? (mobileEntrance ? -1.4 : -2.5)
            : (mobileEntrance ? 1.4 : 2.5),
          y: mobileEntrance ? 5 : 9,
          rotation: isFemale
            ? (mobileEntrance ? -0.18 : -0.35)
            : (mobileEntrance ? 0.18 : 0.35)
        }, {
          autoAlpha: 1,
          xPercent: 0,
          y: 0,
          rotation: 0,
          duration: mobileEntrance ? 0.88 : 1.08,
          ease: 'power2.out',
          immediateRender: false
        }, Math.max(0.18, cursor - 0.28));
      });
""",
        "mobile actor entrance",
    )

    return replace_once(
        js,
        "version: '1.3.5',",
        "version: '1.3.6',",
        "feature version",
    )


def patch_css(css: str) -> str:
    if CSS_MARKER in css:
        return css

    patch = r'''
/* === Final mobile actor proportions · 2026-08-21 === */
/* Individual `scale` composes with GSAP's transform, so the visual-size
   correction remains stable while the scene timeline moves the body. */
@media screen and (max-width: 780px) {
  body.fq-page .fq-act.has-external-controls .fq-actors {
    --fq-female-width: clamp(176px, 48vw, 320px);
    --fq-male-width: clamp(176px, 48vw, 320px);
    --fq-female-left: -3.5vw;
    --fq-female-right: auto;
    --fq-male-left: auto;
    --fq-male-right: -3.5vw;
  }

  body.fq-page .fq-act.has-external-controls .fq-actors .fq-actor {
    height: min(50%, 540px);
    overflow: visible;
    transform-origin: 50% 100%;
  }

  body.fq-page .fq-act.has-external-controls .fq-actor[data-actor="female"] {
    scale: .92;
  }

  body.fq-page .fq-act.has-external-controls .fq-actor[data-actor="male"] {
    scale: 1.16;
  }

  body.fq-page .fq-act[data-act="1"].has-external-controls .fq-actors {
    --fq-female-left: -4.5vw;
    --fq-male-right: -4.5vw;
  }

  body.fq-page .fq-act[data-act="2"].has-external-controls .fq-actors {
    --fq-female-left: -2.5vw;
    --fq-male-right: -2.5vw;
  }

  body.fq-page .fq-act[data-act="3"].has-external-controls .fq-actors {
    --fq-female-left: -5vw;
    --fq-male-right: -5vw;
  }

  body.fq-page .fq-act[data-act="4"].has-external-controls .fq-actors {
    --fq-female-left: auto;
    --fq-female-right: -3.5vw;
    --fq-male-left: -3.5vw;
    --fq-male-right: auto;
  }

  body.fq-page .fq-act[data-act="5"].has-external-controls .fq-actors {
    --fq-female-left: 0;
    --fq-male-right: 0;
  }

  body.fq-page .fq-act.is-playing .fq-actor {
    will-change: transform, scale, opacity;
  }

  body.fq-page .fq-act:not(.is-playing) .fq-actor {
    will-change: auto;
  }
}

@media screen and (max-width: 380px) and (orientation: portrait) {
  body.fq-page .fq-act.has-external-controls .fq-actors {
    --fq-female-width: clamp(158px, 49vw, 226px);
    --fq-male-width: clamp(158px, 49vw, 226px);
  }

  body.fq-page .fq-act.has-external-controls .fq-actor[data-actor="female"] {
    scale: .9;
  }

  body.fq-page .fq-act.has-external-controls .fq-actor[data-actor="male"] {
    scale: 1.13;
  }
}

@media screen and (max-width: 780px) and (max-height: 560px) and (orientation: landscape) {
  body.fq-page .fq-act.has-external-controls .fq-actors {
    --fq-female-width: clamp(184px, 32vw, 288px);
    --fq-male-width: clamp(184px, 32vw, 288px);
  }

  body.fq-page .fq-act.has-external-controls .fq-actors .fq-actor {
    height: min(56%, 336px);
  }

  body.fq-page .fq-act.has-external-controls .fq-actor[data-actor="female"] {
    scale: .94;
  }

  body.fq-page .fq-act.has-external-controls .fq-actor[data-actor="male"] {
    scale: 1.1;
  }
}

@media (prefers-reduced-motion: reduce) {
  body.fq-page .fq-act .fq-actor {
    animation: none !important;
    translate: none !important;
  }
}
'''
    return css.rstrip() + "\n\n" + patch.strip() + "\n"


def main() -> int:
    CSS_PATH.write_text(patch_css(CSS_PATH.read_text(encoding="utf-8")), encoding="utf-8")
    JS_PATH.write_text(patch_js(JS_PATH.read_text(encoding="utf-8")), encoding="utf-8")
    print("Finalized Qiqi mobile actor proportions and motion.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
