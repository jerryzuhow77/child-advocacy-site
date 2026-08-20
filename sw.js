'use strict';

const VERSION = '2026-08-20-visitor-prompt-8h-v6';
const CACHE_PREFIX = 'cpa-alliance-pwa-';
const SHELL_CACHE = `${CACHE_PREFIX}shell-${VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}runtime-${VERSION}`;
const MAX_RUNTIME_ITEMS = 120;

const APP_SHELL = [
  './',
  './offline.html',
  './manifest.webmanifest',
  './assets/pwa-install.css',
  './assets/pwa-install.js',
  './assets/home-gsap.css',
  './assets/global-protection-home.css',
  './assets/visitor-submission.js',
  './assets/home-gsap.js',
  './assets/activity-impact.js',
  './assets/vendor/gsap-3.13.0.min.js',
  './assets/vendor/ScrollTrigger-3.13.0.min.js',
  './assets/icons/app-icon-192.png',
  './assets/icons/app-icon-512.png',
  './assets/icons/app-icon-maskable-512.png',
  './assets/icons/apple-touch-icon-180.png',
  './assets/art/global-protection-wall-home-banner.svg'
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

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
