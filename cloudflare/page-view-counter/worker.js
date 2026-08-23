const ALLOWED_ORIGINS = new Set([
  'https://jerryzuhow77.github.io',
  'https://cn.globalprotectionwall.com',
  'https://globalprotectionwall.com',
  'https://www.globalprotectionwall.com'
]);

function cors(request) {
  const origin = request.headers.get('Origin') || '';
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://jerryzuhow77.github.io';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'Cache-Control': 'no-store'
  };
}

function json(request, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors(request), 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function cleanKey(value) {
  return String(value || '').trim().replace(/[^a-zA-Z0-9:_./-]/g, '_').slice(0, 220);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(request) });
    const origin = request.headers.get('Origin') || '';
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json(request, { error: 'origin_not_allowed' }, 403);

    const url = new URL(request.url);
    if (url.pathname === '/health') return json(request, { ok: true, service: 'cpa-page-views' });
    if (url.pathname !== '/views') return json(request, { error: 'not_found' }, 404);

    let key = cleanKey(url.searchParams.get('key'));
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        key = cleanKey(body.key || key);
      } catch (_) {}
    }
    if (!key) return json(request, { error: 'missing_key' }, 400);

    const storageKey = 'views:' + key;
    let count = parseInt((await env.PAGE_VIEWS.get(storageKey)) || '0', 10) || 0;

    if (request.method === 'POST') {
      count += 1;
      await env.PAGE_VIEWS.put(storageKey, String(count));
    } else if (request.method !== 'GET') {
      return json(request, { error: 'method_not_allowed' }, 405);
    }

    return json(request, { key, count });
  }
};
