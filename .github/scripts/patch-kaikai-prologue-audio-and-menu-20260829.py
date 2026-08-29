from __future__ import annotations

import re
from pathlib import Path

ROOT = Path('hearing-records/prison-watch/kaikai-final-chapter')
CSS_MARKER = '/* PROLOGUE-AUDIO-AUTOSTART-20260829 */'
JS_MARKER = '// PROLOGUE-AUDIO-AUTOSTART-20260829'


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one match, found {count}')
    return text.replace(old, new, 1)


def replace_regex_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f'{label}: expected one regex match, found {count}')
    return updated


HTML_CONFIGS = [
    {
        'path': ROOT / 'index.html',
        'description': '序幕進站時會立即靜音播放，並同步嘗試啟動網頁背景配樂；若瀏覽器阻擋有聲自動播放，請按「播放序幕與配樂」。象徵性公益影像，非案件現場或證據影像。',
        'skip_label': '略過序幕、進入正文並繼續背景配樂',
        'skip_title': '進入正文並繼續背景配樂',
        'play_label': '播放序幕與配樂',
    },
    {
        'path': ROOT / 'zh-Hans' / 'index.html',
        'description': '序幕进站时会立即静音播放，并同步尝试启动网页背景配乐；若浏览器阻挡有声自动播放，请按“播放序幕与配乐”。象征性公益影像，非案件现场或证据影像。',
        'skip_label': '略过序幕、进入正文并继续背景配乐',
        'skip_title': '进入正文并继续背景配乐',
        'play_label': '播放序幕与配乐',
    },
]

css_versions: list[int] = []
js_versions: list[int] = []
for config in HTML_CONFIGS:
    text = config['path'].read_text(encoding='utf-8')
    css_match = re.search(r'final-chapter\.css\?v=20260829-(\d+)', text)
    js_match = re.search(r'final-chapter\.js\?v=20260829-(\d+)', text)
    if not css_match or not js_match:
        raise SystemExit(f"{config['path']}: CSS or JS cache version not found")
    css_versions.append(int(css_match.group(1)))
    js_versions.append(int(js_match.group(1)))

next_css_version = max(css_versions) + 1
next_js_version = max(js_versions) + 1

for config in HTML_CONFIGS:
    path = config['path']
    text = path.read_text(encoding='utf-8')
    text = re.sub(r'final-chapter\.css\?v=20260829-\d+', f'final-chapter.css?v=20260829-{next_css_version}', text, count=1)
    text = re.sub(r'final-chapter\.js\?v=20260829-\d+', f'final-chapter.js?v=20260829-{next_js_version}', text, count=1)

    text = replace_regex_once(
        text,
        r'<p id="prologueFilmDescription">.*?</p>',
        f'<p id="prologueFilmDescription">{config["description"]}</p>',
        f'{path} prologue description',
    )
    text = replace_regex_once(
        text,
        r'<button class="entry-prologue__skip" type="button" data-prologue-skip aria-label="[^"]*" title="[^"]*">略過／進入<span aria-hidden="true">↓</span></button>',
        f'<button class="entry-prologue__skip" type="button" data-prologue-skip aria-label="{config["skip_label"]}" title="{config["skip_title"]}">略過／進入<span aria-hidden="true">↓</span></button>',
        f'{path} prologue skip button',
    )
    text = replace_regex_once(
        text,
        r'<button class="entry-prologue__play" type="button" data-prologue-play hidden>.*?<span aria-hidden="true">▶</span></button>',
        f'<button class="entry-prologue__play" type="button" data-prologue-play hidden aria-label="{config["play_label"]}">{config["play_label"]}<span aria-hidden="true">▶</span></button>',
        f'{path} prologue play button',
    )
    text, audio_preload_count = re.subn(
        r'<audio id="chapterBgm" preload="(?:none|metadata|auto)"',
        '<audio id="chapterBgm" preload="auto"',
        text,
        count=1,
    )
    if audio_preload_count != 1:
        raise SystemExit(f'{path}: chapter audio element not found')

    required = [
        config['description'],
        config['play_label'],
        'preload="auto"',
        f'final-chapter.css?v=20260829-{next_css_version}',
        f'final-chapter.js?v=20260829-{next_js_version}',
    ]
    for phrase in required:
        if phrase not in text:
            raise SystemExit(f'{path}: missing {phrase}')
    path.write_text('\n'.join(line.rstrip() for line in text.splitlines()) + '\n', encoding='utf-8')

css_path = ROOT / 'final-chapter.css'
css = css_path.read_text(encoding='utf-8')
new_rule = '.nav-group-major>summary:before{display:none!important;content:none!important}'
if new_rule not in css:
    css, pseudo_count = re.subn(
        r'\.nav-group-major>summary:before\{[^}]*\}',
        new_rule,
        css,
        count=1,
        flags=re.S,
    )
    if pseudo_count != 1:
        raise SystemExit(f'Expected one nav-group-major NEW pseudo rule, found {pseudo_count}')
if "content:'NEW'" in css or 'content:"NEW"' in css:
    raise SystemExit('The main-menu NEW pseudo text is still present')
if CSS_MARKER not in css:
    css += r'''

/* PROLOGUE-AUDIO-AUTOSTART-20260829 */
.entry-prologue.is-audio-blocked .entry-prologue__play{display:inline-flex;align-items:center;gap:9px;background:linear-gradient(135deg,#b6463f,#7f2f2a);border-color:#f0c77d;box-shadow:0 14px 34px rgba(0,0,0,.34)}
.entry-prologue.is-audio-blocked .entry-prologue__play:before{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#efc77d;color:#09263a;font-size:14px;font-weight:950;content:'♫'}
.entry-prologue.is-audio-blocked .entry-prologue__copy span:after{margin-left:8px;color:#f0c77d;font-weight:950;content:'· 請點擊啟動配樂'}
html[lang="zh-Hans"] .entry-prologue.is-audio-blocked .entry-prologue__copy span:after{content:'· 请点击启动配乐'}
'''
if css.count(CSS_MARKER) != 1:
    raise SystemExit(f'CSS marker count is {css.count(CSS_MARKER)}')
css_path.write_text('\n'.join(line.rstrip() for line in css.splitlines()) + '\n', encoding='utf-8')

js_path = ROOT / 'final-chapter.js'
js = js_path.read_text(encoding='utf-8')

if JS_MARKER not in js:
    replay_anchor = """  const prologueReplayLinks = [...document.querySelectorAll('a[href="#prologue-film"]')];
"""
    replay_insert = """  const prologueReplayLinks = [...document.querySelectorAll('a[href="#prologue-film"]')];
  // PROLOGUE-AUDIO-AUTOSTART-20260829
  const prologueAudio = document.querySelector('#chapterBgm');
  const prologueAudioVolume = document.querySelector('[data-audio-volume]');
  const prologueAudioPrompt = locale === 'zh-Hans' ? '播放序幕与配乐' : '播放序幕與配樂';
  let prologueAudioBlocked = false;
"""
    js = replace_once(js, replay_anchor, replay_insert, 'prologue audio variables')

    old_prompt = """  const showProloguePlayPrompt = () => {
    if (!prologueOverlay || !prologuePlay) return;
    prologueOverlay.classList.add('is-blocked');
    prologuePlay.hidden = false;
  };
"""
    new_prompt = """  const showProloguePlayPrompt = ({ audioBlocked = false } = {}) => {
    if (!prologueOverlay || !prologuePlay) return;
    if (audioBlocked) prologueAudioBlocked = true;
    prologueOverlay.classList.add('is-blocked');
    prologueOverlay.classList.toggle('is-audio-blocked', prologueAudioBlocked);
    const labelNode = [...prologuePlay.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (labelNode) labelNode.nodeValue = prologueAudioPrompt;
    prologuePlay.setAttribute('aria-label', prologueAudioPrompt);
    prologuePlay.hidden = false;
  };

  const startPrologueAudio = ({ restart = false } = {}) => {
    if (!prologueAudio) return Promise.resolve(false);
    if (restart || prologueAudio.ended) {
      try { prologueAudio.currentTime = 0; } catch (_) {}
    }
    prologueAudio.muted = false;
    prologueAudio.volume = Number(prologueAudioVolume?.value || prologueAudio.volume || 0.58);
    prologueAudio.dataset.prologueAutoplay = 'attempting';
    const attempt = prologueAudio.play();
    if (!attempt) {
      const playing = !prologueAudio.paused;
      prologueAudio.dataset.prologueAutoplay = playing ? 'playing' : 'blocked';
      if (!playing) showProloguePlayPrompt({ audioBlocked: true });
      return Promise.resolve(playing);
    }
    return attempt.then(() => {
      prologueAudioBlocked = false;
      prologueAudio.dataset.prologueAutoplay = 'playing';
      prologueOverlay?.classList.remove('is-audio-blocked');
      return true;
    }).catch(() => {
      prologueAudio.dataset.prologueAutoplay = 'blocked';
      showProloguePlayPrompt({ audioBlocked: true });
      return false;
    });
  };
"""
    js = replace_once(js, old_prompt, new_prompt, 'prologue play prompt and audio starter')

    old_reset = """    prologueOverlay.classList.remove('is-closing', 'is-blocked');
    if (prologuePlay) prologuePlay.hidden = true;
    setProloguePageState(true);
    prologueVideo.muted = true;
"""
    new_reset = """    prologueOverlay.classList.remove('is-closing', 'is-blocked', 'is-audio-blocked');
    if (prologuePlay) prologuePlay.hidden = true;
    prologueAudioBlocked = false;
    setProloguePageState(true);
    prologueVideo.muted = true;
"""
    js = replace_once(js, old_reset, new_reset, 'prologue reset state')

    old_play_attempt = """    const playAttempt = prologueVideo.play();
    playAttempt?.catch(() => showProloguePlayPrompt());
    prologueFailsafeTimer = window.setTimeout(() => {
      if (prologueVideo.paused && !prologueVideo.ended) showProloguePlayPrompt();
      else closePrologue();
    }, 12000);
"""
    new_play_attempt = """    void startPrologueAudio({ restart: true });
    const playAttempt = prologueVideo.play();
    playAttempt?.catch(() => showProloguePlayPrompt());
    prologueFailsafeTimer = window.setTimeout(() => {
      if (prologueVideo.paused && !prologueVideo.ended) showProloguePlayPrompt();
      else if (prologueAudioBlocked || prologueAudio?.paused) showProloguePlayPrompt({ audioBlocked: true });
      else closePrologue();
    }, 12000);
"""
    js = replace_once(js, old_play_attempt, new_play_attempt, 'prologue automatic audio attempt')

    old_skip = """  prologueSkip?.addEventListener('click', () => {
    // Use only this explicit entry gesture to unlock audible media.
    // Natural prologue completion remains silent and keeps the player ready.
    playChapterAudioFromGesture();
    closePrologue({ focusMain: true });
  });
"""
    new_skip = """  prologueSkip?.addEventListener('click', () => {
    void startPrologueAudio({ restart: false });
    closePrologue({ focusMain: true });
  });
"""
    js = replace_once(js, old_skip, new_skip, 'prologue skip audio behavior')

    old_prompt_click = """  prologuePlay?.addEventListener('click', () => {
    const playAttempt = prologueVideo?.play();
    playAttempt?.then(() => {
      prologueOverlay?.classList.remove('is-blocked');
      if (prologuePlay) prologuePlay.hidden = true;
    }).catch(() => showProloguePlayPrompt());
  });
"""
    new_prompt_click = """  prologuePlay?.addEventListener('click', () => {
    if (prologueVideo) {
      try { prologueVideo.currentTime = 0; } catch (_) {}
    }
    const videoAttempt = prologueVideo?.play()
      ?.then(() => true)
      .catch(() => false) || Promise.resolve(false);
    Promise.all([videoAttempt, startPrologueAudio({ restart: true })]).then(([videoStarted, audioStarted]) => {
      if (videoStarted && audioStarted) {
        prologueOverlay?.classList.remove('is-blocked', 'is-audio-blocked');
        if (prologuePlay) prologuePlay.hidden = true;
      } else {
        showProloguePlayPrompt({ audioBlocked: !audioStarted });
      }
    });
  });
"""
    js = replace_once(js, old_prompt_click, new_prompt_click, 'prologue prompt click behavior')

    old_ended = """  prologueVideo?.addEventListener('ended', () => closePrologue());
"""
    new_ended = """  prologueVideo?.addEventListener('ended', () => {
    if (prologueAudioBlocked || prologueAudio?.paused) {
      showProloguePlayPrompt({ audioBlocked: true });
      return;
    }
    closePrologue();
  });
"""
    js = replace_once(js, old_ended, new_ended, 'prologue ended behavior')

    old_escape = """    if (event.key === 'Escape' && prologueOverlay && !prologueOverlay.hidden) {
      closePrologue({ focusMain: true });
    }
"""
    new_escape = """    if (event.key === 'Escape' && prologueOverlay && !prologueOverlay.hidden) {
      void startPrologueAudio({ restart: false });
      closePrologue({ focusMain: true });
    }
"""
    js = replace_once(js, old_escape, new_escape, 'prologue escape audio behavior')

    old_visibility = """    prologueVideo?.play().catch(() => showProloguePlayPrompt());
"""
    new_visibility = """    prologueVideo?.play().catch(() => showProloguePlayPrompt());
    void startPrologueAudio({ restart: false });
"""
    js = replace_once(js, old_visibility, new_visibility, 'prologue visibility audio retry')

if js.count(JS_MARKER) != 1:
    raise SystemExit(f'JS marker count is {js.count(JS_MARKER)}')
for phrase in [
    "const prologueAudio = document.querySelector('#chapterBgm')",
    'void startPrologueAudio({ restart: true });',
    "prologueAudio.dataset.prologueAutoplay = 'blocked'",
    "prologueVideo?.addEventListener('ended', () => {",
]:
    if phrase not in js:
        raise SystemExit(f'JS missing {phrase}')
js_path.write_text('\n'.join(line.rstrip() for line in js.splitlines()) + '\n', encoding='utf-8')

print(
    f'Removed the main-menu NEW label; enabled prologue audio autostart attempt; '
    f'CSS v20260829-{next_css_version}, JS v20260829-{next_js_version}.'
)
