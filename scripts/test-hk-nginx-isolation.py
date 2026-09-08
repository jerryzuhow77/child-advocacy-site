"""Exercise the exact workflow Python, with a temporary nginx tree and mocked reload."""
from pathlib import Path
import tempfile
import subprocess
from unittest.mock import patch
import yaml

ROOT = Path(__file__).resolve().parents[1]
workflow = yaml.safe_load((ROOT / '.github/workflows/deploy-hk-site-mirror.yml').read_text())
step = next(s for s in workflow['jobs']['deploy']['steps'] if s.get('name') == 'Install isolated nginx mirror route')
code = step['run'].split("<<'PY'\n", 1)[1].rsplit('\nPY', 1)[0]
compile(code, 'remote-nginx', 'exec')
other = '''server {
    server_name other.example;
    location ^~ /cases/ { deny all; }
}
'''
protected = '''    location / { proxy_pass http://wall; }
    location /api/ { proxy_pass http://api; }
    location ^~ /cases/private/ { deny all; }
    location = /cases/exact { return 403; }
    location ~ ^/cases/secret/ { deny all; }
    location /quoted { return 200 "brace } and {"; }
    # a closing brace in a comment: }
'''
redirect = '''server {
    listen 80;
    server_name cn.globalprotectionwall.com;
    return 301 https://$host$request_uri;
}
'''
original = other + redirect + 'server {\n    listen 443 ssl;\n    server_name cn.globalprotectionwall.com;\n' + protected + '''    location ^~ /cases/ { root /old; }
    location = /child-advocacy-site { return 301 /old/; }
    location ^~ /child-advocacy-site/ { root /old; }
}
'''
with tempfile.TemporaryDirectory() as temp:
    root = Path(temp)
    enabled = root / 'enabled'
    enabled.mkdir()
    target = enabled / 'site.conf'
    target.write_text(original)
    test_code = code.replace('/etc/nginx/sites-enabled', str(enabled)).replace('/etc/nginx/conf.d', str(root/'conf.d')).replace('/var/backups/child-advocacy-nginx', str(root/'backups'))
    for attempt in range(2):
        with patch('subprocess.run') as run:
            exec(compile(test_code, 'remote-nginx', 'exec'), {})
            assert run.call_count == 2
        result = target.read_text()
        assert other in result and redirect in result and protected in result
        assert result.count('location /cases/ {') == 0
        assert result.count('location ^~ /cases/ {') == 2  # target mirror plus unrelated host
        assert result.count('location = /child-advocacy-site {') == 1
        assert result.count('location ^~ /child-advocacy-site/ {') == 1
        assert '/old' not in result
    before = target.read_text()
    with patch('subprocess.run', side_effect=[subprocess.CalledProcessError(1, 'nginx -t'), None, None]):
        try:
            exec(compile(test_code, 'remote-nginx', 'exec'), {})
        except subprocess.CalledProcessError:
            pass
        else:
            raise AssertionError('Expected validation failure')
    assert target.read_text() == before
print('PASS: Python syntax, root/API/vhost/exact/prefix/regex isolation, quoted braces, repeated application and rollback')
