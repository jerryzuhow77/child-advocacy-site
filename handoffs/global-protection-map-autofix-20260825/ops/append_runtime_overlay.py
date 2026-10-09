#!/usr/bin/env python3
"""Append a post-hydration globe repair overlay and CSS to existing production assets.

This mode intentionally does not alter React-rendered JSX before hydration. It can therefore
be used as a narrow live hotfix while preserving the server render, APIs, authentication,
moderation, and stored messages.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from typing import Any

PATCH_ID = "global-protection-map-autofix-20260825"

OVERLAY_JS = r'''
;(()=>{
  const PATCH_ID="global-protection-map-autofix-20260825";
  if(globalThis.__GLOBAL_PROTECTION_MAP_AUTOFIX_20260825__)return;
  globalThis.__GLOBAL_PROTECTION_MAP_AUTOFIX_20260825__=true;
  const SVG_NS="http://www.w3.org/2000/svg";
  const LONDON={x:102,y:163,dx:-150,dy:-12};
  let scheduled=false;

  const localeCopy=()=>{
    const lang=(document.documentElement.lang||"zh-Hant").toLowerCase();
    if(lang.startsWith("zh-hans")||lang.startsWith("zh-cn"))return{label:"地区",all:"全部",aria:"按地区筛选留言",regions:{GB:"英国・伦敦",TW:"台湾",CN:"大陆"}};
    if(lang.startsWith("ja"))return{label:"地域",all:"すべて",aria:"地域でメッセージを絞り込む",regions:{GB:"英国・ロンドン",TW:"台湾",CN:"中国大陸"}};
    if(lang.startsWith("en"))return{label:"Region",all:"All",aria:"Filter messages by region",regions:{GB:"London, UK",TW:"Taiwan",CN:"Mainland China"}};
    return{label:"地區",all:"全部",aria:"依地區篩選留言",regions:{GB:"英國・倫敦",TW:"台灣",CN:"大陸"}};
  };
  const labelFromMarker=(marker)=>{
    const aria=marker?.getAttribute("aria-label")||"";
    return aria.split("：")[0].split(":")[0].trim();
  };
  const countFromMarker=(marker)=>{
    const aria=marker?.getAttribute("aria-label")||"";
    const match=aria.match(/(?:：|:)\s*(\d+)/);
    return match?Number(match[1]):Number(marker?.querySelector(".mark-count-label")?.textContent||0);
  };
  const codeFromLabel=(label,index)=>{
    if(/(?:London|倫敦|伦敦|英国|英國)/i.test(label))return"GB";
    if(/(?:台灣|台湾|Taiwan)/i.test(label))return"TW";
    if(/(?:大陸|大陆|China)/i.test(label))return"CN";
    return`REGION-${index+1}`;
  };
  const firstTrackMarkers=()=>{
    const wrappers=Array.from(document.querySelectorAll(".globe-track > g"));
    if(wrappers.length){
      const direct=Array.from(wrappers[0].children).filter((node)=>node.classList?.contains("region-map-mark"));
      if(direct.length)return direct;
    }
    return Array.from(document.querySelectorAll('.region-map-mark[aria-label]'));
  };
  const allTrackMarkerGroups=()=>Array.from(document.querySelectorAll(".globe-track > g")).map((wrapper)=>
    Array.from(wrapper.children).filter((node)=>node.classList?.contains("region-map-mark"))
  );

  const ensureHitTarget=(marker)=>{
    if(!marker||marker.querySelector(".mark-hit-overlay"))return;
    const core=marker.querySelector(".mark-core");
    if(!core)return;
    const circle=document.createElementNS(SVG_NS,"circle");
    circle.setAttribute("class","mark-hit-overlay");
    circle.setAttribute("cx",core.getAttribute("cx")||"0");
    circle.setAttribute("cy",core.getAttribute("cy")||"0");
    circle.setAttribute("r","30");
    circle.setAttribute("aria-hidden","true");
    marker.insertBefore(circle,marker.firstChild);
  };

  const correctLondon=()=>{
    const groups=allTrackMarkerGroups();
    const first=groups[0]||firstTrackMarkers();
    const londonIndex=first.findIndex((marker)=>/(?:London|倫敦|伦敦)/i.test(labelFromMarker(marker)));
    if(londonIndex<0)return;
    for(const group of groups.length?groups:[first]){
      const marker=group[londonIndex];
      if(!marker)continue;
      marker.dataset.mapAutofixRegion="GB";
      marker.dataset.mapAutofixX=String(LONDON.x);
      marker.dataset.mapAutofixY=String(LONDON.y);
      marker.setAttribute("transform",`translate(${LONDON.dx} ${LONDON.dy})`);
    }
  };

  const markerData=()=>firstTrackMarkers().map((marker,index)=>{
    const label=labelFromMarker(marker);
    return{marker,label,count:countFromMarker(marker),code:codeFromLabel(label,index)};
  }).filter((entry)=>entry.label);

  const syncSelect=()=>{
    const select=document.querySelector('.region-filter-select[data-map-autofix="20260825"] select');
    if(!select)return;
    const activeLabel=document.querySelector(".region-filter-chip span")?.textContent?.trim()||"";
    const matching=Array.from(select.options).find((option)=>option.dataset.regionLabel===activeLabel);
    select.value=matching?.value||"all";
  };

  const selectRegion=(select)=>{
    if(select.value==="all"){
      document.querySelector(".region-filter-chip")?.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));
      setTimeout(schedule,0);
      return;
    }
    const option=select.selectedOptions[0];
    const targetLabel=option?.dataset.regionLabel||"";
    const target=firstTrackMarkers().find((marker)=>labelFromMarker(marker)===targetLabel);
    target?.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true}));
    setTimeout(schedule,0);
  };

  const ensureRegionSelect=()=>{
    const bar=document.querySelector(".map-section .filter-bar");
    if(!bar)return;
    let wrapper=bar.querySelector(':scope > .region-filter-select[data-map-autofix="20260825"]');
    const copy=localeCopy();
    if(!wrapper){
      wrapper=document.createElement("label");
      wrapper.className="region-filter-select";
      wrapper.dataset.mapAutofix="20260825";
      const caption=document.createElement("span");
      const select=document.createElement("select");
      select.addEventListener("change",()=>selectRegion(select));
      wrapper.append(caption,select);
      const search=bar.querySelector(".wall-search");
      if(search)search.insertAdjacentElement("afterend",wrapper);
      else bar.prepend(wrapper);
    }
    const caption=wrapper.querySelector("span");
    const select=wrapper.querySelector("select");
    caption.textContent=copy.label;
    select.setAttribute("aria-label",copy.aria);
    const data=markerData();
    const signature=JSON.stringify(data.map(({code,label,count})=>[code,label,count]));
    if(select.dataset.signature!==signature){
      const previous=select.value;
      select.replaceChildren();
      const all=document.createElement("option");
      all.value="all";
      all.textContent=copy.all;
      select.appendChild(all);
      data.forEach(({code,label,count})=>{
        const option=document.createElement("option");
        option.value=code;
        option.dataset.regionLabel=label;
        option.textContent=`${copy.regions?.[code]||label}（${count}）`;
        select.appendChild(option);
      });
      select.dataset.signature=signature;
      select.value=Array.from(select.options).some((option)=>option.value===previous)?previous:"all";
    }
    syncSelect();
  };

  const enforceMapVisibility=()=>{
    const stage=document.querySelector(".map-section .map-stage");
    if(!stage)return;
    stage.dataset.mapAutofixVisible="true";
    stage.style.setProperty("opacity","1","important");
    stage.style.setProperty("visibility","visible","important");
  };

  const apply=()=>{
    scheduled=false;
    const markers=Array.from(document.querySelectorAll(".region-map-mark"));
    markers.forEach(ensureHitTarget);
    correctLondon();
    ensureRegionSelect();
    enforceMapVisibility();
  };
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(apply);
  }
  const start=()=>{
    apply();
    const observer=new MutationObserver(schedule);
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["class","aria-label"]});
    document.addEventListener("click",(event)=>{
      if(event.target instanceof Element&&event.target.closest(".region-map-mark,.region-filter-chip"))setTimeout(schedule,0);
    },true);
    window.addEventListener("resize",schedule,{passive:true});
    window.setInterval(schedule,1500);
  };
  const deferredStart=()=>window.setTimeout(start,1500);
  if(document.readyState==="complete")deferredStart();
  else window.addEventListener("load",deferredStart,{once:true});
})();
'''.strip()

CSS_APPEND = r'''
/* global-protection-map-autofix-20260825 */
.site .map-section .map-stage,
.site .map-section .map-stage[data-map-autofix-visible="true"] {
  opacity: 1 !important;
  visibility: visible !important;
}
.region-map-mark {
  cursor: pointer;
  touch-action: manipulation;
}
.region-map-mark .mark-hit-overlay {
  fill: transparent;
  stroke: transparent;
  stroke-width: 1px;
  pointer-events: all;
}
.region-filter-select[data-map-autofix="20260825"] {
  color: var(--ink-soft, #756b62);
  border-top: 1px solid rgba(90, 69, 54, .1);
  display: grid;
  gap: 7px;
  width: 100%;
  padding: 11px 0 1px;
}
.region-filter-select[data-map-autofix="20260825"] > span {
  color: #8c7a6a;
  letter-spacing: .16em;
  font-size: 8px;
  font-weight: 700;
}
.region-filter-select[data-map-autofix="20260825"] select {
  color: #294f58;
  cursor: pointer;
  background: rgba(255, 255, 255, .9);
  border: 1px solid rgba(23, 59, 99, .17);
  border-radius: 999px;
  width: 100%;
  min-height: 36px;
  padding: 0 32px 0 12px;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  outline: none;
}
.region-filter-select[data-map-autofix="20260825"] select:hover,
.region-filter-select[data-map-autofix="20260825"] select:focus-visible {
  border-color: rgba(23, 59, 99, .48);
  box-shadow: 0 0 0 3px rgba(23, 59, 99, .11);
}
@media (min-width: 1100px) {
  .site .map-section .map-stage {
    min-height: 850px !important;
  }
}
@media (max-width: 980px) {
  .region-filter-select[data-map-autofix="20260825"] {
    border-top: 0;
    flex: 0 0 180px;
    min-width: 180px;
    padding: 10px 0;
  }
  .region-filter-select[data-map-autofix="20260825"] > span {
    font-size: 9px;
  }
}
'''.strip()


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--js", required=True, type=Path)
    parser.add_argument("--css", required=True, type=Path)
    parser.add_argument("--out-js", type=Path)
    parser.add_argument("--out-css", type=Path)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--check-node", action="store_true")
    args = parser.parse_args()
    out_js = args.out_js or args.js
    out_css = args.out_css or args.css

    js_before = args.js.read_text(encoding="utf-8")
    css_before = args.css.read_text(encoding="utf-8")
    js_after = js_before if PATCH_ID in js_before else js_before.rstrip() + "\n" + OVERLAY_JS + "\n"
    css_after = css_before if PATCH_ID in css_before else css_before.rstrip() + "\n" + CSS_APPEND + "\n"

    out_js.parent.mkdir(parents=True, exist_ok=True)
    out_css.parent.mkdir(parents=True, exist_ok=True)
    out_js.write_text(js_after, encoding="utf-8")
    out_css.write_text(css_after, encoding="utf-8")

    report: dict[str, Any] = {
        "patch_id": PATCH_ID,
        "mode": "post_hydration_runtime_overlay",
        "react_render_structure_changed": False,
        "api_or_data_changed": False,
        "london_target": {"x": 102, "y": 163, "translation": [-150, -12]},
        "js_before_sha256": sha256_text(js_before),
        "js_after_sha256": sha256_text(js_after),
        "css_before_sha256": sha256_text(css_before),
        "css_after_sha256": sha256_text(css_after),
        "js_overlay": "already_present" if js_after == js_before else "appended",
        "css_overlay": "already_present" if css_after == css_before else "appended",
    }
    if args.check_node:
        subprocess.run(["node", "--check", str(out_js)], check=True)
        report["node_syntax"] = "pass"
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
