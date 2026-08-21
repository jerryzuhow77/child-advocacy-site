#!/usr/bin/env python3
"""Add classical quotations and gentle modern readings to every Qiqi chapter.

The script updates all four public language versions together and appends one
shared, responsive visual treatment to the feature stylesheet. Classical lines
are explicitly labelled as literary reflection rather than case evidence.
"""

from __future__ import annotations

import html as html_lib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_PATH = ROOT / "assets/fujian-qiqi-feature.css"
PAGE_PATHS = {
    "zh-Hant": ROOT / "historical-cases/regions/mainland-china/fujian-qiqi/index.html",
    "zh-Hans": ROOT / "zh-hans/historical-cases/regions/mainland-china/fujian-qiqi/index.html",
    "en": ROOT / "en/historical-cases/regions/mainland-china/fujian-qiqi/index.html",
    "ja": ROOT / "ja/historical-cases/regions/mainland-china/fujian-qiqi/index.html",
}
CSS_MARKER = "/* === Classical inscriptions and gentle modern readings · 2026-08-21 === */"

ACT_KEYS = ("act-1", "act-2", "act-3", "act-4", "act-5")
CHAPTER_KEYS = ("waiting", "signals", "court-findings", "justice", "protection")
ALL_KEYS = ACT_KEYS + CHAPTER_KEYS + ("sources",)

LABELS = {
    "zh-Hant": {
        "eyebrow": "CLASSICAL · 古典題簽與現代解說",
        "disclaimer": "文學映照 · 非案件證據",
        "reading": "溫婉解說",
        "aria": "古典詞句與對應的現代解說",
        "quote_lang": "zh-Hant",
    },
    "zh-Hans": {
        "eyebrow": "CLASSICAL · 古典题签与现代解说",
        "disclaimer": "文学映照 · 非案件证据",
        "reading": "温婉解说",
        "aria": "古典词句与对应的现代解说",
        "quote_lang": "zh-Hans",
    },
    "en": {
        "eyebrow": "CLASSICAL · CLASSICAL LINE & MODERN READING",
        "disclaimer": "Literary reflection · not case evidence",
        "reading": "Modern reading",
        "aria": "Classical line and corresponding modern reading",
        "quote_lang": "zh-Hant",
    },
    "ja": {
        "eyebrow": "CLASSICAL · 古典のことばと現代の読み解き",
        "disclaimer": "文学的な照応 · 事件資料ではありません",
        "reading": "現代の読み解き",
        "aria": "古典のことばと対応する現代の読み解き",
        "quote_lang": "zh-Hant",
    },
}

CONTENT = {
    "zh-Hant": {
        "act-1": {
            "context": "一折 · 春歸",
            "quote": "人面不知何處去，桃花依舊笑春風。",
            "source": "崔護〈題都城南莊〉",
            "reading": "春色照常回來，缺席的人卻不會因此歸來。放在這一折，不是把等待寫成浪漫，而是提醒我們：景物可以年年如舊，孩子需要的照顧卻不能被推到下一個春天。",
        },
        "waiting": {
            "context": "第一章 · 村口",
            "quote": "誰言寸草心，報得三春暉。",
            "source": "孟郊〈遊子吟〉",
            "reading": "古詩寫的是照拂的深長，不是要求孩子以等待或順從回報大人。對今天的我們而言，親情首先應是可被確認的安全、陪伴與穩定聯繫。",
        },
        "act-2": {
            "context": "二折 · 相逢",
            "quote": "一葉落而知天下秋。",
            "source": "《太平御覽·時序部九》",
            "reading": "一片落葉很小，卻能讓人知道季節已經轉變。孩子的缺席、沉默、反覆離家也可能只是細微開端；真正的看見，是把小小異常放回完整脈絡。",
        },
        "signals": {
            "context": "第二章 · 校門",
            "quote": "凡事豫則立，不豫則廢。",
            "source": "《禮記·中庸》",
            "reading": "兒童保護不能等到所有證據齊備才開始關心。先約定誰追蹤、何時回看、如何跨單位交接，才可能讓一次接觸成為保護的起點。",
        },
        "act-3": {
            "context": "三折 · 十七道刻痕",
            "quote": "長太息以掩涕兮，哀民生之多艱。",
            "source": "屈原〈離騷〉",
            "reading": "悲傷會讓人停步，但不該讓孩子只剩一個令人嘆息的數字。這一折把「十七」留作提醒：每一天都曾有一次開門、求援與重新確認的可能。",
        },
        "court-findings": {
            "context": "第三章 · 門後",
            "quote": "惻隱之心，仁之端也。",
            "source": "《孟子·公孫丑上》",
            "reading": "不忍，是保護的起點，卻不能只停在心裡。當孩子受困，惻隱需要走向制止、求援、查證與持續確認，才真正成為能接住人的行動。",
        },
        "act-4": {
            "context": "四折 · 遲來的審判",
            "quote": "天網恢恢，疏而不失。",
            "source": "《道德經》第七十三章",
            "reading": "公義或許終會抵達，但遲來的裁判不能補回孩子失去的年歲。這句放在此處，不是慶賀刑罰，而是提醒我們把正義往前推到傷害發生以前。",
        },
        "justice": {
            "context": "第四章 · 長卷",
            "quote": "徒善不足以為政，徒法不能以自行。",
            "source": "《孟子·離婁上》",
            "reading": "善意與法條都需要人去落實。判決可以確認責任，保護則仰賴每一個接點有人追問、交接、回訪，並對下一步負責。",
        },
        "act-5": {
            "context": "五折 · 為孩子留燈",
            "quote": "落紅不是無情物，化作春泥更護花。",
            "source": "龔自珍〈己亥雜詩·其五〉",
            "reading": "真正的紀念，不是讓悲傷長久停在名字旁，而是把記得轉成制度、陪伴與行動，成為仍在成長的孩子腳下那層可以承接的土。",
        },
        "protection": {
            "context": "第五章 · 留燈",
            "quote": "幼吾幼，以及人之幼。",
            "source": "《孟子·梁惠王上》",
            "reading": "把別人的孩子也當作值得守護的孩子，不是抽象善意，而是讓離校有人追、反覆通報有人合併判讀、轉介之後仍有人確認安全。",
        },
        "sources": {
            "context": "資料來源與編輯邊界",
            "quote": "多聞闕疑，慎言其餘。",
            "source": "《論語·為政》",
            "reading": "公開資料沒有說明的地方，就誠實保留空白，不用推測填滿。把法院認定、親屬轉述與編輯分析分開，是對孩子、案件與讀者共同的尊重。",
        },
    },
    "zh-Hans": {
        "act-1": {
            "context": "一折 · 春归",
            "quote": "人面不知何处去，桃花依旧笑春风。",
            "source": "崔护《题都城南庄》",
            "reading": "春色照常回来，缺席的人却不会因此归来。放在这一折，不是把等待写成浪漫，而是提醒我们：景物可以年年如旧，孩子需要的照顾却不能被推到下一个春天。",
        },
        "waiting": {
            "context": "第一章 · 村口",
            "quote": "谁言寸草心，报得三春晖。",
            "source": "孟郊《游子吟》",
            "reading": "古诗写的是照拂的深长，不是要求孩子以等待或顺从回报大人。对今天的我们而言，亲情首先应是可以确认的安全、陪伴与稳定联系。",
        },
        "act-2": {
            "context": "二折 · 相逢",
            "quote": "一叶落而知天下秋。",
            "source": "《太平御览·时序部九》",
            "reading": "一片落叶很小，却能让人知道季节已经转变。孩子的缺席、沉默、反复离家也可能只是细微开端；真正的看见，是把小小异常放回完整脉络。",
        },
        "signals": {
            "context": "第二章 · 校门",
            "quote": "凡事豫则立，不豫则废。",
            "source": "《礼记·中庸》",
            "reading": "儿童保护不能等到所有证据齐备才开始关心。先约定谁追踪、何时回看、如何跨单位交接，才可能让一次接触成为保护的起点。",
        },
        "act-3": {
            "context": "三折 · 十七道刻痕",
            "quote": "长太息以掩涕兮，哀民生之多艰。",
            "source": "屈原《离骚》",
            "reading": "悲伤会让人停步，但不该让孩子只剩一个令人叹息的数字。这一折把“十七”留作提醒：每一天都曾有一次开门、求援与重新确认的可能。",
        },
        "court-findings": {
            "context": "第三章 · 门后",
            "quote": "恻隐之心，仁之端也。",
            "source": "《孟子·公孙丑上》",
            "reading": "不忍，是保护的起点，却不能只停在心里。当孩子受困，恻隐需要走向制止、求援、查证与持续确认，才真正成为能接住人的行动。",
        },
        "act-4": {
            "context": "四折 · 迟来的审判",
            "quote": "天网恢恢，疏而不失。",
            "source": "《道德经》第七十三章",
            "reading": "公义或许终会抵达，但迟来的裁判不能补回孩子失去的年岁。这句话放在这里，不是庆贺刑罚，而是提醒我们把正义往前推到伤害发生以前。",
        },
        "justice": {
            "context": "第四章 · 长卷",
            "quote": "徒善不足以为政，徒法不能以自行。",
            "source": "《孟子·离娄上》",
            "reading": "善意与法条都需要人去落实。判决可以确认责任，保护则仰赖每一个接点有人追问、交接、回访，并对下一步负责。",
        },
        "act-5": {
            "context": "五折 · 为孩子留灯",
            "quote": "落红不是无情物，化作春泥更护花。",
            "source": "龚自珍《己亥杂诗·其五》",
            "reading": "真正的纪念，不是让悲伤长久停在名字旁，而是把记得转成制度、陪伴与行动，成为仍在成长的孩子脚下那层可以承接的土。",
        },
        "protection": {
            "context": "第五章 · 留灯",
            "quote": "幼吾幼，以及人之幼。",
            "source": "《孟子·梁惠王上》",
            "reading": "把别人的孩子也当作值得守护的孩子，不是抽象善意，而是让离校有人追、反复通报有人合并研判、转介之后仍有人确认安全。",
        },
        "sources": {
            "context": "资料来源与编辑边界",
            "quote": "多闻阙疑，慎言其余。",
            "source": "《论语·为政》",
            "reading": "公开资料没有说明的地方，就诚实保留空白，不用推测填满。把法院认定、亲属转述与编辑分析分开，是对孩子、案件与读者共同的尊重。",
        },
    },
    "en": {
        "act-1": {
            "context": "Act I · Spring Returns",
            "quote": "人面不知何處去，桃花依舊笑春風。",
            "source": "Cui Hu, “Inscribed at a Village South of the Capital”",
            "translation": "The face I knew is nowhere to be found; the peach blossoms still smile in the spring wind.",
            "reading": "Spring can return while the absent person does not. The line is not used here to romanticize waiting. It reminds us that scenery may appear unchanged year after year, while a child’s need for care cannot be postponed to another spring.",
        },
        "waiting": {
            "context": "Chapter I · The Village Gate",
            "quote": "誰言寸草心，報得三春暉。",
            "source": "Meng Jiao, “Song of the Wandering Son”",
            "translation": "Who says a blade of grass can repay the radiance of three spring months?",
            "reading": "The poem speaks of the depth of care, not of a child owing obedience or endless waiting in return. In the present context, family care must first mean verifiable safety, companionship, and stable contact.",
        },
        "act-2": {
            "context": "Act II · The Encounter",
            "quote": "一葉落而知天下秋。",
            "source": "Taiping Yulan, “Seasonal Order, Part Nine”",
            "translation": "A single falling leaf reveals the arrival of autumn.",
            "reading": "A leaf is small, yet it can reveal a change of season. A child’s absence, silence, or repeated leaving of home may also be an early sign. To truly see is to place each small irregularity back into the whole pattern.",
        },
        "signals": {
            "context": "Chapter II · The School Gate",
            "quote": "凡事豫則立，不豫則廢。",
            "source": "Book of Rites, “Doctrine of the Mean”",
            "translation": "In all matters, preparation allows them to stand; without preparation, they fail.",
            "reading": "Child protection cannot wait until every piece of evidence is complete. Agreeing in advance who follows up, when a case is reviewed, and how agencies hand information over can turn a single encounter into the beginning of protection.",
        },
        "act-3": {
            "context": "Act III · Seventeen Marks",
            "quote": "長太息以掩涕兮，哀民生之多艱。",
            "source": "Qu Yuan, “Li Sao”",
            "translation": "I sigh long and cover my tears, grieving how hard human lives can be.",
            "reading": "Grief may make us pause, but it should not leave a child as only a number that prompts sorrow. This act keeps “seventeen” as a reminder: every day once held another chance to open a door, seek help, and check again.",
        },
        "court-findings": {
            "context": "Chapter III · Behind the Door",
            "quote": "惻隱之心，仁之端也。",
            "source": "Mencius, “Gongsun Chou I”",
            "translation": "The heart that cannot bear another’s suffering is the beginning of benevolence.",
            "reading": "Compassion is a beginning, but it cannot remain only a feeling. When a child is trapped, compassion must move toward interruption, help-seeking, verification, and continued checking before it becomes an action that can truly hold someone safely.",
        },
        "act-4": {
            "context": "Act IV · The Late Judgment",
            "quote": "天網恢恢，疏而不失。",
            "source": "Dao De Jing, Chapter 73",
            "translation": "Heaven’s net is vast; its mesh is wide, yet nothing is lost.",
            "reading": "Justice may eventually arrive, but a late judgment cannot return the years a child lost. The line is not placed here to celebrate punishment; it asks us to move justice forward, to the time before harm occurs.",
        },
        "justice": {
            "context": "Chapter IV · The Long Scroll",
            "quote": "徒善不足以為政，徒法不能以自行。",
            "source": "Mencius, “Li Lou I”",
            "translation": "Good intentions alone cannot govern; law alone cannot carry itself out.",
            "reading": "Goodwill and legal rules both need people to put them into practice. A judgment can establish responsibility; protection depends on someone asking the next question, handing information over, returning to check, and owning the next step.",
        },
        "act-5": {
            "context": "Act V · Leave a Light for Children",
            "quote": "落紅不是無情物，化作春泥更護花。",
            "source": "Gong Zizhen, “Miscellaneous Poems of 1839, No. 5”",
            "translation": "Fallen blossoms are not without feeling; they become spring soil and protect new flowers.",
            "reading": "Remembrance should not leave grief resting beside a name forever. It can be changed into systems, companionship, and action—the kind of ground that can hold children who are still growing.",
        },
        "protection": {
            "context": "Chapter V · Leave the Light On",
            "quote": "幼吾幼，以及人之幼。",
            "source": "Mencius, “King Hui of Liang I”",
            "translation": "Care for other people’s children as you care for your own.",
            "reading": "Treating every child as worthy of protection is not an abstract kindness. It means following up when a child leaves school, reading repeated reports together, and confirming safety even after a referral has been made.",
        },
        "sources": {
            "context": "Sources & Editorial Boundaries",
            "quote": "多聞闕疑，慎言其餘。",
            "source": "The Analects, “Wei Zheng”",
            "translation": "Hear widely, leave doubtful matters open, and speak cautiously about the rest.",
            "reading": "Where public records do not provide an answer, the honest choice is to preserve the blank rather than fill it with inference. Separating court findings, family accounts, and editorial analysis is a shared form of respect for the child, the case, and the reader.",
        },
    },
    "ja": {
        "act-1": {
            "context": "第一幕 · 春の帰還",
            "quote": "人面不知何處去，桃花依舊笑春風。",
            "source": "崔護「題都城南莊」",
            "translation": "あの人の面影はどこへ行ったのか。桃の花だけが、昔と変わらず春風にほほえむ。",
            "reading": "春は戻っても、いなくなった人が戻るわけではありません。この句は、待つことを美しく飾るためではなく、景色が毎年同じように見えても、子どもに必要な養育を次の春まで先送りしてはならないと伝えるために置いています。",
        },
        "waiting": {
            "context": "第一章 · 村の入口",
            "quote": "誰言寸草心，報得三春暉。",
            "source": "孟郊「遊子吟」",
            "translation": "小さな草の心で、春の陽光のような深い慈しみに報いきれるだろうか。",
            "reading": "この詩が語るのは養育の深さであり、子どもに従順さや終わりのない待機を求めることではありません。いまの私たちにとって、家族の愛はまず、確認できる安全、寄り添い、安定したつながりであるべきです。",
        },
        "act-2": {
            "context": "第二幕 · 出会い",
            "quote": "一葉落而知天下秋。",
            "source": "『太平御覧・時序部九』",
            "translation": "一枚の葉が落ちるのを見て、天下の秋を知る。",
            "reading": "一枚の葉は小さくても、季節の変化を知らせます。欠席、沈黙、家を繰り返し離れることも、最初は小さな兆候かもしれません。本当に見るとは、一つひとつの異変を全体の文脈へ戻すことです。",
        },
        "signals": {
            "context": "第二章 · 校門",
            "quote": "凡事豫則立，不豫則廢。",
            "source": "『礼記・中庸』",
            "translation": "物事は、あらかじめ備えれば成り、備えなければ崩れる。",
            "reading": "子どもの保護は、すべての証拠が揃うまで待って始めるものではありません。誰が追跡し、いつ見直し、機関どうしでどう引き継ぐかを先に定めることで、一度の接点を保護の始まりにできます。",
        },
        "act-3": {
            "context": "第三幕 · 十七の刻み",
            "quote": "長太息以掩涕兮，哀民生之多艱。",
            "source": "屈原「離騒」",
            "translation": "長く嘆息して涙をぬぐい、人の世に苦難が多いことを悲しむ。",
            "reading": "悲しみは人を立ち止まらせますが、子どもを嘆きの数字だけにしてはなりません。この幕の「十七」は、毎日そこに扉を開き、助けを求め、もう一度確かめる機会があったことを忘れないための印です。",
        },
        "court-findings": {
            "context": "第三章 · 扉の向こう",
            "quote": "惻隱之心，仁之端也。",
            "source": "『孟子・公孫丑上』",
            "translation": "人の苦しみに耐えられない心は、仁のはじまりである。",
            "reading": "「放っておけない」という思いは保護の出発点ですが、心の中だけで終わらせることはできません。子どもが閉じ込められているとき、その思いは制止、相談、確認、継続的な見守りへ進んでこそ、誰かを受け止める行動になります。",
        },
        "act-4": {
            "context": "第四幕 · 遅れてきた裁き",
            "quote": "天網恢恢，疏而不失。",
            "source": "『道徳経』第七十三章",
            "translation": "天の網は広大で、目は粗くとも取りこぼさない。",
            "reading": "正義はいつか届くかもしれません。しかし、遅れて下された判決は、子どもが失った年月を返せません。この句は刑罰を祝うためではなく、正義を被害が起きる前の時間へ押し戻すために置いています。",
        },
        "justice": {
            "context": "第四章 · 長い巻物",
            "quote": "徒善不足以為政，徒法不能以自行。",
            "source": "『孟子・離婁上』",
            "translation": "善意だけでは政治にならず、法だけではひとりでに行われない。",
            "reading": "善意も法制度も、人が実行して初めて働きます。判決は責任を確定できますが、保護には、次の問いを発し、情報を引き継ぎ、再訪し、その次の一歩を担う人が必要です。",
        },
        "act-5": {
            "context": "第五幕 · 子どものために灯を残す",
            "quote": "落紅不是無情物，化作春泥更護花。",
            "source": "龔自珍「己亥雑詩・其五」",
            "translation": "落ちた花も無情ではない。春の土となって、次の花を守る。",
            "reading": "本当の追悼は、悲しみを名前のそばに永く留めることではありません。記憶を制度、寄り添い、行動へ変え、いま育っている子どもを受け止める土にすることです。",
        },
        "protection": {
            "context": "第五章 · 灯を残す",
            "quote": "幼吾幼，以及人之幼。",
            "source": "『孟子・梁惠王上』",
            "translation": "自分の子を慈しむように、他者の子も慈しむ。",
            "reading": "すべての子どもを守る価値のある存在として扱うことは、抽象的な善意ではありません。離校を追跡し、繰り返される通報を一つのリスクとして読み、紹介後も安全を確認するという具体的な仕組みです。",
        },
        "sources": {
            "context": "資料と編集上の境界",
            "quote": "多聞闕疑，慎言其餘。",
            "source": "『論語・為政』",
            "translation": "広く聞き、疑わしいことは保留し、残りを慎んで語る。",
            "reading": "公開資料が語っていない部分は、推測で埋めず、空白のまま残します。裁判所の認定、親族の伝聞、編集上の分析を分けて示すことは、子ども、事件、読者への共通の敬意です。",
        },
    },
}

CSS_PATCH = r'''
/* === Classical inscriptions and gentle modern readings · 2026-08-21 === */
.fq-classic-note {
  --fq-classic-accent: var(--fq-cinnabar);
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(170px, .42fr) minmax(0, 1.15fr);
  gap: clamp(1rem, 3vw, 2.2rem);
  width: min(100%, 940px);
  margin: clamp(1.5rem, 3vw, 2.2rem) 0 0;
  padding: clamp(1.15rem, 2.7vw, 1.8rem);
  overflow: hidden;
  border: 1px solid rgba(83, 65, 59, .15);
  border-radius: 20px;
  color: #2f3434;
  background:
    linear-gradient(112deg, rgba(255,255,255,.58), transparent 42%),
    linear-gradient(145deg, rgba(251,247,241,.98), rgba(235,226,219,.95));
  box-shadow: 0 18px 48px rgba(58, 48, 44, .09), inset 0 1px 0 rgba(255,255,255,.76);
}

.fq-classic-note::before {
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--fq-classic-accent), color-mix(in srgb, var(--fq-classic-accent) 38%, transparent));
  content: "";
}

.fq-classic-note::after {
  position: absolute;
  z-index: -1;
  top: -.65rem;
  right: 1rem;
  color: color-mix(in srgb, var(--fq-classic-accent) 12%, transparent);
  content: "“";
  font-family: Georgia, "Noto Serif TC", serif;
  font-size: clamp(7rem, 15vw, 12rem);
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
}

.fq-act > .fq-classic-note {
  width: min(calc(100% - 40px), 980px);
  margin-inline: auto;
  --fq-classic-accent: var(--fq-act-accent, var(--fq-cinnabar));
}

.fq-chapter--ink .fq-classic-note {
  border-color: rgba(239, 222, 202, .22);
  box-shadow: 0 22px 58px rgba(5, 10, 13, .22), inset 0 1px 0 rgba(255,255,255,.72);
}

.fq-classic-note[data-fq-classic-key="waiting"] { --fq-classic-accent: #a47467; }
.fq-classic-note[data-fq-classic-key="signals"] { --fq-classic-accent: #668381; }
.fq-classic-note[data-fq-classic-key="court-findings"] { --fq-classic-accent: #6b5366; }
.fq-classic-note[data-fq-classic-key="justice"] { --fq-classic-accent: #927a4e; }
.fq-classic-note[data-fq-classic-key="protection"] { --fq-classic-accent: #607863; }
.fq-classic-note[data-fq-classic-key="sources"] { --fq-classic-accent: #6d7773; }

.fq-classic-note__head {
  align-self: start;
  min-width: 0;
  padding-right: .35rem;
}

.fq-classic-note__head small,
.fq-classic-note__head strong,
.fq-classic-note__head em {
  display: block;
}

.fq-classic-note__head small {
  color: var(--fq-classic-accent);
  font-size: .65rem;
  font-style: normal;
  font-weight: 850;
  letter-spacing: .13em;
  line-height: 1.5;
}

.fq-classic-note__head strong {
  margin-top: .6rem;
  color: #2a3e43;
  font-family: "Noto Serif TC", "Songti TC", Georgia, serif;
  font-size: clamp(1.05rem, 2vw, 1.32rem);
  font-weight: 680;
  line-height: 1.42;
}

.fq-classic-note__head em {
  margin-top: .55rem;
  color: rgba(54, 62, 62, .62);
  font-size: .68rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5;
}

.fq-classic-note__body {
  min-width: 0;
}

.fq-classic-note blockquote {
  margin: 0;
  padding: 0;
  border: 0;
}

.fq-classic-note__quote {
  margin: 0;
  color: #252b2d;
  font-family: "Noto Serif TC", "Songti TC", "PMingLiU", Georgia, serif;
  font-size: clamp(1.28rem, 2.8vw, 2rem);
  font-weight: 650;
  letter-spacing: .025em;
  line-height: 1.55;
  text-wrap: balance;
}

html[lang^="en"] .fq-classic-note__quote {
  font-family: "Noto Serif TC", "Songti TC", Georgia, serif;
}

html[lang^="ja"] .fq-classic-note__quote {
  font-family: "Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", serif;
}

.fq-classic-note cite {
  display: block;
  margin-top: .55rem;
  color: #75514a;
  font-size: .75rem;
  font-style: normal;
  font-weight: 760;
  line-height: 1.55;
}

.fq-classic-note__translation {
  display: block;
  max-width: 68ch;
  margin-top: .72rem;
  color: rgba(42, 51, 52, .72);
  font-family: Georgia, "Noto Serif TC", serif;
  font-size: .86rem;
  font-style: italic;
  line-height: 1.72;
}

html[lang^="ja"] .fq-classic-note__translation {
  font-family: "Noto Serif JP", "Yu Mincho", serif;
  font-style: normal;
}

.fq-classic-note__reading {
  margin-top: 1rem;
  padding: .9rem 1rem .95rem;
  border-left: 3px solid color-mix(in srgb, var(--fq-classic-accent) 62%, #fff);
  border-radius: 0 13px 13px 0;
  background: rgba(255,255,255,.46);
}

.fq-classic-note__reading b {
  display: block;
  color: var(--fq-classic-accent);
  font-size: .7rem;
  font-weight: 850;
  letter-spacing: .09em;
}

.fq-classic-note__reading p {
  max-width: none;
  margin: .38rem 0 0;
  color: #41494a;
  font-size: clamp(.88rem, 1.4vw, .98rem);
  line-height: 1.82;
  text-wrap: pretty;
}

.fq-chapter--ink .fq-classic-note__reading p {
  color: #41494a;
}

.fq-classic-note--sources {
  width: min(calc(100% - 40px), 940px);
  margin: 2rem auto 0;
}

html.fq-motion-ready .fq-classic-note:not(.is-visible) {
  opacity: 0;
  transform: translate3d(0, 22px, 0);
}

.fq-classic-note.is-visible {
  opacity: 1;
}

@media (max-width: 720px) {
  .fq-classic-note {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.05rem 1rem 1.1rem 1.15rem;
    border-radius: 17px;
  }

  .fq-act > .fq-classic-note,
  .fq-classic-note--sources {
    width: min(calc(100% - 24px), 940px);
  }

  .fq-classic-note__head {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: .35rem .7rem;
    align-items: end;
  }

  .fq-classic-note__head small {
    grid-column: 1 / -1;
    font-size: .6rem;
    letter-spacing: .1em;
  }

  .fq-classic-note__head strong {
    margin-top: .1rem;
    font-size: 1rem;
  }

  .fq-classic-note__head em {
    margin: 0;
    font-size: .62rem;
    text-align: right;
  }

  .fq-classic-note__quote {
    font-size: clamp(1.2rem, 6vw, 1.65rem);
    line-height: 1.55;
  }

  .fq-classic-note__reading {
    margin-top: .85rem;
    padding: .78rem .82rem .82rem;
  }

  .fq-classic-note__reading p {
    font-size: .9rem;
    line-height: 1.76;
  }

  .fq-classic-note::after {
    top: -.15rem;
    right: .4rem;
    font-size: 7rem;
  }
}

@media (max-width: 390px) {
  .fq-classic-note__head {
    grid-template-columns: 1fr;
  }

  .fq-classic-note__head em {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fq-classic-note {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}

@media print {
  .fq-classic-note {
    break-inside: avoid;
    border: 1px solid #777;
    color: #111;
    background: #fff;
    box-shadow: none;
  }

  .fq-classic-note__quote,
  .fq-classic-note__reading p,
  .fq-classic-note__head strong {
    color: #111;
  }
}
'''


def esc(value: str) -> str:
    return html_lib.escape(value, quote=True)


def build_note(locale: str, key: str, variant: str) -> str:
    labels = LABELS[locale]
    item = CONTENT[locale][key]
    translation = item.get("translation")
    translation_html = (
        f'<span class="fq-classic-note__translation">{esc(translation)}</span>'
        if translation
        else ""
    )
    return (
        f'<aside class="fq-classic-note fq-classic-note--{variant}" '
        f'data-fq-classic data-fq-classic-key="{esc(key)}" data-fq-reveal '
        f'aria-label="{esc(labels["aria"])}">'
        f'<div class="fq-classic-note__head">'
        f'<small>{esc(labels["eyebrow"])}</small>'
        f'<strong>{esc(item["context"])}</strong>'
        f'<em>{esc(labels["disclaimer"])}</em>'
        f'</div>'
        f'<div class="fq-classic-note__body">'
        f'<blockquote>'
        f'<p class="fq-classic-note__quote" lang="{esc(labels["quote_lang"])}">{esc(item["quote"])}</p>'
        f'<cite>— {esc(item["source"])}</cite>'
        f'{translation_html}'
        f'</blockquote>'
        f'<div class="fq-classic-note__reading">'
        f'<b>{esc(labels["reading"])}</b>'
        f'<p>{esc(item["reading"])}</p>'
        f'</div>'
        f'</div>'
        f'</aside>'
    )


def find_element_bounds(document: str, start: int, tag: str) -> tuple[int, int]:
    token_re = re.compile(rf"</?{tag}\b[^>]*>", re.IGNORECASE)
    depth = 0
    element_start = -1
    for match in token_re.finditer(document, start):
        token = match.group(0)
        closing = token.startswith("</")
        if not closing:
            if element_start < 0:
                element_start = match.start()
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return element_start, match.end()
    raise RuntimeError(f"Could not find matching </{tag}> from offset {start}")


def section_bounds(document: str, section_id: str) -> tuple[int, int]:
    id_token = f'id="{section_id}"'
    id_pos = document.find(id_token)
    if id_pos < 0:
        raise RuntimeError(f"Missing section id: {section_id}")
    section_start = document.rfind("<section", 0, id_pos)
    if section_start < 0:
        raise RuntimeError(f"Missing opening <section> for {section_id}")
    return find_element_bounds(document, section_start, "section")


def insert_act_note(document: str, locale: str, key: str) -> str:
    marker = f'data-fq-classic-key="{key}"'
    if marker in document:
        return document
    start, end = section_bounds(document, key)
    section = document[start:end]
    transcript_end = section.rfind("</details>")
    if transcript_end < 0:
        raise RuntimeError(f"Missing transcript in {key}")
    insert_at = start + transcript_end + len("</details>")
    note = build_note(locale, key, "act")
    return document[:insert_at] + "\n      " + note + document[insert_at:]


def insert_chapter_note(document: str, locale: str, key: str) -> str:
    marker = f'data-fq-classic-key="{key}"'
    if marker in document:
        return document
    start, end = section_bounds(document, key)
    section = document[start:end]
    outer_article_end = section.rfind("</article>")
    if outer_article_end < 0:
        raise RuntimeError(f"Missing outer article in {key}")
    insert_at = start + outer_article_end
    note = build_note(locale, key, "chapter")
    return document[:insert_at] + "\n        " + note + "\n      " + document[insert_at:]


def insert_sources_note(document: str, locale: str) -> str:
    key = "sources"
    marker = f'data-fq-classic-key="{key}"'
    if marker in document:
        return document
    start, end = section_bounds(document, key)
    section = document[start:end]
    editorial_pos = section.find('<div class="fq-editorial-note">')
    if editorial_pos < 0:
        raise RuntimeError("Missing editorial note in sources section")
    editorial_start, editorial_end = find_element_bounds(section, editorial_pos, "div")
    insert_at = start + editorial_end
    note = build_note(locale, key, "sources")
    return document[:insert_at] + "\n        " + note + document[insert_at:]


def patch_page(locale: str, path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    document = original
    for key in ACT_KEYS:
        document = insert_act_note(document, locale, key)
    for key in CHAPTER_KEYS:
        document = insert_chapter_note(document, locale, key)
    document = insert_sources_note(document, locale)

    for key in ALL_KEYS:
        count = document.count(f'data-fq-classic-key="{key}"')
        if count != 1:
            raise RuntimeError(f"{path}: expected one classical note for {key}, found {count}")
    if document.count("data-fq-classic") != len(ALL_KEYS):
        raise RuntimeError(f"{path}: unexpected total classical-note count")
    if "</body>" not in document or "</html>" not in document:
        raise RuntimeError(f"{path}: incomplete HTML document")

    if document == original:
        return False
    path.write_text(document, encoding="utf-8", newline="\n")
    return True


def patch_css() -> bool:
    original = CSS_PATH.read_text(encoding="utf-8")
    if CSS_MARKER in original:
        return False
    CSS_PATH.write_text(original.rstrip() + "\n\n" + CSS_PATCH.strip() + "\n", encoding="utf-8", newline="\n")
    return True


def main() -> int:
    changed: list[str] = []
    if patch_css():
        changed.append(CSS_PATH.relative_to(ROOT).as_posix())
    for locale, path in PAGE_PATHS.items():
        if patch_page(locale, path):
            changed.append(path.relative_to(ROOT).as_posix())

    if changed:
        print("Added classical inscriptions and modern readings:")
        for path in changed:
            print(f"- {path}")
    else:
        print("Classical inscriptions are already present in all four language pages.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
