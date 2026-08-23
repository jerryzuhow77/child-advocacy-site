# Global Protection runtime probe result

- Run: `32639386382`
- Completed: 2026-08-23T12:26:30Z
- Mode: read-only
- Target: `cn.globalprotectionwall.com`
- Origin: `150.109.69.104`
- SSH account: `ubuntu`

## DNS

Both Cloudflare and Google public resolvers returned:

```text
cn.globalprotectionwall.com. 300 IN A 150.109.69.104
```

## Origin reachability

```text
22 open
80 open
443 open
```

HTTP result:

```text
HTTP/1.1 301 Moved Permanently
Server: nginx/1.24.0 (Ubuntu)
Location: https://cn.globalprotectionwall.com/
```

HTTPS result with the intended Host/SNI:

```text
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: text/html; charset=utf-8
Vary: RSC, Accept, Next-Router-State-Tree, Next-Router-Prefetch,
      Next-Router-Segment-Prefetch, Next-Url,
      X-Vinext-Interception-Context, X-Vinext-Mounted-Slots,
      X-Vinext-Rsc-Render-Mode
```

## Worker

`global-protection-sync.jerryzuhow77.workers.dev` returned `403 Forbidden` from the GitHub runner. This matches the Worker rule that only permits the Hong Kong origin IP.

## Existing GitHub Secrets

All checked deployment secrets were absent:

- SSH private key: absent
- Tencent app path: absent
- Cloudflare API token: absent
- Cloudflare zone ID: absent

SSH was therefore not attempted. No DNS or production mutation occurred.
