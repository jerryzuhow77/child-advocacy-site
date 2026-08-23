const ALLOWED_ORIGINS = new Set([
  'https://jerryzuhow77.github.io',
  'https://cn.globalprotectionwall.com',
  'https://globalprotectionwall.com',
  'https://www.globalprotectionwall.com'
]);

function cors(request) {
  const origin = request.headers.get('Origin') || '';
  const allowOrigin = ALLOWED_ORIGINS.has(origin)
    ? origin
    : 'https://jerryzuhow77.github.io';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
    Vary: 'Origin'
  };
}

function json(request, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors(request),
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

function cleanKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:_./-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 220);
}

function truthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value || '').toLowerCase());
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(request) });
    }

    const origin = request.headers.get('Origin') || '';
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json(request, { error: 'origin_not_allowed' }, 403);
    }

    if (!env.PAGE_VIEWS) {
      return json(request, { error: 'missing_PAGE_VIEWS_binding' }, 500);
    }

    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/health') {
      return json(request, {
        ok: true,
        service: 'child-advocacy-page-views',
        binding: 'PAGE_VIEWS'
      });
    }

    if (url.pathname !== '/views') {
      return json(request, { error: 'not_found' }, 404);
    }

    let key = cleanKey(
      url.searchParams.get('key') ||
      url.searchParams.get('page') ||
      url.searchParams.get('path')
    );
    let shouldIncrement = request.method === 'POST' || truthy(url.searchParams.get('increment'));

    if (request.method === 'POST') {
      try {
        const body = await request.json();
        key = cleanKey(body.key || body.page || body.path || key);
        if (body.increment === false || body.increment === 0 || body.increment === '0') {
          shouldIncrement = false;
        }
      } catch (_) {
        // Query-string parameters remain valid when no JSON body is supplied.
      }
    } else if (request.method !== 'GET') {
      return json(request, { error: 'method_not_allowed' }, 405);
    }

    if (!key) {
      return json(request, { error: 'missing_key' }, 400);
    }

    const storageKey = `views:${key}`;
    let count = Number.parseInt((await env.PAGE_VIEWS.get(storageKey)) || '0', 10) || 0;

    if (shouldIncrement) {
      count += 1;
      await env.PAGE_VIEWS.put(storageKey, String(count));
    }

    return json(request, {
      ok: true,
      key,
      count,
      incremented: shouldIncrement
    });
  }
};
