#!/usr/bin/env python3
"""Generate full Simplified Chinese editions from the current Traditional source.

Requires opencc-python-reimplemented. Assets stay on their original stable routes;
page-local JavaScript is converted alongside its document, including loaded records.
"""
import json
import re
from pathlib import Path
from urllib.parse import urljoin,urlsplit
from opencc import OpenCC

ROOT=Path(__file__).resolve().parents[1]
BASE='/child-advocacy-site/'
ORIGIN='https://jerryzuhow77.github.io'
cc=OpenCC('t2s')
routes=json.loads((ROOT/'data/four-language-routes.json').read_text())['routes']
for route,editions in routes.items():
    if 'zh-Hant' not in editions: continue
    target=editions.get('zh-Hans')
    if target and '?' in target: continue
    refresh={'hearing-records/prison-watch/kaikai-final-chapter/witnesses/',
             'hearing-records/prison-watch/kaikai-final-chapter/',
             'features/social-observation/guarantor-status/'}
    if target and route not in refresh and not target.startswith(BASE+'zh-Hans/'): continue
    source_url=editions['zh-Hant']
    source=ROOT/source_url.removeprefix(BASE)/'index.html'
    target=target or BASE+'zh-Hans/'+route
    dest=ROOT/target.removeprefix(BASE)/'index.html'
    source_text=source.read_text()
    # Keep URL spelling and fragment IDs unchanged by script conversion.
    saved={}
    def stash(m):
        key=f'__CPA_URL_{len(saved)}__';saved[key]=m.group(2)
        return m.group(1)+key+m.group(3)
    text=re.sub(r'((?:href|src|poster|action)=["\'])([^"\']*)(["\'])',stash,source_text)
    text=cc.convert(text)
    for key,value in saved.items(): text=text.replace(key,value)
    text=re.sub(r'(<html\b[^>]*lang=["\'])[^"\']+',r'\1zh-Hans',text,count=1)
    text=text.replace('"inLanguage": "zh-Hant"','"inLanguage": "zh-Hans"')
    def resolve(m):
        attr,quote,value=m.group(1),m.group(2),m.group(3)
        if not value or value.startswith(('#','data:','mailto:','tel:','javascript:')): return m.group(0)
        absolute=urljoin(ORIGIN+source_url,value)
        parts=urlsplit(absolute)
        if parts.netloc!='jerryzuhow77.github.io': return m.group(0)
        path=parts.path
        # Translate local runtime content rather than loading Traditional fallback text.
        if attr=='src' and path.endswith('.js') and path.startswith(source_url):
            original=ROOT/path.removeprefix(BASE)
            if original.is_file():
                output=dest.parent/original.name
                output.parent.mkdir(parents=True,exist_ok=True)
                js=cc.convert(original.read_text())
                js=js.replace('const lang=new URLSearchParams(location.search).get("lang")==="zh-Hans"?"zh-Hans":"zh-Hant";', 'const lang="zh-Hans";')
                js=re.sub(r'((?:src|href)=["\'])(\.\./[^"\']+)', lambda m:m.group(1)+urlsplit(urljoin(ORIGIN+source_url,m.group(2))).path, js)
                output.write_text(js)
                path=target+original.name
        value=path+('?' + parts.query if parts.query else '')+('#'+parts.fragment if parts.fragment else '')
        return attr+'='+quote+value+quote
    text=re.sub(r'\b(href|src|poster|action|data-src-hant|data-src-hans|data-hant-src|data-hans-src|data-hant-href|data-hans-href|data-text-source)=(["\'])([^"\']*)\2',resolve,text)
    text=re.sub(r'(<link\b[^>]*rel=["\']canonical["\'][^>]*href=["\'])[^"\']+',lambda m:m.group(1)+ORIGIN+target,text)
    text=re.sub(r'(<meta\b[^>]*(?:property|name)=["\']og:url["\'][^>]*content=["\'])[^"\']+',lambda m:m.group(1)+ORIGIN+target,text)
    text=text.replace('"mainEntityOfPage": "'+ORIGIN+source_url+'"','"mainEntityOfPage": "'+ORIGIN+target+'"')
    dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text)
    print(dest.relative_to(ROOT))
