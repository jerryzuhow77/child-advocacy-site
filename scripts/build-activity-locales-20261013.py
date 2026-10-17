#!/usr/bin/env python3
"""Create full activity translations without changing source images or links."""
import json
import re
from pathlib import Path
from urllib.parse import urlsplit
from bs4 import BeautifulSoup, Comment, Doctype
from opencc import OpenCC

ROOT=Path(__file__).resolve().parents[1]
BASE='/child-advocacy-site/'
manifest_path=ROOT/'data/four-language-routes.json'
manifest=json.loads(manifest_path.read_text())
words={}
for filename in ('home-locales-20261013.tsv','activity-locales-20261013.tsv'):
    for line in (ROOT/'scripts'/filename).read_text().splitlines():
        source,en,ja=line.split('\t');words[source]={'en':en,'ja':ja}
converter=OpenCC('t2s')
routes=['news/anti-child-abuse-rally-20261017/','activity-records/20261022-liu-zongxin-hearing/']

def alternates(soup,editions):
    for e in soup.select('link[rel="alternate"][hreflang]'): e.decompose()
    for locale,url in editions.items():
        e=soup.new_tag('link',attrs={'rel':'alternate','hreflang':locale,'href':url if url.startswith('http') else 'https://jerryzuhow77.github.io'+url})
        soup.head.append(e)

for route in routes:
    source_path=ROOT/route/'index.html'
    source=source_path.read_text()
    if 'liu-zongxin' in route:
        source=source.replace('（官方庭期待核）','').replace('10/22時間與法庭為本站依提供資訊整理，尚待官方核對；','')
    editions={l:BASE+route+('' if l=='zh-Hant' else l+'/') for l in ('zh-Hant','zh-Hans','en','ja')}
    editions['zh-Hans']='https://cn.globalprotectionwall.com'+editions['zh-Hans']
    manifest['routes'][route]=editions
    for locale in ('zh-Hant','zh-Hans','en','ja'):
        soup=BeautifulSoup(source,'html.parser')
        alternates(soup,editions)
        canonical=soup.select_one('link[rel="canonical"]')
        if canonical is None:
            canonical=soup.new_tag('link',rel='canonical')
            soup.head.append(canonical)
        canonical['href']=editions[locale] if locale=='zh-Hans' else 'https://jerryzuhow77.github.io'+editions[locale]
        if locale!='zh-Hant':
            soup.html['lang']=locale
            for script in soup.select('script:not([src])'): script.decompose()
            missing=set()
            for node in soup.find_all(string=True):
                if isinstance(node,(Comment,Doctype)) or node.parent.name in ('script','style'):continue
                text=str(node).strip()
                if locale=='zh-Hans':node.replace_with(converter.convert(str(node)));continue
                if text in words:node.replace_with(words[text][locale])
                elif node.parent.name=='title':
                    heading=soup.h1.get_text(strip=True)
                    node.replace_with(words.get(heading,{'en':'Child protection activity','ja':'児童保護活動'})[locale]+' | '+words['護童行動聯盟'][locale])
                elif re.search('[\u3400-\u9fff]',text):missing.add(text)
            if missing: raise SystemExit(f'{route} {locale}: missing translations {missing}')
            for tag in soup.find_all(True):
                for attr in ('href','src'):
                    value=tag.get(attr,'')
                    if value.startswith('../../'): tag[attr]=BASE+value[6:]
                if tag.has_attr('alt') and tag['alt']:
                    tag['alt']=converter.convert(tag['alt']) if locale=='zh-Hans' else ('Original Chinese event poster; see translated details on this page' if locale=='en' else '中国語の活動ポスター。翻訳された詳細は本文をご覧ください')
            desc=soup.select_one('meta[name="description"]')
            if desc:desc['content']=converter.convert(desc['content']) if locale=='zh-Hans' else soup.h1.get_text(' ',strip=True)
            flag=soup.new_tag('script',attrs={'data-cpa-four-language-toolbar-flag':''});flag.string='window.__cpaFourLanguageToolbar=true;';soup.head.append(flag)
        # Correct the supplied-date qualifier in all four editions, including the source.
        if 'liu-zongxin' in route and locale in ('zh-Hant','zh-Hans'):
            qualifier='官方庭期待核' if locale=='zh-Hant' else '官方庭期待核'
            soup.h1.append('（'+qualifier+'）')
            notice=soup.select_one('.card strong')
            notice.string=('10/22時間與法庭為本站依提供資訊整理，尚待官方核對；'+notice.get_text())
            if locale=='zh-Hans':notice.string=converter.convert(notice.string)
            soup.title.string=soup.h1.get_text()+'｜'+('護童行動聯盟' if locale=='zh-Hant' else '护童行动联盟')
            description=soup.h1.get_text()+'；出發前請確認法院公告。'
            soup.select_one('meta[name="description"]')['content']=converter.convert(description) if locale=='zh-Hans' else description
        path=source_path if locale=='zh-Hant' else ROOT/route/locale/'index.html'
        path.parent.mkdir(parents=True,exist_ok=True);path.write_text(str(soup))
        print('Built',path.relative_to(ROOT))
manifest['version']='20261013-activity-locales'
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+'\n')

memorial_words={}
for line in (ROOT/'scripts/memorial-locales-20261013.tsv').read_text().splitlines():
    zh,en,ja=line.split('\t');memorial_words[zh]={'en':en,'ja':ja}
for locale in ('en','ja'):
    route='features/social-observation/kai-kai-remember/'
    path=ROOT/route/locale/'index.html'
    soup=BeautifulSoup((ROOT/route/'index.html').read_text(),'html.parser')
    soup.html['lang']=locale
    for node in soup.find_all(string=True):
        if isinstance(node,(Comment,Doctype)) or node.parent.name in ('style','script'):continue
        text=str(node).strip()
        if text in memorial_words:node.replace_with(memorial_words[text][locale])
        elif re.search('[\u3400-\u9fff]',text) and text not in ('繁','简','日'):raise SystemExit('Missing memorial translation: '+text)
    for a,language in zip(soup.select('.langs a'),('zh-Hant','zh-Hans','en','ja')):
        a['href']=urlsplit(manifest['routes'][route][language]).path
    soup.img['src']='../kai-kai.jpg'
    soup.img['alt']='A newborn sleeping quietly in a bassinet' if locale=='en' else 'ベビーベッドで静かに眠る新生児'
    gsap=soup.select_one('script[src*="gsap"]');gsap['src']=BASE+'assets/vendor/gsap-3.13.0.min.js'
    for script in soup.select('script:not([src]):not([data-cpa-four-language-toolbar-flag])'):
        script.string="addEventListener('load',()=>{if(window.gsap&&!matchMedia('(prefers-reduced-motion:reduce)').matches)gsap.from('main>*',{opacity:0,y:24,stagger:.12,duration:.8,ease:'power2.out'});});"
    if not soup.head:
        head=soup.new_tag('head');body=soup.new_tag('body')
        for child in list(soup.html.contents):
            (head if getattr(child,'name',None) in ('meta','title','style','link') else body).append(child.extract())
        soup.html.append(head);soup.html.append(body)
    alternates(soup,manifest['routes'][route])
    for marker,name,attrs in [
        ('data-cpa-four-language-toolbar-style','link',{'rel':'stylesheet','href':BASE+'assets/four-language-toolbar-20260901.css?v=20260909-5'}),
        ('data-cpa-four-language-toolbar-flag','script',{}),
        ('data-cpa-four-language-toolbar-script','script',{'src':BASE+'assets/four-language-toolbar-20260901.js?v=20261013-locales'})]:
        if not soup.select_one('['+marker+']'):
            tag=soup.new_tag(name,attrs={marker:'',**attrs})
            if marker.endswith('-flag'):tag.string='window.__cpaFourLanguageToolbar=true;'
            (soup.head if marker.endswith(('-style','-flag')) else soup.body).append(tag)
    path.write_text(str(soup))
    print('Repaired',path.relative_to(ROOT))
