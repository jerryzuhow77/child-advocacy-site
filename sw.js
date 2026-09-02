'use strict';

// A new cache namespace is intentional: it retires the previous home document
// and lets the revised paper-cut/embroidery art replace an already-installed PWA.
const VERSION = '20260902-guohua-kai-poster-v3';
const CACHE_PREFIX = 'cpa-alliance-pwa-';
const SHELL_CACHE = `${CACHE_PREFIX}shell-${VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-${VERSION}`;
const MAX_RUNTIME_ITEMS = 150;

// Keep the install transaction deliberately small. A missing article image or a
// transient GitHub Pages response must never make the whole PWA un-installable.
const REQUIRED_SHELL = [
  './offline.html',
  './manifest.webmanifest',
  './assets/pwa-install.css',
  './assets/pwa-install.js',
  './assets/icons/app-icon-192.png',
  './assets/icons/app-icon-512.png',
  './assets/icons/app-icon-maskable-512.png',
  './assets/icons/apple-touch-icon-180.png'
];

// These improve the first offline launch, but are warmed opportunistically so
// a later page rename or a temporary network error cannot block activation.
const OPTIONAL_SHELL = [
  './assets/site.css',
  './assets/site.js',
  './assets/site-base-20260823.js',
  './assets/site-four-language-qa-20260823.js',
  './assets/mobile-nav-view-counter-20260823.js',
  './assets/four-language-toolbar-20260901.css',
  './assets/four-language-toolbar-20260901.js',
  './data/four-language-routes.json',
  './assets/home-gsap.css',
  './assets/home-gsap.js',
  './assets/vendor/gsap-3.13.0.min.js',
  './assets/vendor/ScrollTrigger-3.13.0.min.js',
  './assets/global-protection-wall-portal.css',
  './assets/global-protection-wall-portal.js'
];

function scopeUrl(path) {
  return new URL(path, self.registration.scope).href;
}

async function fetchForCache(url) {
  const response = await fetch(url, {
    cache: 'reload',
    credentials: 'same-origin'
  });
  if (!response.ok || response.type === 'opaque') {
    throw new Error(`Unable to cache ${url}: ${response.status}`);
  }
  return response;
}

async function putShellAsset(cache, path) {
  const url = scopeUrl(path);
  const response = await fetchForCache(url);
  await cache.put(url, response);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);

    // These files define installability and the offline fallback. Fail loudly
    // only when one of them is genuinely unavailable.
    await Promise.all(REQUIRED_SHELL.map(path => putShellAsset(cache, path)));

    // Warm the rest without turning one optional failure into an install fail.
    await Promise.allSettled(OPTIONAL_SHELL.map(path => putShellAsset(cache, path)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE && key !== RUNTIME_CACHE)
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function cacheable(response) {
  if (!response || !response.ok || response.type === 'opaque') return false;
  const cacheControl = response.headers.get('Cache-Control') || '';
  return !/no-store/i.test(cacheControl);
}

async function trimRuntimeCache() {
  const cache = await caches.open(RUNTIME_CACHE);
  const keys = await cache.keys();
  if (keys.length <= MAX_RUNTIME_ITEMS) return;
  await Promise.all(keys.slice(0, keys.length - MAX_RUNTIME_ITEMS).map(key => cache.delete(key)));
}

async function putRuntime(cache, request, response) {
  if (!cacheable(response)) return;
  await cache.put(request, response.clone());
  await trimRuntimeCache();
}

async function networkFirstNavigation(request) {
  const runtime = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request, { cache: 'no-cache' });
    await putRuntime(runtime, request, response);
    return response;
  } catch (_) {
    const exact = await runtime.match(request, { ignoreSearch: true });
    if (exact) return exact;

    const shell = await caches.open(SHELL_CACHE);
    const requestedUrl = new URL(request.url);
    const scope = new URL(self.registration.scope);
    if (requestedUrl.pathname === scope.pathname) {
      const home = await shell.match(scopeUrl('./'), { ignoreSearch: true });
      if (home) return home;
    }
    return (await shell.match(scopeUrl('./offline.html'), { ignoreSearch: true })) || Response.error();
  }
}

async function networkFirstStatic(request) {
  const runtime = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request, { cache: 'no-cache' });
    await putRuntime(runtime, request, response);
    return response;
  } catch (_) {
    const exact = await runtime.match(request, { ignoreSearch: true });
    if (exact) return exact;
    const shell = await caches.open(SHELL_CACHE);
    return (await shell.match(request, { ignoreSearch: true })) || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const runtime = await caches.open(RUNTIME_CACHE);
  const cached = await runtime.match(request, { ignoreSearch: true });
  const networkPromise = fetch(request)
    .then(async response => {
      await putRuntime(runtime, request, response);
      return response;
    })
    .catch(() => null);

  if (cached) {
    // Keep refreshing in the background even though the cached response wins.
    void networkPromise;
    return cached;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) return networkResponse;

  const shell = await caches.open(SHELL_CACHE);
  return (await shell.match(request, { ignoreSearch: true })) || Response.error();
}

function isLiveDataRequest(url) {
  return url.pathname.includes('/api/') ||
    url.pathname.includes('/admin-actions/') ||
    url.pathname.includes('/functions/') ||
    url.pathname.endsWith('/data/latest-bulletins.json');
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isLiveDataRequest(url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  const alwaysFresh =
    url.pathname.endsWith('/manifest.webmanifest') ||
    url.pathname.endsWith('/assets/pwa-install.js') ||
    url.pathname.endsWith('/assets/pwa-install.css') ||
    url.pathname.endsWith('/assets/site.css') ||
    url.pathname.endsWith('/assets/site.js') ||
    url.pathname.endsWith('/assets/site-base-20260823.js') ||
    url.pathname.endsWith('/assets/site-four-language-qa-20260823.js') ||
    url.pathname.endsWith('/assets/mobile-nav-view-counter-20260823.js') ||
    url.pathname.endsWith('/assets/four-language-toolbar-20260901.css') ||
    url.pathname.endsWith('/assets/four-language-toolbar-20260901.js') ||
    url.pathname.endsWith('/data/four-language-routes.json') ||
    url.pathname.endsWith('/assets/home-gsap.js') ||
    url.pathname.endsWith('/assets/home-gsap-map-20260824.js') ||
    url.pathname.endsWith('/assets/home-gsap-base-20260823.js') ||
    url.pathname.endsWith('/assets/home-archive-layout-20260823.js') ||
    url.pathname.includes('/assets/home-ia-') ||
    url.pathname.includes('/assets/home-history-') ||
    url.pathname.endsWith('/assets/global-protection-wall-portal.js') ||
    url.pathname.endsWith('/assets/global-protection-wall-portal.css');

  if (alwaysFresh || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(networkFirstStatic(request));
    return;
  }

  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(staleWhileRevalidate(request));
  }
});
