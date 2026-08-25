'use strict';

const VERSION = '2026-08-25-charity-poster-rebuild-v20-paper-weather-v2';
const CACHE_PREFIX = 'cpa-alliance-pwa-';
const SHELL_CACHE = `${CACHE_PREFIX}shell-${VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-${VERSION}`;
const MAX_RUNTIME_ITEMS = 150;

const APP_SHELL = [
  './',
  './offline.html',
  './manifest.webmanifest',
  './assets/site.js',
  './assets/site-base-20260823.js',
  './assets/site-four-language-qa-20260823.js',
  './assets/mobile-nav-view-counter-20260823.js',
  './assets/pwa-install.css',
  './assets/pwa-install.js',
  './assets/home-gsap.css',
  './assets/home-history-static-map-20260824.css',
  './assets/home-history-paper-weather-20260825.css',
  './assets/home-first-round-optimization.css',
  './assets/global-protection-home.css',
  './assets/visitor-submission.js',
  './assets/home-gsap.js',
  './assets/home-gsap-map-20260824.js',
  './assets/home-history-paper-weather-20260825.js',
  './assets/home-gsap-base-20260823.js',
  './assets/home-archive-layout-20260823.js',
  './assets/home-ia-core-20260823.js',
  './assets/home-ia-layout-20260823.js',
  './assets/home-ia-history-20260823.js',
  './assets/home-history-paper-art-20260823.js',
  './assets/home-history-paper-art-20260823.css',
  './assets/home-history-relief-map-20260823.js',
  './assets/home-history-relief-map-20260823.css',
  './assets/home-history-mobile-visibility-20260824.css',
  './assets/art/east-asia-case-memory-map-paper-clay-20260824.webp',
  './assets/home-ia-hearing-campaign-20260823.js',
  './assets/home-ia-bootstrap-20260823.js',
  './assets/home-ia-v2-final.css',
  './assets/activity-impact.js',
  './assets/home-view-counter-20260811.js',
  './assets/home-view-counter-20260811.css',
  './assets/qiqi-classical-notes.js',
  './assets/global-protection-wall-portal.css',
  './assets/global-protection-wall-portal.js',
  './global-protection-wall/',
  './activity-records/20260820-kaikai-story-collection/images/kaikai-story-collection-hero.webp',
  './activity-records/20260825-111-surplus-donation/',
  './activity-records/20260825-111-surplus-donation/images/charity-paper-clay-visible-v2.jpg',
  './activity-records/20260825-111-surplus-donation/images/postal-giro-slip-20260825.jpg',
  './activity-records/20260825-111-surplus-donation/images/postal-giro-receipt-20260825.jpg',
  './assets/vendor/gsap-3.13.0.min.js',
  './assets/vendor/ScrollTrigger-3.13.0.min.js',
  './assets/icons/app-icon-192.png',
  './assets/icons/app-icon-512.png',
  './assets/icons/app-icon-maskable-512.png',
  './assets/icons/apple-touch-icon-180.png',
  './assets/art/global-protection-wall-home-banner.svg',
  './assets/art/prison-watch-day4-hearing-poster-clay-20260821-v2.webp',
  './assets/day4-verbatim-source-0.b64',
  './assets/day4-verbatim-source-1.b64',
  './hearing-records/prison-watch/kaikai-day4-20250428/day4-verbatim.js',
  './hearing-records/prison-watch/kaikai-day4-20250428/day4-crosscheck.js',
  './hearing-records/prison-watch/kaikai-day4-20250428/day4-location-note.js',
  './hearing-records/prison-watch/kaikai-day3-20250425/day3-reading-core-20260821.js',
  './hearing-records/prison-watch/kaikai-day5-20250429/day5.js',
  './assets/art/prison-watch-day5-selected-evidence-01-zh-hant-20260822.jpg',
  './assets/art/prison-watch-day5-selected-evidence-02-zh-hant-20260822.jpg',
  './assets/art/prison-watch-day5-selected-evidence-01-zh-hans-20260822.jpg',
  './assets/art/prison-watch-day5-selected-evidence-02-zh-hans-20260822.jpg',
  './assets/art/prison-watch-day5-selected-evidence-01-zh-hant-20260822-v3.jpg',
  './assets/art/prison-watch-day5-selected-evidence-01-zh-hans-20260822-v3.jpg',
  './assets/art/prison-watch-day5-selected-evidence-02-zh-hant-20260822-v3.jpg',
  './assets/art/prison-watch-day5-selected-evidence-02-zh-hans-20260822-v3.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(APP_SHELL.map(path => new URL(path, self.registration.scope).href)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
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

async function networkFirstNavigation(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (cacheable(response)) {
      await cache.put(request, response.clone());
      await trimRuntimeCache();
    }
    return response;
  } catch (_) {
    const exact = await cache.match(request);
    if (exact) return exact;
    const shell = await caches.open(SHELL_CACHE);
    const home = await shell.match(new URL('./', self.registration.scope).href);
    if (new URL(request.url).pathname === new URL(self.registration.scope).pathname && home) return home;
    return shell.match(new URL('./offline.html', self.registration.scope).href);
  }
}

async function networkFirstStatic(request) {
  const runtime = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request, { cache: 'no-cache' });
    if (cacheable(response)) {
      await runtime.put(request, response.clone());
      await trimRuntimeCache();
    }
    return response;
  } catch (_) {
    const exact = await runtime.match(request);
    if (exact) return exact;
    const shell = await caches.open(SHELL_CACHE);
    return shell.match(request) || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(async response => {
      if (cacheable(response)) {
        await cache.put(request, response.clone());
        await trimRuntimeCache();
      }
      return response;
    })
    .catch(() => null);
  if (cached) return cached;
  const networkResponse = await network;
  return networkResponse || Response.error();
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  const alwaysFresh =
    url.pathname.includes('/activity-records/20260825-111-surplus-donation/') ||
    url.pathname.endsWith('/assets/site.js') ||
    url.pathname.endsWith('/assets/site-base-20260823.js') ||
    url.pathname.endsWith('/assets/site-four-language-qa-20260823.js') ||
    url.pathname.endsWith('/assets/mobile-nav-view-counter-20260823.js') ||
    url.pathname.endsWith('/assets/home-gsap.js') ||
    url.pathname.endsWith('/assets/home-gsap-map-20260824.js') ||
    url.pathname.endsWith('/assets/home-gsap-base-20260823.js') ||
    url.pathname.endsWith('/assets/home-archive-layout-20260823.js') ||
    url.pathname.includes('/assets/home-ia-') ||
    url.pathname.includes('/assets/home-history-') ||
    url.pathname.endsWith('/assets/home-ia-v2-final.css') ||
    url.pathname.endsWith('/assets/global-protection-wall-portal.js') ||
    url.pathname.endsWith('/assets/global-protection-wall-portal.css') ||
    url.pathname.endsWith('/hearing-records/prison-watch/kaikai-day5-20250429/day5.js') ||
    url.pathname.includes('/assets/art/prison-watch-day5-selected-evidence-');

  if (alwaysFresh) {
    event.respondWith(networkFirstStatic(request));
    return;
  }

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
