(function () {
  'use strict';

  const currentScript = document.currentScript;
  const assetsBase = currentScript && currentScript.src
    ? new URL('./', currentScript.src)
    : new URL('./assets/', document.baseURI);
  const siteBase = new URL('../', assetsBase);

  const COPY = {
    'zh-Hant': {
      launcher: '下載手機 App',
      launcherLabel: '下載或安裝護童行動聯盟 App',
      eyebrow: 'INSTALL THE APP',
      title: '安裝護童行動聯盟',
      intro: '安裝後可從手機主畫面直接開啟，操作方式與一般 App 相同。',
      iosNote: 'iPhone／iPad 需使用 Safari 安裝。',
      iosSteps: ['用 Safari 開啟本網站', '點選下方工具列的「分享」按鈕', '往下選擇「加入主畫面」', '點選右上角「新增」'],
      androidNote: '建議使用 Chrome 開啟。',
      androidSteps: ['用 Chrome 開啟本網站', '點選右上角「⋮」功能選單', '選擇「安裝應用程式」或「加到主畫面」', '確認安裝'],
      desktopNote: '可使用 Chrome 或 Edge 安裝。',
      desktopSteps: ['查看網址列右側的安裝圖示', '或開啟瀏覽器功能選單', '選擇「安裝護童行動聯盟」', '確認安裝'],
      inApp: '目前可能正在社群 App 內建瀏覽器中。請先從功能選單選擇「以瀏覽器開啟」。',
      close: '知道了',
      closeLabel: '關閉安裝說明',
      installed: 'App 已安裝完成，可從主畫面開啟。'
    },
    'zh-Hans': {
      launcher: '下载手机 App',
      launcherLabel: '下载或安装护童行动联盟 App',
      eyebrow: 'INSTALL THE APP',
      title: '安装护童行动联盟',
      intro: '安装后可从手机主画面直接开启，操作方式与一般 App 相同。',
      iosNote: 'iPhone／iPad 需使用 Safari 安装。',
      iosSteps: ['用 Safari 开启本网站', '点选下方工具列的“分享”按钮', '往下选择“加入主画面”', '点选右上角“新增”'],
      androidNote: '建议使用 Chrome 开启。',
      androidSteps: ['用 Chrome 开启本网站', '点选右上角“⋮”功能选单', '选择“安装应用程式”或“加到主画面”', '确认安装'],
      desktopNote: '可使用 Chrome 或 Edge 安装。',
      desktopSteps: ['查看网址列右侧的安装图示', '或开启浏览器功能选单', '选择“安装护童行动联盟”', '确认安装'],
      inApp: '目前可能正在社群 App 内建浏览器中。请先从功能选单选择“以浏览器开启”。',
      close: '知道了',
      closeLabel: '关闭安装说明',
      installed: 'App 已安装完成，可从主画面开启。'
    },
    en: {
      launcher: 'Install App',
      launcherLabel: 'Download or install the Child Protection Action Alliance app',
      eyebrow: 'INSTALL THE APP',
      title: 'Install the Alliance App',
      intro: 'Open the website directly from your home screen in a standalone app view.',
      iosNote: 'On iPhone or iPad, install with Safari.',
      iosSteps: ['Open this website in Safari', 'Tap the Share button in the toolbar', 'Choose “Add to Home Screen”', 'Tap “Add”'],
      androidNote: 'Chrome is recommended on Android.',
      androidSteps: ['Open this website in Chrome', 'Tap the ⋮ browser menu', 'Choose “Install app” or “Add to Home screen”', 'Confirm the installation'],
      desktopNote: 'Install with Chrome or Edge.',
      desktopSteps: ['Find the install icon in the address bar', 'Or open the browser menu', 'Choose “Install Child Protection Action Alliance”', 'Confirm the installation'],
      inApp: 'This may be an in-app browser. Open its menu and choose “Open in browser” first.',
      close: 'Got it',
      closeLabel: 'Close installation instructions',
      installed: 'The app is installed. You can now open it from your home screen.'
    },
    ja: {
      launcher: 'アプリを追加',
      launcherLabel: '児童保護行動連盟のアプリをダウンロードまたはインストール',
      eyebrow: 'INSTALL THE APP',
      title: '児童保護行動連盟を追加',
      intro: 'インストール後は、ホーム画面から通常のアプリと同じように開けます。',
      iosNote: 'iPhone／iPad では Safari を使用してください。',
      iosSteps: ['Safari でこのサイトを開く', 'ツールバーの「共有」をタップ', '「ホーム画面に追加」を選ぶ', '右上の「追加」をタップ'],
      androidNote: 'Android では Chrome を推奨します。',
      androidSteps: ['Chrome でこのサイトを開く', '右上の「⋮」メニューをタップ', '「アプリをインストール」または「ホーム画面に追加」を選ぶ', 'インストールを確認'],
      desktopNote: 'Chrome または Edge からインストールできます。',
      desktopSteps: ['アドレスバー右側のインストールアイコンを確認', 'またはブラウザのメニューを開く', '「児童保護行動連盟をインストール」を選ぶ', 'インストールを確認'],
      inApp: 'SNS アプリ内ブラウザの可能性があります。メニューから「ブラウザで開く」を選んでください。',
      close: '閉じる',
      closeLabel: 'インストール方法を閉じる',
      installed: 'インストールが完了しました。ホーム画面から開けます。'
    }
  };

  let deferredInstallPrompt = null;
  let launcher = null;
  let navTriggers = [];
  let modal = null;
  let lastFocusedElement = null;

  function languageKey() {
    const lang = document.documentElement.lang || '';
    if (lang.toLowerCase().startsWith('en')) return 'en';
    if (lang.toLowerCase().startsWith('ja')) return 'ja';
    if (lang.toLowerCase() === 'zh-hans') return 'zh-Hans';
    try {
      if (localStorage.getItem('siteLang') === 'zh-Hans') return 'zh-Hans';
    } catch (_) {}
    return 'zh-Hant';
  }

  function copy() {
    return COPY[languageKey()] || COPY['zh-Hant'];
  }

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function isIOS() {
    const ua = navigator.userAgent || '';
    return /iPad|iPhone|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function isAndroid() {
    return /Android/i.test(navigator.userAgent || '');
  }

  function isInAppBrowser() {
    return /FBAN|FBAV|Instagram|Line\/|Threads|MicroMessenger|WebView/i.test(navigator.userAgent || '');
  }

  function ensureHeadMetadata() {
    const head = document.head;
    if (!head.querySelector('link[rel="manifest"]')) {
      const manifest = document.createElement('link');
      manifest.rel = 'manifest';
      manifest.href = new URL('manifest.webmanifest', siteBase).href;
      head.appendChild(manifest);
    }
    if (!head.querySelector('link[rel="apple-touch-icon"]')) {
      const icon = document.createElement('link');
      icon.rel = 'apple-touch-icon';
      icon.sizes = '180x180';
      icon.href = new URL('assets/icons/apple-touch-icon-180.png', siteBase).href;
      head.appendChild(icon);
    }
    const metaValues = {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': '護童行動聯盟'
    };
    Object.entries(metaValues).forEach(([name, content]) => {
      if (head.querySelector(`meta[name="${name}"]`)) return;
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      head.appendChild(meta);
    });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
    window.addEventListener('load', () => {
      const hadServiceWorkerController = Boolean(navigator.serviceWorker.controller);
      let reloadingForUpdate = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadServiceWorkerController || reloadingForUpdate) return;
        reloadingForUpdate = true;
        window.location.reload();
      });
      navigator.serviceWorker.register(new URL('sw.js?v=20260831-home-recovery-v3', siteBase).href, {
        scope: siteBase.pathname,
        updateViaCache: 'none'
      })
        .then(registration => {
          if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          return registration.update();
        })
        .catch(error => console.warn('[PWA] Service worker registration failed:', error));
    }, { once: true });
  }

  function launcherIcon() {
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/></svg>';
  }

  function updateLauncherCopy() {
    const t = copy();
    [launcher, ...navTriggers].filter(Boolean).forEach(trigger => {
      const label = trigger.querySelector('.pwa-install-label');
      if (label) label.textContent = t.launcher;
      trigger.setAttribute('aria-label', t.launcherLabel);
      trigger.title = t.launcherLabel;
    });
  }

  function createLauncher() {
    if (document.querySelector('.pwa-install-launcher')) return document.querySelector('.pwa-install-launcher');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pwa-install-launcher';
    button.innerHTML = `${launcherIcon()}<span class="pwa-install-label"></span>`;
    button.addEventListener('click', handleInstallClick);
    document.body.appendChild(button);
    return button;
  }

  function bindNavTriggers() {
    navTriggers = [...document.querySelectorAll('[data-pwa-install-trigger]')];
    navTriggers.forEach(trigger => {
      if (trigger.dataset.pwaInstallBound === 'true') return;
      trigger.dataset.pwaInstallBound = 'true';
      trigger.addEventListener('click', handleInstallClick);
    });
  }

  function setInstallTriggersHidden(hidden) {
    [launcher, ...navTriggers].filter(Boolean).forEach(trigger => {
      trigger.hidden = hidden;
    });
  }

  function platformInstructions(t) {
    if (isIOS()) return { note: t.iosNote, steps: t.iosSteps };
    if (isAndroid()) return { note: t.androidNote, steps: t.androidSteps };
    return { note: t.desktopNote, steps: t.desktopSteps };
  }

  function createModal() {
    if (document.querySelector('.pwa-modal-backdrop')) return document.querySelector('.pwa-modal-backdrop');
    const backdrop = document.createElement('div');
    backdrop.className = 'pwa-modal-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML = `
      <section class="pwa-install-dialog" role="dialog" aria-modal="true" aria-labelledby="pwaInstallTitle">
        <button class="pwa-modal-close" type="button"><span aria-hidden="true">×</span></button>
        <div class="pwa-modal-brand">
          <img src="${new URL('assets/icons/app-icon-192.png', siteBase).href}" alt="">
          <div><span class="pwa-modal-eyebrow"></span><h2 id="pwaInstallTitle"></h2></div>
        </div>
        <p class="pwa-modal-intro"></p>
        <p class="pwa-modal-platform-note"></p>
        <ol class="pwa-install-steps"></ol>
        <button class="pwa-modal-confirm" type="button"></button>
      </section>`;

    const closeButton = backdrop.querySelector('.pwa-modal-close');
    const confirmButton = backdrop.querySelector('.pwa-modal-confirm');
    closeButton.addEventListener('click', closeModal);
    confirmButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', event => {
      if (event.target === backdrop) closeModal();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && backdrop.classList.contains('is-open')) closeModal();
      if (event.key !== 'Tab' || !backdrop.classList.contains('is-open')) return;
      const focusable = [...backdrop.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function updateModalCopy() {
    if (!modal) return;
    const t = copy();
    const platform = platformInstructions(t);
    modal.querySelector('.pwa-modal-eyebrow').textContent = t.eyebrow;
    modal.querySelector('h2').textContent = t.title;
    modal.querySelector('.pwa-modal-intro').textContent = t.intro;
    modal.querySelector('.pwa-modal-platform-note').textContent = isInAppBrowser() ? t.inApp : platform.note;
    modal.querySelector('.pwa-install-steps').innerHTML = platform.steps.map(step => `<li><span>${step}</span></li>`).join('');
    modal.querySelector('.pwa-modal-confirm').textContent = t.close;
    modal.querySelector('.pwa-modal-close').setAttribute('aria-label', t.closeLabel);
  }

  function openModal() {
    if (!modal) modal = createModal();
    updateModalCopy();
    lastFocusedElement = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    const dialog = modal.querySelector('.pwa-install-dialog');
    if (dialog) dialog.scrollTop = 0;
    document.body.classList.add('pwa-modal-open');
    window.requestAnimationFrame(() => modal.querySelector('.pwa-modal-close').focus());
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pwa-modal-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
  }

  function showToast(message) {
    let toast = document.querySelector('.pwa-install-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'pwa-install-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.setTimeout(() => toast.classList.remove('is-visible'), 4200);
  }

  async function handleInstallClick() {
    if (!deferredInstallPrompt) {
      openModal();
      return;
    }
    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    await promptEvent.prompt();
    try {
      const choice = await promptEvent.userChoice;
      if (!choice || choice.outcome !== 'accepted') openModal();
    } catch (_) {
      openModal();
    }
  }

  function init() {
    launcher = createLauncher();
    bindNavTriggers();
    updateLauncherCopy();
    setInstallTriggersHidden(isStandalone());

    const langObserver = new MutationObserver(updateLauncherCopy);
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (!isStandalone()) setInstallTriggersHidden(false);
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    setInstallTriggersHidden(true);
    showToast(copy().installed);
  });

  ensureHeadMetadata();
  registerServiceWorker();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
