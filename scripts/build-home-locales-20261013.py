#!/usr/bin/env python3
"""Build equivalent static EN/JA homepages from the current Chinese homepage."""
import json
import re
from pathlib import Path
from urllib.parse import urlsplit
from bs4 import BeautifulSoup, Comment, Doctype

ROOT = Path(__file__).resolve().parents[1]
BASE = '/child-advocacy-site/'
ROUTES = json.loads((ROOT/'data/four-language-routes.json').read_text())['routes']
WORDS = {}
for line in (ROOT/'scripts/home-locales-20261013.tsv').read_text().splitlines():
    source, en, ja = line.split('\t')
    WORDS[source] = {'en': en, 'ja': ja}

source = (ROOT/'index.html').read_text()
for locale in ('en', 'ja'):
    soup = BeautifulSoup(source, 'html.parser')
    for node in soup.select('#home-static-region-20261012, #home-static-locale-20261012'):
        node.decompose()
    soup.html['lang'] = locale
    soup.body['data-home-locale'] = locale
    unresolved = set()
    for node in soup.find_all(string=True):
        if isinstance(node, (Comment, Doctype)) or node.parent.name in ('script', 'style', 'title'):
            continue
        text = str(node).strip()
        if text in WORDS:
            node.replace_with(WORDS[text][locale])
        elif re.search('[\u3400-\u9fff]', text) and text not in ('繁中', '简中', '日本語'):
            unresolved.add(text)
    if unresolved:
        raise SystemExit('Missing homepage translations: '+repr(sorted(unresolved)))
    title = {'en':'Child Protection Action Alliance | Child safety, court records and action', 'ja':'児童保護行動連盟｜子どもの安全・司法記録・活動'}[locale]
    soup.title.string = title
    for meta in soup.select('meta[content]'):
        key = meta.get('name', meta.get('property',''))
        if 'title' in key: meta['content'] = title
        elif 'description' in key:
            meta['content'] = WORDS['持續關注兒少安全，記錄司法程序，讓每一次守護都留下行動。'][locale]
    for node in soup.select('[aria-label]'):
        original = node['aria-label']
        node['aria-label'] = WORDS.get(original, {'en':'Site navigation', 'ja':'サイト案内'})[locale]
    for img in soup.select('img[alt]'):
        alt=img['alt']
        if not alt: continue
        # Preserve the subject and the artistic-image qualifier in accessible text.
        alt=alt.split('｜藝術意象')[0]
        img['alt']=WORDS.get(alt, {'en':'Child protection illustration', 'ja':'児童保護のイメージ'})[locale]
        if '藝術意象' in img.get('data-hans-alt',''):
            img['alt'] += {'en':' (artistic illustration, not an event photograph)', 'ja':'（芸術的イメージ。事件現場の写真ではありません）'}[locale]
    for tag in soup.find_all(True):
        for attr in list(tag.attrs):
            if attr.startswith('data-hans'): del tag[attr]
        for attr in ('href','src','value'):
            value=tag.get(attr,'')
            if value.startswith('./'):
                relative=value[2:]
                path=urlsplit(relative).path
                route=ROUTES.get(path.rstrip('/')+'/' if path else '')
                if attr=='href' and route and locale in route:
                    tag[attr]=urlsplit(route[locale]).path + (('#'+urlsplit(relative).fragment) if urlsplit(relative).fragment else '')
                else:
                    tag[attr]=BASE+relative
                    if attr=='href' and route and locale not in route:
                        tag['hreflang']='zh-Hant'
                        note=soup.new_tag('small',attrs={'class':'edition-note'})
                        note.string={'en':'Chinese edition', 'ja':'中国語版'}[locale]
                        tag.append(note)
        if tag.name=='style' and tag.string:
            tag.string=tag.string.replace("url('./", "url('/child-advocacy-site/")
    select=soup.select_one('.cpa-language-select')
    destinations={'zh-Hant':BASE+'?lang=zh-Hant','zh-Hans':BASE+'?lang=zh-Hans','en':BASE+'en/','ja':BASE+'ja/'}
    for language, option in zip(('zh-Hant','zh-Hans','en','ja'),select.select('option')):
        option['value']=destinations[language]
        if language==locale: option['selected']=''
    # Region is kept for all language switches. Explicit regional footer links remain cross-region.
    for a in soup.select('.footer-regions a')[-2:]:
        a['href']=BASE+('en/' if a.get_text()=='English' else 'ja/')
    flag=soup.new_tag('script', attrs={'data-cpa-four-language-toolbar-flag':''})
    flag.string="window.__cpaFourLanguageToolbar=true;document.documentElement.classList.add('cpa-four-language-toolbar-active');"
    soup.head.append(flag)
    soup.select_one('#home-static-layout-20261012')['data-cpa-four-language-toolbar-style']=''
    script=soup.new_tag('script',attrs={'data-cpa-four-language-toolbar-script':''})
    script.string="document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.mobile-menu').open=false));window.__cpaStaticHomeReady=true;"
    soup.body.append(script)
    path=ROOT/locale/'index.html'
    path.write_text(str(soup))
    print('Built',path.relative_to(ROOT))
