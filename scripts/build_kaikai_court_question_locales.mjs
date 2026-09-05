#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLE_ROUTE = "news/kaikai-court-question-20260903/";
const BASE = "https://jerryzuhow77.github.io/child-advocacy-site/";
const PUBLIC_ROOT = "/child-advocacy-site/";
const VERSION = "20260905-4";
const SOURCE_PATH = path.join(ROOT, ARTICLE_ROUTE, "index.html");

const editions = {
  "zh-Hant": BASE + ARTICLE_ROUTE,
  "zh-Hans": BASE + ARTICLE_ROUTE + "zh-Hans/",
  en: BASE + "en/" + ARTICLE_ROUTE,
  ja: BASE + "ja/" + ARTICLE_ROUTE,
};

const enPairs = [
  ["那一聲質問，落在每一個大人的心上｜護童行動聯盟", "The Question That Landed in Every Adult’s Heart | Child Protection Action Alliance"],
  ["護童行動聯盟・旁聽紀錄", "Child Protection Action Alliance · Courtroom Notes"],
  ["首頁", "Home"],
  ["置頂快報", "Pinned Reports"],
  ["散文", "Essay"],
  ["證詞節錄", "Testimony Excerpt"],
  ["法律界限", "Legal Boundaries"],
  ["多元觀察・庭訊記憶・責任通報", "Multiple Perspectives · Courtroom Memory · Mandatory Reporting"],
  ["那一聲質問，", "That question,"],
  ["落在每一個大人的心上", "landed in every adult’s heart"],
  ["那句話沒有停在證人席前。它越過法庭的牆，像一面鏡子，照向整個台灣社會。", "It did not stop at the witness stand. It crossed the courtroom walls like a mirror held up to Taiwanese society."],
  ["開始閱讀", "Begin reading"],
  ["查看完整證詞", "Read the full testimony"],
  ["2026.09.03 發布・2026.09.05 擴充證詞節錄", "Published 2026.09.03 · Testimony excerpt expanded 2026.09.05"],
  ["象徵性藝術形象，非真實影像", "Symbolic artwork; not an actual image"],
  ["三次敲門", "Three knocks"],
  ["警訊並非同一天出現", "The warning signs did not appear on the same day"],
  ["九月", "September"],
  ["大片瘀傷", "Extensive bruising"],
  ["十月", "October"],
  ["精神萎靡", "Listlessness"],
  ["十一月", "November"],
  ["一夜掉了三顆牙", "Three teeth lost in one night"],
  ["散文正文", "Essay"],
  ["孩子的日子那麼短，大人的等待卻那麼長", "A child’s days were so short; the adults’ waiting was so long"],
  ["後來，每當想起那一天，我最先記起的不是證詞，而是三顆牙。", "Later, whenever I thought of that day, the first thing I remembered was not the testimony, but three teeth."],
  ["我未親眼看見，只在庭上聽說，剴剴曾一夜掉了三顆牙。乳牙原應在笑時白白露出，如今卻像三個沉默的白點，落在再也拼不回的日子裡。", "I did not see it myself. I only heard in court that Kaikai had lost three teeth in a single night. Baby teeth should flash white in a smile. Instead, they became three silent white dots, fallen into days that could never be pieced together again."],
  ["那一日，我握著筆坐在旁聽席。法官依時間問起九月的大片瘀傷、十月萎靡的精神，以及十一月一夜掉落的三顆牙。異狀反覆出現，像有人在門內一再敲門，門外卻始終無人真正聽見。", "That day, I sat in the public gallery with a pen in my hand. The judge asked, in sequence, about extensive bruising in September, listlessness in October, and three teeth lost in one night in November. The signs kept returning, like someone knocking again and again from behind a door, while no one outside truly heard."],
  ["白麗芳仍談流程、分工、蒐集資料與督導討論。她的回答在「明確證據」與「疑似即通報」之間來回，也因此被法官一次又一次追問。那些話似乎都有脈絡，可排在一個已離世的孩子面前，卻格外寒冷。", "Bai Lifang continued to speak of process, division of work, gathering information, and discussions with supervisors. Her answers moved between “clear evidence” and “report when abuse is suspected,” prompting the judges to ask again and again. Each answer seemed to have its own context, yet set beside a child who had died, the words felt especially cold."],
  ["大人的程序照自己的步伐走，孩子的苦也一天一天往前走，兩者未在最該相遇的地方相遇。", "The adults’ procedures moved at their own pace. The child’s suffering also moved forward, day after day. The two never met where they most needed to."],
  ["後來，法官的聲音重了：", "Then the judge’s voice grew firmer:"],
  ["那小孩到什麼狀況，兒盟才會覺得有通報義務？要被打到斷手斷腳？如果如此巨大落差都不算的話？", "What condition would a child have to reach before CWLF believed it had a duty to report? Did the child have to be beaten until an arm or leg broke? If even such a huge change did not count?"],
  ["那句話落下，法庭忽然沉寂。白麗芳沒有回答。", "When the question fell, the courtroom suddenly went still. Bai Lifang did not answer."],
  ["然而，沉默的不只是證人席。那聲質問越過白麗芳、兒盟與法庭的牆，像一面鏡子照向台灣社會。鏡中有社工、機構、主管機關，也有每個可能看見孩子異樣的我們。", "Yet the witness stand was not the only place that fell silent. The question crossed Bai Lifang, CWLF, and the courtroom walls, holding a mirror up to Taiwanese society. In that mirror were social workers, institutions, competent authorities, and every one of us who might notice that something is wrong with a child."],
  ["它逼所有人回答：我們是否把通報誤認為定罪，把謹慎變成等待，又把孩子的危險交給下一個人？當下一個孩子再以傷痕求救，台灣社會仍要等到他滿身是傷，才肯相信他正在受苦嗎？", "It forces everyone to answer: have we mistaken reporting for conviction, turned caution into waiting, and passed a child’s danger to the next person? When another child pleads through injuries, will Taiwanese society still wait until the child is covered in wounds before believing that the child is suffering?"],
  ["就在沉默中，一位旁聽婦女放聲大哭。女法警走到她身旁，彎身安慰。我望著那一幕，心裡愈發難受：一個大人哭了，立刻有人接住她；可是剴剴呢？", "In the silence, a woman in the public gallery began to sob. A female court officer walked over and bent down to comfort her. Watching them, I felt an even deeper ache: when an adult cried, someone immediately came to hold her. But what about Kaikai?"],
  ["他還那麼小，說不清害怕，只能把痛寫在身上。瘀傷是一句，疲憊是一句，三顆掉落的牙又是一句。若有人肯把它們放在一起看，便會明白，那是一封由孩子身體寫成的求救信。", "He was so young that he could not explain his fear; he could only write the pain on his body. A bruise was one sentence, exhaustion another, and three lost teeth another. Had someone been willing to read them together, they would have understood: this was a plea for help written by a child’s body."],
  ["可是大人把信拆開了。瘀傷被解釋成跌倒，精神不好被說成適應不良，掉牙也有了磨牙的理由。每一種解釋都擦去一行求救，每一次等待，都讓信離收信的人更遠。", "But the adults took the letter apart. Bruises were explained as falls, listlessness as difficulty adjusting, and missing teeth as the result of grinding. Each explanation erased one line of the plea. Each delay carried the letter farther from the person who needed to receive it."],
  ["等到所有人終於讀懂，寫信的孩子已經不在了。", "By the time everyone finally understood it, the child who had written the letter was gone."],
  ["通報不是定罪，只是多看一眼、多問一句，請另一雙眼睛確認孩子是否平安。救一個孩子，有時不必等真相全部明白，只要心裡先有一點不忍。", "Reporting is not a conviction. It means looking once more, asking one more question, and inviting another pair of eyes to check whether a child is safe. Sometimes saving a child does not require waiting until the whole truth is known; it begins with refusing to look away."],
  ["哭聲終究停了，庭訊繼續進行，法官的質問卻始終沒有散去。", "The crying eventually stopped and the proceeding continued, but the judge’s question never left."],
  ["剴剴不是沒有說。他把話留在瘀傷、疲憊與三顆小小的牙齒裡，只是大人讀得太慢。等我們終於攤開那封求救信，才看見上面一直寫著：", "It was not that Kaikai said nothing. His words remained in the bruises, the exhaustion, and three small teeth. The adults simply read too slowly. When we finally unfolded that plea for help, we saw what it had said all along:"],
  ["我已經這麼痛了，你們還要等多久？", "I am already hurting this much. How much longer will you wait?"],
  ["＊散文依旁聽筆記與《報導者》報導整理；下方問答以2025年12月18日旁聽筆記為底稿，並非法院公布的官方逐字稿。", "* The essay was compiled from courtroom-observer notes and reporting by The Reporter. The Q&A below is translated from courtroom-observer notes dated December 18, 2025; it is not an official verbatim transcript released by the court."],
  ["證詞完整節錄", "Full Testimony Excerpt"],
  ["白麗芳被反覆問到：辨識之後，何時通報", "Bai Lifang was asked again and again: after recognizing the signs, when should a report be made?"],
  ["以下依2025年12月18日旁聽筆記整理，保留詰問順序、沉默與現場聽不清楚等註記；這不是法院公布的官方逐字稿，也不是法院認定。", "The following is translated from courtroom-observer notes dated December 18, 2025. It preserves the order of questioning and annotations for silence or words that could not be heard clearly. It is neither an official verbatim transcript released by the court nor a court finding."],
  ["庭期", "Court date"],
  ["證人", "Witness"],
  ["白麗芳", "Bai Lifang"],
  ["身分", "Role"],
  ["前兒福聯盟執行長", "Former chief executive of the Child Welfare League Foundation"],
  ["紀錄性質", "Record type"],
  ["旁聽筆記整理", "Courtroom-observer notes"],
  ["01・訓練", "01 · TRAINING"],
  ["三小時基礎課程", "Three-hour basic course"],
  ["證人稱案發前社工有接受基礎兒虐辨識課程，但她無法具體描述課程內容。", "The witness said social workers had received basic training on recognizing child abuse before the incident, but she could not describe the course content in detail."],
  ["02・警訊", "02 · WARNING SIGNS"],
  ["九月至十一月的落差", "The change from September to November"],
  ["法官把大片瘀傷、精神萎靡與一夜掉牙放回同一條時間線追問。", "The judges placed the extensive bruising, listlessness, and teeth lost overnight on a single timeline."],
  ["03・門檻", "03 · THRESHOLD"],
  ["明確證據，還是疑似", "Clear evidence, or suspicion"],
  ["證人的回答由「明確證據」受到追問，最後確認疑似受虐即應通報。", "After questioning over her reference to “clear evidence,” the witness ultimately confirmed that suspected abuse should be reported."],
  ["04・責任", "04 · RESPONSIBILITY"],
  ["請回答是或不是", "Please answer yes or no"],
  ["陪席法官要求釐清：確認孩子受到妥善照顧與保護，是否屬社工義務。", "An associate judge sought a direct answer on whether ensuring that the child was properly cared for and protected was the social worker’s duty."],
  ["前段節錄｜兒虐辨識、訓練與通報概念", "Earlier excerpt | Recognizing abuse, training, and reporting"],
  ["辯方與檢方就訓練內容、服務經驗及辨識門檻的問答", "Questions from the defense and prosecution about training, service experience, and the threshold for recognition"],
  ["辯護人", "Defense counsel"],
  ["兒盟案發前有無要求社工要接受兒虐辨識課程？", "Before this case, did CWLF require social workers to take training on recognizing child abuse?"],
  ["有基礎3小時兒虐辨識課程。", "There was a basic three-hour course on recognizing child abuse."],
  ["有被要求上課，但是只基礎課程？", "They were required to take a course, but it was only a basic course?"],
  ["是。", "Yes."],
  ["兒虐辨識容易嗎？", "Is it easy to recognize child abuse?"],
  ["不易，衛福部成立很多兒虐醫療中心，有可能是兒虐的都要拍照傳給兒虐醫療中心做確認。", "No. The Ministry of Health and Welfare has established many child-abuse medical centers. Cases that may involve child abuse must be photographed and sent to a center for confirmation."],
  ["旁聽筆記在此另記出養童特性、保母配合度、本案照片及刑責等問答；與本節主題無直接關聯，未在此重錄。", "The observer notes also record questions here about the characteristics of children awaiting adoption, caregiver cooperation, photographs in this case, and criminal liability. Because they do not directly concern this section, they are not reproduced here."],
  ["你的回應與檢方的筆錄不符，為何？", "Why does your answer differ from the statement recorded by the prosecution?"],
  ["我當時已離職，且偵訊時間長，未看到訪視報告和細節，檢察官的複合問題我不知道如何說明，例如責任通報，那是我們發現疑似受虐，但我們當時是未發現。", "I had already left my position then, and the questioning was lengthy. I had not seen the visit reports or details, and I did not know how to explain the prosecutor’s compound questions. For example, mandatory reporting applies when we discover suspected abuse, but at the time we had not discovered it."],
  ["檢察官", "Prosecutor"],
  ["上次一級主管李芳玲作證時，她說兒盟的兒虐課程和這份「兒少虐待臨床表徵12點提醒」的內容當然有差別。你們的課程聽起來相當豐富，請具體說一下有哪些課程內容？你有上過嗎？", "When first-level supervisor Li Fangling testified previously, she said CWLF’s child-abuse course was of course different from this “12-point reminder on clinical signs of child maltreatment.” Your course sounds quite extensive. Please specify what it covered. Did you take it?"],
  ["我有，我們會請醫師來上課，但我沒辦法描述具體課程內容。", "I did. We invited physicians to teach, but I cannot describe the specific course content."],
  ["兒盟有「棄兒保護」業務嗎？", "Does CWLF provide abandoned-child protection services?"],
  ["有。", "Yes."],
  ["那有服務過「被合格保母虐待的孩子」嗎？", "Had it ever served a child who was abused by a licensed caregiver?"],
  ["沒有，我不記得。", "No. I do not remember."],
  ["服務33年，都沒遇過被合格保母虐待的孩子嗎？不只限於收出養。", "In 33 years of service, you never encountered a child abused by a licensed caregiver? This is not limited to adoption services."],
  ["對，沒有。", "Correct, no."],
  ["案發後，兒盟的內部檢討會議，是在檢討什麼？", "What did CWLF’s internal review meetings examine after the incident?"],
  ["不同層級有做不同的檢討，後來我已經離職，不清楚。", "Different levels conducted different reviews. I later left my position, so I do not know."],
  ["所以你不知道收出養團隊的檢討內容？", "So you do not know what the adoption team reviewed?"],
  ["就我理解，有以後孩子受傷要不要找兒保。", "As I understand it, one question was whether child-protection services should be contacted when a child is injured in the future."],
  ["短期安置托育工作指引提到「每月一次訪視、不定期電訪，以評估收出養童被照顧狀況」，請問具體要評估什麼？", "The short-term placement and childcare guidelines state: “one visit per month and unscheduled phone calls to assess how children awaiting adoption are being cared for.” What exactly was to be assessed?"],
  ["就收集小孩的狀況。", "We collected information about the child’s condition."],
  ["你說「收集小孩的狀況」，所以是不用去理「為什麼有此狀況」嗎？", "You say “collect information about the child’s condition.” Does that mean there was no need to examine why the child was in that condition?"],
  ["我們去了解狀況。", "We looked into the condition."],
  ["如果一個小孩有人身安全問題，你們會處理？", "If a child had a personal-safety issue, would you act?"],
  ["當然，但是人身安全很廣義，就當時判斷不知是人身安全。", "Of course. But personal safety is broad, and at the time it was not judged to be a personal-safety issue."],
  ["完整連續段落｜法官反覆追問辨識、疑似與通報", "Complete continuous passage | Judges repeatedly ask about recognition, suspicion, and reporting"],
  ["從九月瘀傷、十月萎靡、十一月掉牙，直到最後一次追問", "From September bruising, October listlessness, and November tooth loss through the final question"],
  ["以下自受命法官開始追問三次警訊起，連續收錄至本名證人詰問結束；未刪去其中問答。", "The passage below runs continuously from the assigned judge’s first question about the three warning signs through the end of this witness’s examination. No intervening question or answer has been removed."],
  ["受命法官", "Assigned judge"],
  ["原本周保母照顧時孩子有笑容，交給兒盟之後，9月份有大片瘀傷、10月精神萎靡、11月一夜掉3顆牙，前後「有巨大落差」，社工能否判斷？", "The child smiled when originally cared for by caregiver Zhou. After being transferred to CWLF, there was extensive bruising in September, listlessness in October, and three teeth lost in one night in November. With such a “huge change” between before and after, could a social worker assess it?"],
  ["據我事後了解，我們希望有醫療專業協助判斷，另外孩子可能適應困難。", "From what I learned afterward, we hoped medical professionals would help assess it. The child might also have had difficulty adjusting."],
  ["一個受過訓練的社工，看到一個小孩出現這麼大的落差，社工應該要做什麼？", "When a trained social worker sees such a major change in a child, what should the social worker do?"],
  ["要和督導討論，要讓他看醫生。我們當下還在收集資料。", "Discuss it with a supervisor and have the child see a doctor. At that point, we were still gathering information."],
  ["從9月到11月，已經收集很久了。只要讓他看醫生就好了嗎？", "You had been gathering information for a long time, from September to November. Was having the child see a doctor all that was needed?"],
  ["我當下不知道狀況，沒有參與討論，不知道他們有何考量。", "I did not know the situation at the time and did not take part in the discussions. I do not know what considerations they had."],
  ["（沉默）", "(Silence)"],
  ["法官的問題就是，如果如此巨大落差都不用通報，那何種情形才會通報？", "The judge’s question is this: if even such a huge change did not need to be reported, what circumstances would be reported?"],
  ["我無法回答當時狀況，如果我們有明確證據。", "I cannot answer about the situation at that time. If we had clear evidence."],
  ["庭上提示白麗芳先前筆錄。", "The court directed attention to Bai Lifang’s earlier statement."],
  ["在這份筆錄中，檢察官問「社工發現有傷是否應在24小時內通報？」，你答「發現有傷，應24小時內通報」；檢察官問「若有通報是否就會緊急安置，孩子就不會過世」，你答「是」。這些與你現在回答的立場是否一致？", "In this statement, the prosecutor asked, “If a social worker discovers an injury, should it be reported within 24 hours?” You answered, “When an injury is discovered, it should be reported within 24 hours.” The prosecutor asked, “If a report had been made, would there have been an emergency placement so the child would not have died?” You answered, “Yes.” Is that position consistent with your answer now?"],
  ["我當時是回答責任通報，是疑似受虐才通報，而非有傷。", "At the time I was answering about mandatory reporting: a report is made when abuse is suspected, not merely when there is an injury."],
  ["你現況判斷被告——你的社工發現落差巨大卻沒有通報，你覺得她有沒有疏失？", "Looking at it now, the defendant—your social worker—saw a huge change but did not report it. Do you think she fell short?"],
  ["我們行政流程上應該要精進，刑事上由法官決定。", "Our administrative procedures should be improved. Criminal responsibility is for the judge to decide."],
  ["在這個情況下，難道你們都沒有一定的要求嗎？", "In these circumstances, did you really have no defined requirements?"],
  ["（沉默）要改善，但非疏失。", "(Silence) It needs improvement, but it was not a failure."],
  ["你身為主管，對於被告的處置方式，你給她什麼評價？是有做到一般社工應該做的事嗎？", "As a supervisor, how do you evaluate the defendant’s handling of the matter? Did she do what an ordinary social worker should have done?"],
  ["（沉默）應有改進的空間。", "(Silence) There was room for improvement."],
  ["要如何做，才是符合你的期待？", "What should have been done to meet your expectations?"],
  ["會覺得除了討論之外，應尋求更多醫療專業資源。", "I think that, beyond discussion, more medical professional resources should have been sought."],
  ["陪席法官", "Associate judge"],
  ["你剛剛說「不預約訪視」是針對政府的，兒盟非公權力，所以都用約訪？", "You just said “unannounced visits” are for the government. Because CWLF does not exercise public authority, did it conduct only scheduled visits?"],
  ["以法規上，是。", "Under the regulations, yes."],
  ["那法規上有規定，非安置就不能做「不預約訪視」嗎？", "Do the regulations say that an unannounced visit cannot be made when a child is not under state placement?"],
  ["也沒有。", "No, they do not."],
  ["你剛剛說無法24小時擔保孩子安全，但是確認孩子在居托受到好的照顧和保護，是否是陳尚潔的責任和義務？", "You just said it was impossible to guarantee the child’s safety 24 hours a day. But was ensuring that the child received good care and protection in the home-based childcare setting Chen Shangjie’s responsibility and duty?"],
  ["那是居托中心吧。", "That was the home-based childcare center’s role, wasn’t it?"],
  ["所以，確認孩子在居托受到好的照顧和保護，不是陳尚潔的義務？請回答是或不是，不要岔題。這個問題應該不難。", "So ensuring that the child received good care and protection in the home-based childcare setting was not Chen Shangjie’s duty? Please answer yes or no. Do not digress. This question should not be difficult."],
  ["（沉默）如果只能答是或不是，那就是。", "(Silence) If I may answer only yes or no, then it was."],
  ["你一開始說「要有明確的兒虐證據」才能通報，後來你說「有疑似的證據」才要通報。以一個小孩一晚掉3顆牙，以一個正常人、一般人的角度，你認為看到這樣的狀況，會不會有疑似受虐的想法出現在你腦中？", "At first you said reporting required “clear evidence of child abuse.” Later you said a report should be made when there is “evidence giving rise to suspicion.” From the perspective of a normal, ordinary person, if a child lost three teeth in one night, would the thought of suspected abuse enter your mind when you saw that?"],
  ["這是不尋常，可能因為我已接受太多經驗，所以我……（旁聽筆記註：後段回應聽不清楚，待補充）", "That is unusual. Perhaps because I have had too much experience, I… (Observer’s note: the latter part of the response could not be heard clearly and awaits supplementation.)"],
  ["審判長", "Presiding judge"],
  ["所以，如果你同樣和陳尚潔在第一線，你會和陳尚潔做一樣的狀況處理嗎？", "So if you had been on the front line alongside Chen Shangjie, would you have handled the situation in the same way?"],
  ["我會再多問一點。", "I would have asked a little more."],
  ["會再問保母，叫保母帶他去看醫生嗎？", "Would you have asked the caregiver again and told the caregiver to take him to a doctor?"],
  ["我會問醫生或牙醫，諮詢專業的人。", "I would have asked a doctor or dentist and consulted a professional."],
  ["通報不算諮詢？通報不是叫專業的人來看？而是自己去找專業的人？", "Does reporting not count as consultation? Does reporting not bring a professional in to look? Instead, would you find a professional yourself?"],
  ["抱歉，請問你的通報是疑似就要通報，還是要先確定才要通報？不能回答也沒關係。", "Excuse me. Is a report required when there is suspicion, or only after confirmation? It is all right if you cannot answer."],
  ["是疑似。", "On suspicion."],
  ["9月發現瘀傷就應諮詢，一直到11月19日（一晚掉3顆牙），你覺得她有在適當的時間內去做這些疑似受虐的釐清嗎？", "Consultation should have begun when bruising was discovered in September. By November 19, when three teeth were lost in one night, do you think she had clarified these signs of suspected abuse within an appropriate time?"],
  ["我非第一時間知道，很多出養童有很多狀況，她不夠積極但不是不作為。", "I was not the first to know. Many children awaiting adoption have many issues. She was not proactive enough, but she was not inactive."],
  ["所以，你說她不夠積極？", "So you are saying she was not proactive enough?"],
  ["事後來說。", "In hindsight."],
  ["那你認為應該在什麼適當時間作為這個受虐確認？法官認為這個已經有很長一段時間。", "Then when would have been the appropriate time to seek confirmation of abuse? The judge considers that a long period had already passed."],
  ["他們都有問保母，當初找遊戲治療，朝適應困難處理。", "They did ask the caregiver. At the time they sought play therapy and treated it as difficulty adjusting."],
  ["劉童此巨大面積受傷，看起來難道不像受虐，而是適應不良？時間長到3、4個月，這有盡到「社工程度善良管理」嗎？我現在問你：這樣合理嗎？", "With injuries over such a large area, did this really look like adjustment difficulty rather than abuse? After three or four months, did that meet the “due-care standard expected of a social worker” [wording in the observer notes]? I am asking you now: was this reasonable?"],
  ["我沒有辦法回答此沉重的問題，我們會去核對她有沒有和督導討論。我不想幫她開脫。我們只是相信合作保母。", "I cannot answer this weighty question. We would check whether she discussed it with her supervisor. I do not want to make excuses for her. We simply trusted the caregiver who worked with us."],
  ["這難道不是判斷錯誤，與客觀事證顯不相符？", "Was that not an error of judgment plainly inconsistent with the objective evidence?"],
  ["（沉默）我說這是限制，而非錯誤。", "(Silence) I would call it a limitation, not an error."],
  ["紀錄界限與法律責任釐清", "Record Boundaries and Legal Responsibility"],
  ["通報是保護程序的開始，不是定罪", "Reporting begins a protection process; it is not a conviction"],
  ["「沒有回答」的紀錄界限", "The limits of recording “did not answer”"],
  ["文中「白麗芳沒有回答」，描述的是法官提出質問後，證人席當下的停頓與現場中斷，並非指白麗芳在其後的庭訊中完全沒有陳述。她稍後仍就通報門檻、當時資訊及判斷過程作出說明。", "The phrase “Bai Lifang did not answer” describes the pause at the witness stand immediately after the judge’s question and the break in the exchange at that moment. It does not mean that Bai made no further statements later in the proceeding. She subsequently addressed the reporting threshold, the information available at the time, and the decision-making process."],
  ["二十四小時責任通報", "Mandatory reporting within 24 hours"],
  ["依現行《兒童及少年福利與權益保障法》第53條，社工等責任通報人員於執行業務時，知悉兒少遭受法定傷害或不當對待等情形，應立即向主管機關通報，最遲不得超過二十四小時。衛福部對制度的說明，亦以「疑似遭受不當對待」作為通報情境，並非須先取得足以定罪的完整證據。", "Under Article 53 of Taiwan’s Protection of Children and Youths Welfare and Rights Act, social workers and other mandated reporters who learn in the course of their work that a child or youth has suffered a listed injury or improper treatment must immediately report to the competent authority, and no later than 24 hours. Ministry of Health and Welfare guidance also describes suspected improper treatment as a reporting circumstance; complete evidence sufficient for conviction need not first be obtained."],
  ["查看第53條", "View Article 53"],
  ["查看衛福部說明", "View MOHW guidance"],
  ["個案責任仍由司法認定", "Responsibility in the individual case remains for the courts to determine"],
  ["通報的作用，是啟動主管機關的分級、調查與保護程序，不等於認定照顧者施虐，也不等於刑事定罪或必然進行緊急安置。", "A report starts the competent authority’s triage, investigation, and protection procedures. It is not a finding that a caregiver committed abuse, a criminal conviction, or an automatic decision to make an emergency placement."],
  ["本文屬旁聽記憶、報導資料及文學性敘事整理，不代表法院已對白麗芳、兒盟或其他相關人員的法律責任作成認定。個案是否違反通報義務、與損害結果有無法律因果關係，以及是否應負民事、行政或刑事責任，仍應依行為當時的法規、完整證據與法院裁判判斷。", "This article combines courtroom-observer recollection, reported material, and literary narrative. It does not mean that a court has determined the legal responsibility of Bai Lifang, CWLF, or any other person. Whether the reporting duty was breached, whether any legal causal connection exists with the harm, and whether civil, administrative, or criminal liability follows must be decided under the law in force at the time, the complete evidence, and the court’s judgment."],
  ["願下一個孩子，在傷害發生以前，就有人伸手接住。", "May the next child be reached before harm occurs."],
  ["護童行動聯盟・法院旁聽・案件追蹤・制度倡議", "Child Protection Action Alliance · Courtroom Observation · Case Tracking · Systemic Advocacy"],
  ["回到頁首", "Back to top"],
  ["「", "“"],
  ["」", "”"],
];

const jaPairs = [
  ["那一聲質問，落在每一個大人的心上｜護童行動聯盟", "あの問いは、すべての大人の心に落ちた｜子ども保護行動連盟"],
  ["護童行動聯盟・旁聽紀錄", "子ども保護行動連盟・傍聴記録"],
  ["首頁", "ホーム"],
  ["置頂快報", "注目レポート"],
  ["散文", "エッセイ"],
  ["證詞節錄", "証言抜粋"],
  ["法律界限", "法的な境界"],
  ["多元觀察・庭訊記憶・責任通報", "多角的考察・法廷の記憶・義務通報"],
  ["那一聲質問，", "あの問いは、"],
  ["落在每一個大人的心上", "すべての大人の心に落ちた"],
  ["那句話沒有停在證人席前。它越過法庭的牆，像一面鏡子，照向整個台灣社會。", "あの言葉は証人席の前で止まらなかった。法廷の壁を越え、鏡のように台湾社会全体を映し出した。"],
  ["開始閱讀", "読み始める"],
  ["查看完整證詞", "証言の全抜粋を読む"],
  ["2026.09.03 發布・2026.09.05 擴充證詞節錄", "2026.09.03 公開・2026.09.05 証言抜粋を拡充"],
  ["象徵性藝術形象，非真實影像", "象徴的なアート表現。実際の画像ではありません"],
  ["三次敲門", "三度のノック"],
  ["警訊並非同一天出現", "警告の兆候は同じ日に現れたのではない"],
  ["九月", "9月"],
  ["大片瘀傷", "広範囲のあざ"],
  ["十月", "10月"],
  ["精神萎靡", "ぐったりした様子"],
  ["十一月", "11月"],
  ["一夜掉了三顆牙", "一晩で3本の歯が抜けた"],
  ["散文正文", "エッセイ本文"],
  ["孩子的日子那麼短，大人的等待卻那麼長", "子どもに残された日はあまりに短く、大人たちの待つ時間はあまりに長かった"],
  ["後來，每當想起那一天，我最先記起的不是證詞，而是三顆牙。", "その後、あの日を思い出すたび、最初に浮かぶのは証言ではなく、3本の歯だった。"],
  ["我未親眼看見，只在庭上聽說，剴剴曾一夜掉了三顆牙。乳牙原應在笑時白白露出，如今卻像三個沉默的白點，落在再也拼不回的日子裡。", "私は自分の目で見たわけではない。ただ法廷で、カイカイが一晩に3本の歯を失ったと聞いた。乳歯は本来、笑ったときに白くのぞくものだ。それが今では、二度とつなぎ直せない日々の中に落ちた、三つの沈黙する白い点のように思えた。"],
  ["那一日，我握著筆坐在旁聽席。法官依時間問起九月的大片瘀傷、十月萎靡的精神，以及十一月一夜掉落的三顆牙。異狀反覆出現，像有人在門內一再敲門，門外卻始終無人真正聽見。", "その日、私はペンを握って傍聴席に座っていた。裁判官は時系列に沿って、9月の広範囲のあざ、10月のぐったりした様子、そして11月に一晩で抜けた3本の歯について尋ねた。異変は繰り返し現れた。扉の内側から何度もノックする人がいるのに、外では誰も本当には聞き取らなかったかのように。"],
  ["白麗芳仍談流程、分工、蒐集資料與督導討論。她的回答在「明確證據」與「疑似即通報」之間來回，也因此被法官一次又一次追問。那些話似乎都有脈絡，可排在一個已離世的孩子面前，卻格外寒冷。", "白麗芳はなお、手順、役割分担、情報収集、スーパーバイザーとの協議について語った。答えは「明確な証拠」と「疑いがあれば通報する」の間を行き来し、そのため裁判官から何度も問い直された。それぞれの言葉には文脈があるように見えた。けれど、すでに亡くなった子どもの前に並べると、ひどく冷たく感じられた。"],
  ["大人的程序照自己的步伐走，孩子的苦也一天一天往前走，兩者未在最該相遇的地方相遇。", "大人の手続は大人の歩幅で進み、子どもの苦しみも一日ずつ先へ進んだ。両者は、最も出会うべき場所で出会わなかった。"],
  ["後來，法官的聲音重了：", "やがて、裁判官の声が強くなった。"],
  ["那小孩到什麼狀況，兒盟才會覺得有通報義務？要被打到斷手斷腳？如果如此巨大落差都不算的話？", "その子がどのような状態になれば、児童福祉連盟は通報義務があると考えるのですか。手足を折られるまで殴られなければならないのですか。これほど大きな変化さえ該当しないのなら。"],
  ["那句話落下，法庭忽然沉寂。白麗芳沒有回答。", "その問いが落ちると、法廷は突然静まり返った。白麗芳は答えなかった。"],
  ["然而，沉默的不只是證人席。那聲質問越過白麗芳、兒盟與法庭的牆，像一面鏡子照向台灣社會。鏡中有社工、機構、主管機關，也有每個可能看見孩子異樣的我們。", "しかし、沈黙したのは証人席だけではない。その問いは白麗芳と児童福祉連盟、そして法廷の壁を越え、鏡のように台湾社会を映した。そこにはソーシャルワーカー、機関、所管当局、そして子どもの異変に気づくかもしれない私たち一人ひとりが映っている。"],
  ["它逼所有人回答：我們是否把通報誤認為定罪，把謹慎變成等待，又把孩子的危險交給下一個人？當下一個孩子再以傷痕求救，台灣社會仍要等到他滿身是傷，才肯相信他正在受苦嗎？", "その問いはすべての人に答えを迫る。私たちは通報を有罪認定と取り違え、慎重さを待機に変え、子どもの危険を次の誰かへ渡してはいないか。次の子どもが傷を通して助けを求めたとき、台湾社会はまた全身が傷つくまで待たなければ、その苦しみを信じないのだろうか。"],
  ["就在沉默中，一位旁聽婦女放聲大哭。女法警走到她身旁，彎身安慰。我望著那一幕，心裡愈發難受：一個大人哭了，立刻有人接住她；可是剴剴呢？", "沈黙の中、傍聴していた一人の女性が声を上げて泣いた。女性の法廷警備員がそばへ行き、身をかがめて慰めた。その光景を見て、胸はさらに痛んだ。大人が泣けば、すぐに受け止める人がいる。では、カイカイは。"],
  ["他還那麼小，說不清害怕，只能把痛寫在身上。瘀傷是一句，疲憊是一句，三顆掉落的牙又是一句。若有人肯把它們放在一起看，便會明白，那是一封由孩子身體寫成的求救信。", "彼はまだ幼く、怖さを言葉で説明できず、痛みを体に書くことしかできなかった。あざが一文、疲れが一文、抜けた3本の歯がまた一文だった。誰かがそれらを一緒に読もうとしていれば、子どもの体が書いた救難信号だと分かったはずだ。"],
  ["可是大人把信拆開了。瘀傷被解釋成跌倒，精神不好被說成適應不良，掉牙也有了磨牙的理由。每一種解釋都擦去一行求救，每一次等待，都讓信離收信的人更遠。", "けれど大人たちは、その手紙をばらばらにした。あざは転倒、元気のなさは適応の難しさ、歯が抜けたことには歯ぎしりという説明が与えられた。一つ説明するたびに助けを求める一行が消され、待つたびに手紙は受け取るべき人から遠ざかった。"],
  ["等到所有人終於讀懂，寫信的孩子已經不在了。", "ようやく皆が読み取ったとき、その手紙を書いた子どもはもういなかった。"],
  ["通報不是定罪，只是多看一眼、多問一句，請另一雙眼睛確認孩子是否平安。救一個孩子，有時不必等真相全部明白，只要心裡先有一點不忍。", "通報は有罪認定ではない。もう一度見て、もう一言尋ね、別の目にも子どもの安全を確かめてもらうことだ。子どもを救うために、真実のすべてが分かるまで待つ必要はないことがある。まず、見過ごせないと感じることから始まる。"],
  ["哭聲終究停了，庭訊繼續進行，法官的質問卻始終沒有散去。", "泣き声はやがて止み、審理は続いた。それでも裁判官の問いは消えなかった。"],
  ["剴剴不是沒有說。他把話留在瘀傷、疲憊與三顆小小的牙齒裡，只是大人讀得太慢。等我們終於攤開那封求救信，才看見上面一直寫著：", "カイカイが何も語らなかったのではない。あざ、疲れ、3本の小さな歯に言葉を残していた。ただ、大人が読むのに時間をかけすぎた。私たちがようやくその救難の手紙を広げたとき、そこにはずっとこう書かれていた。"],
  ["我已經這麼痛了，你們還要等多久？", "もうこんなに痛いのに、あとどれほど待つのですか。"],
  ["＊散文依旁聽筆記與《報導者》報導整理；下方問答以2025年12月18日旁聽筆記為底稿，並非法院公布的官方逐字稿。", "＊エッセイは傍聴メモと『報導者（The Reporter）』の報道をもとに整理しました。以下の質疑は2025年12月18日の傍聴メモから翻訳したもので、裁判所が公表した公式逐語録ではありません。"],
  ["證詞完整節錄", "証言の全抜粋"],
  ["白麗芳被反覆問到：辨識之後，何時通報", "白麗芳は繰り返し問われた――兆候を認識した後、いつ通報するのか"],
  ["以下依2025年12月18日旁聽筆記整理，保留詰問順序、沉默與現場聽不清楚等註記；這不是法院公布的官方逐字稿，也不是法院認定。", "以下は2025年12月18日の傍聴メモから翻訳・整理し、質問の順序、沈黙、現場で聞き取れなかった箇所の注記を残しています。裁判所が公表した公式逐語録でも、裁判所の認定でもありません。"],
  ["庭期", "期日"],
  ["證人", "証人"],
  ["白麗芳", "白麗芳"],
  ["身分", "肩書"],
  ["前兒福聯盟執行長", "児童福祉連盟・元執行長"],
  ["紀錄性質", "記録の性質"],
  ["旁聽筆記整理", "傍聴メモの整理"],
  ["01・訓練", "01・研修"],
  ["三小時基礎課程", "3時間の基礎研修"],
  ["證人稱案發前社工有接受基礎兒虐辨識課程，但她無法具體描述課程內容。", "証人は、事件前にソーシャルワーカーが児童虐待を見分ける基礎研修を受けていたと述べましたが、具体的な内容は説明できませんでした。"],
  ["02・警訊", "02・警告の兆候"],
  ["九月至十一月的落差", "9月から11月までの変化"],
  ["法官把大片瘀傷、精神萎靡與一夜掉牙放回同一條時間線追問。", "裁判官は、広範囲のあざ、ぐったりした様子、一晩での歯の脱落を一つの時系列に戻して問い直しました。"],
  ["03・門檻", "03・判断の基準"],
  ["明確證據，還是疑似", "明確な証拠か、それとも疑いか"],
  ["證人的回答由「明確證據」受到追問，最後確認疑似受虐即應通報。", "証人は「明確な証拠」という発言について追及され、最終的に虐待の疑いがあれば通報すべきだと確認しました。"],
  ["04・責任", "04・責任"],
  ["請回答是或不是", "はい、いいえで答えてください"],
  ["陪席法官要求釐清：確認孩子受到妥善照顧與保護，是否屬社工義務。", "陪席裁判官は、子どもが適切に養育・保護されていることの確認がソーシャルワーカーの義務かどうか、明確な回答を求めました。"],
  ["前段節錄｜兒虐辨識、訓練與通報概念", "前半の抜粋｜虐待の認識、研修、通報の考え方"],
  ["辯方與檢方就訓練內容、服務經驗及辨識門檻的問答", "研修内容、支援経験、認識の基準をめぐる弁護側と検察側の質疑"],
  ["辯護人", "弁護人"],
  ["兒盟案發前有無要求社工要接受兒虐辨識課程？", "児童福祉連盟は事件前、ソーシャルワーカーに児童虐待を見分ける研修の受講を求めていましたか。"],
  ["有基礎3小時兒虐辨識課程。", "児童虐待を見分ける3時間の基礎研修がありました。"],
  ["有被要求上課，但是只基礎課程？", "受講は求められていたが、基礎研修だけだったのですか。"],
  ["是。", "はい。"],
  ["兒虐辨識容易嗎？", "児童虐待を見分けるのは容易ですか。"],
  ["不易，衛福部成立很多兒虐醫療中心，有可能是兒虐的都要拍照傳給兒虐醫療中心做確認。", "容易ではありません。衛生福利部は多くの児童虐待医療センターを設置しており、虐待の可能性がある場合は写真を撮ってセンターへ送り、確認してもらう必要があります。"],
  ["旁聽筆記在此另記出養童特性、保母配合度、本案照片及刑責等問答；與本節主題無直接關聯，未在此重錄。", "傍聴メモにはこの箇所で、養子縁組を待つ子どもの特性、保育者の協力度、本件の写真、刑事責任などに関する質疑も記録されています。本節の主題と直接関係しないため、ここでは再録していません。"],
  ["你的回應與檢方的筆錄不符，為何？", "あなたの回答が検察側の供述調書と異なるのはなぜですか。"],
  ["我當時已離職，且偵訊時間長，未看到訪視報告和細節，檢察官的複合問題我不知道如何說明，例如責任通報，那是我們發現疑似受虐，但我們當時是未發現。", "私は当時すでに退職しており、取調べも長時間でした。訪問報告や詳細を見ておらず、検察官の複合的な質問にどう説明すればよいか分かりませんでした。たとえば義務通報は、虐待の疑いを発見したときのものですが、私たちは当時それを発見していませんでした。"],
  ["檢察官", "検察官"],
  ["上次一級主管李芳玲作證時，她說兒盟的兒虐課程和這份「兒少虐待臨床表徵12點提醒」的內容當然有差別。你們的課程聽起來相當豐富，請具體說一下有哪些課程內容？你有上過嗎？", "前回、一級主管の李芳玲が証言した際、児童福祉連盟の児童虐待研修は、この「児童・青少年虐待の臨床徴候に関する12項目の注意事項」とは当然内容が異なると述べました。研修内容はかなり充実しているように聞こえます。具体的に何を扱っていましたか。あなたは受講しましたか。"],
  ["我有，我們會請醫師來上課，但我沒辦法描述具體課程內容。", "受講しました。医師を招いて講義をしてもらいましたが、具体的な内容は説明できません。"],
  ["兒盟有「棄兒保護」業務嗎？", "児童福祉連盟には「遺棄児童の保護」業務がありますか。"],
  ["有。", "あります。"],
  ["那有服務過「被合格保母虐待的孩子」嗎？", "では、「資格を持つ保育者から虐待を受けた子ども」を支援したことはありますか。"],
  ["沒有，我不記得。", "ありません。記憶にありません。"],
  ["服務33年，都沒遇過被合格保母虐待的孩子嗎？不只限於收出養。", "33年間の支援で、資格を持つ保育者から虐待を受けた子どもに一度も出会わなかったのですか。養子縁組支援に限りません。"],
  ["對，沒有。", "はい、ありません。"],
  ["案發後，兒盟的內部檢討會議，是在檢討什麼？", "事件後、児童福祉連盟の内部検証会議では何を検証したのですか。"],
  ["不同層級有做不同的檢討，後來我已經離職，不清楚。", "階層ごとに異なる検証を行いました。その後、私は退職したので詳しくは分かりません。"],
  ["所以你不知道收出養團隊的檢討內容？", "では、養子縁組チームの検証内容は知らないのですか。"],
  ["就我理解，有以後孩子受傷要不要找兒保。", "私の理解では、今後子どもがけがをしたとき、児童保護部門に連絡するかどうかが含まれていました。"],
  ["短期安置托育工作指引提到「每月一次訪視、不定期電訪，以評估收出養童被照顧狀況」，請問具體要評估什麼？", "短期措置・保育の業務指針には「毎月1回訪問し、不定期に電話確認を行い、養子縁組を待つ子どもの養育状況を評価する」とあります。具体的に何を評価するのですか。"],
  ["就收集小孩的狀況。", "子どもの状態について情報を集めます。"],
  ["你說「收集小孩的狀況」，所以是不用去理「為什麼有此狀況」嗎？", "「子どもの状態について情報を集める」と言いましたが、「なぜその状態になったのか」は確認しなくてよいのですか。"],
  ["我們去了解狀況。", "私たちは状態を確認します。"],
  ["如果一個小孩有人身安全問題，你們會處理？", "子どもの身の安全に問題があれば、対応しますか。"],
  ["當然，但是人身安全很廣義，就當時判斷不知是人身安全。", "もちろんです。ただし身の安全という言葉は広く、当時の判断では身の安全の問題だとは分かりませんでした。"],
  ["完整連續段落｜法官反覆追問辨識、疑似與通報", "連続した全記録｜裁判官が認識、疑い、通報を繰り返し問う"],
  ["從九月瘀傷、十月萎靡、十一月掉牙，直到最後一次追問", "9月のあざ、10月の衰弱、11月の歯の脱落から最後の問いまで"],
  ["以下自受命法官開始追問三次警訊起，連續收錄至本名證人詰問結束；未刪去其中問答。", "以下は、受命裁判官が三つの警告の兆候について問い始めた箇所から、この証人に対する尋問が終わるまでを連続して収録しています。途中の質疑は削除していません。"],
  ["受命法官", "受命裁判官"],
  ["原本周保母照顧時孩子有笑容，交給兒盟之後，9月份有大片瘀傷、10月精神萎靡、11月一夜掉3顆牙，前後「有巨大落差」，社工能否判斷？", "もともと周保育者が世話をしていたとき、子どもには笑顔がありました。児童福祉連盟に引き渡された後、9月には広範囲のあざ、10月にはぐったりした様子、11月には一晩で3本の歯が抜けています。前後に「大きな変化」がありますが、ソーシャルワーカーは判断できますか。"],
  ["據我事後了解，我們希望有醫療專業協助判斷，另外孩子可能適應困難。", "後から把握したところでは、医療の専門家に判断を助けてもらいたいと考えていました。また、子どもが適応に苦労していた可能性もあります。"],
  ["一個受過訓練的社工，看到一個小孩出現這麼大的落差，社工應該要做什麼？", "研修を受けたソーシャルワーカーが、子どもにこれほど大きな変化があるのを見たら、何をすべきですか。"],
  ["要和督導討論，要讓他看醫生。我們當下還在收集資料。", "スーパーバイザーと協議し、子どもを医師に診せるべきです。その時点では、まだ情報を集めていました。"],
  ["從9月到11月，已經收集很久了。只要讓他看醫生就好了嗎？", "9月から11月まで、すでに長い間情報を集めています。医師に診せるだけでよかったのですか。"],
  ["我當下不知道狀況，沒有參與討論，不知道他們有何考量。", "私は当時の状況を知らず、協議にも参加していません。どのような考慮があったか分かりません。"],
  ["（沉默）", "（沈黙）"],
  ["法官的問題就是，如果如此巨大落差都不用通報，那何種情形才會通報？", "裁判官が尋ねているのは、これほど大きな変化でも通報しないのなら、どのような場合に通報するのか、ということです。"],
  ["我無法回答當時狀況，如果我們有明確證據。", "当時の状況については答えられません。もし明確な証拠があれば。"],
  ["庭上提示白麗芳先前筆錄。", "法廷で白麗芳の以前の供述調書が示された。"],
  ["在這份筆錄中，檢察官問「社工發現有傷是否應在24小時內通報？」，你答「發現有傷，應24小時內通報」；檢察官問「若有通報是否就會緊急安置，孩子就不會過世」，你答「是」。這些與你現在回答的立場是否一致？", "この供述調書で、検察官は「ソーシャルワーカーがけがを発見した場合、24時間以内に通報すべきですか」と尋ね、あなたは「けがを発見したら24時間以内に通報すべきです」と答えています。さらに「通報していれば緊急措置となり、子どもは亡くならなかったのではないか」と尋ねられ、「はい」と答えています。これは今の回答と一致しますか。"],
  ["我當時是回答責任通報，是疑似受虐才通報，而非有傷。", "当時、私は義務通報について答えました。けががあるだけではなく、虐待の疑いがあるときに通報するという意味です。"],
  ["你現況判斷被告——你的社工發現落差巨大卻沒有通報，你覺得她有沒有疏失？", "現在の時点で判断すると、被告人、つまりあなたの部下だったソーシャルワーカーは大きな変化に気づきながら通報しませんでした。落ち度があったと思いますか。"],
  ["我們行政流程上應該要精進，刑事上由法官決定。", "行政上の手順は改善すべきです。刑事上の判断は裁判官が決めることです。"],
  ["在這個情況下，難道你們都沒有一定的要求嗎？", "この状況で、組織として一定の基準はなかったのですか。"],
  ["（沉默）要改善，但非疏失。", "（沈黙）改善は必要ですが、落ち度ではありません。"],
  ["你身為主管，對於被告的處置方式，你給她什麼評價？是有做到一般社工應該做的事嗎？", "管理職として、被告人の対応をどう評価しますか。一般のソーシャルワーカーが行うべきことを行っていましたか。"],
  ["（沉默）應有改進的空間。", "（沈黙）改善の余地はあったと思います。"],
  ["要如何做，才是符合你的期待？", "どのように対応すれば、あなたの期待に沿ったのですか。"],
  ["會覺得除了討論之外，應尋求更多醫療專業資源。", "協議だけでなく、より多くの医療専門職の支援を求めるべきだったと思います。"],
  ["陪席法官", "陪席裁判官"],
  ["你剛剛說「不預約訪視」是針對政府的，兒盟非公權力，所以都用約訪？", "先ほど「予告なしの訪問」は行政機関が行うもので、児童福祉連盟には公権力がないため、すべて事前に約束して訪問すると言いましたか。"],
  ["以法規上，是。", "法令上は、はい。"],
  ["那法規上有規定，非安置就不能做「不預約訪視」嗎？", "では法令に、公的措置でなければ「予告なしの訪問」はできないと定められていますか。"],
  ["也沒有。", "いいえ、そのような定めはありません。"],
  ["你剛剛說無法24小時擔保孩子安全，但是確認孩子在居托受到好的照顧和保護，是否是陳尚潔的責任和義務？", "あなたは先ほど、24時間子どもの安全を保証することはできないと述べました。しかし、居宅保育で子どもが適切に養育・保護されていることを確認するのは、陳尚潔の責任と義務でしたか。"],
  ["那是居托中心吧。", "それは居宅保育サービスセンターの役割ではないでしょうか。"],
  ["所以，確認孩子在居托受到好的照顧和保護，不是陳尚潔的義務？請回答是或不是，不要岔題。這個問題應該不難。", "では、居宅保育で子どもが適切に養育・保護されていることを確認するのは、陳尚潔の義務ではなかったのですか。はい、いいえで答えてください。話をそらさないでください。この質問は難しくないはずです。"],
  ["（沉默）如果只能答是或不是，那就是。", "（沈黙）はい、いいえだけで答えるなら、義務でした。"],
  ["你一開始說「要有明確的兒虐證據」才能通報，後來你說「有疑似的證據」才要通報。以一個小孩一晚掉3顆牙，以一個正常人、一般人的角度，你認為看到這樣的狀況，會不會有疑似受虐的想法出現在你腦中？", "最初は「児童虐待の明確な証拠」がなければ通報しないと言い、その後は「疑いを示す証拠」があれば通報すると述べました。子どもが一晩で3本の歯を失った場合、普通の人の視点から、その状態を見て虐待の疑いが頭に浮かびませんか。"],
  ["這是不尋常，可能因為我已接受太多經驗，所以我……（旁聽筆記註：後段回應聽不清楚，待補充）", "これは異常なことです。おそらく私はあまりに多くの経験を受け止めてきたので、私は……（傍聴メモ注：後半の回答は聞き取れず、補足待ち）"],
  ["審判長", "裁判長"],
  ["所以，如果你同樣和陳尚潔在第一線，你會和陳尚潔做一樣的狀況處理嗎？", "では、あなたが陳尚潔と同じように現場の第一線にいたら、同じ対応をしましたか。"],
  ["我會再多問一點。", "もう少し詳しく尋ねます。"],
  ["會再問保母，叫保母帶他去看醫生嗎？", "保育者にさらに尋ね、子どもを医師に診せるよう伝えますか。"],
  ["我會問醫生或牙醫，諮詢專業的人。", "医師や歯科医に尋ね、専門家に相談します。"],
  ["通報不算諮詢？通報不是叫專業的人來看？而是自己去找專業的人？", "通報は相談に当たらないのですか。通報とは専門家に見てもらうことではないのですか。それでも自分で専門家を探すのですか。"],
  ["抱歉，請問你的通報是疑似就要通報，還是要先確定才要通報？不能回答也沒關係。", "失礼ですが、通報は疑いの段階で行うのですか。それとも確定してから行うのですか。答えられなくても構いません。"],
  ["是疑似。", "疑いの段階です。"],
  ["9月發現瘀傷就應諮詢，一直到11月19日（一晚掉3顆牙），你覺得她有在適當的時間內去做這些疑似受虐的釐清嗎？", "9月にあざを発見した時点で相談すべきで、11月19日に一晩で3本の歯が抜けるまでの間に、虐待の疑いについて適切な時期に確認したと思いますか。"],
  ["我非第一時間知道，很多出養童有很多狀況，她不夠積極但不是不作為。", "私は最初から知っていたわけではありません。養子縁組を待つ多くの子どもにはさまざまな状態があります。彼女は十分に積極的ではありませんでしたが、何もしなかったわけではありません。"],
  ["所以，你說她不夠積極？", "つまり、十分に積極的ではなかったということですか。"],
  ["事後來說。", "結果を知った今から見れば、そうです。"],
  ["那你認為應該在什麼適當時間作為這個受虐確認？法官認為這個已經有很長一段時間。", "では、いつ虐待の確認を行うのが適切だったと考えますか。裁判官は、すでに長い時間が経過していたと考えています。"],
  ["他們都有問保母，當初找遊戲治療，朝適應困難處理。", "担当者たちは保育者に尋ねていました。当初はプレイセラピーを探し、適応の難しさとして対応していました。"],
  ["劉童此巨大面積受傷，看起來難道不像受虐，而是適應不良？時間長到3、4個月，這有盡到「社工程度善良管理」嗎？我現在問你：這樣合理嗎？", "劉児童のこれほど広範囲の負傷は、虐待ではなく適応不良に見えたのですか。3、4か月もの時間が経過しています。これは「ソーシャルワーカーに求められる善良な管理上の注意」を尽くしたと言えるのですか〔傍聴メモの表現を読みやすく訳出〕。今、あなたに尋ねます。これは合理的ですか。"],
  ["我沒有辦法回答此沉重的問題，我們會去核對她有沒有和督導討論。我不想幫她開脫。我們只是相信合作保母。", "この重い質問には答えられません。彼女がスーパーバイザーと協議していたかを確認します。彼女をかばうつもりはありません。私たちは協力関係にある保育者を信じていただけです。"],
  ["這難道不是判斷錯誤，與客觀事證顯不相符？", "それは判断の誤りで、客観的な証拠と明らかに一致しないのではありませんか。"],
  ["（沉默）我說這是限制，而非錯誤。", "（沈黙）私は誤りではなく、限界だと表現します。"],
  ["紀錄界限與法律責任釐清", "記録の限界と法的責任の整理"],
  ["通報是保護程序的開始，不是定罪", "通報は保護手続の始まりであり、有罪認定ではない"],
  ["「沒有回答」的紀錄界限", "「答えなかった」という記録の限界"],
  ["文中「白麗芳沒有回答」，描述的是法官提出質問後，證人席當下的停頓與現場中斷，並非指白麗芳在其後的庭訊中完全沒有陳述。她稍後仍就通報門檻、當時資訊及判斷過程作出說明。", "本文の「白麗芳は答えなかった」は、裁判官の問いの直後、証人席で生じた間と、その場のやり取りの途切れを記述したものです。その後の審理で白麗芳が一切説明しなかったという意味ではありません。白麗芳は後に、通報の基準、当時の情報、判断過程について説明しています。"],
  ["二十四小時責任通報", "24時間以内の義務通報"],
  ["依現行《兒童及少年福利與權益保障法》第53條，社工等責任通報人員於執行業務時，知悉兒少遭受法定傷害或不當對待等情形，應立即向主管機關通報，最遲不得超過二十四小時。衛福部對制度的說明，亦以「疑似遭受不當對待」作為通報情境，並非須先取得足以定罪的完整證據。", "台湾の現行「児童及少年福利與權益保障法」53条では、ソーシャルワーカーなどの義務通報者が業務中に、児童・青少年が法定の傷害や不適切な扱いを受けたことなどを知った場合、直ちに所管当局へ通報し、遅くとも24時間を超えてはならないと定めています。衛生福利部の制度説明も「不適切な扱いを受けた疑い」を通報場面としており、有罪認定に足りる完全な証拠を先に得ることを求めてはいません。"],
  ["查看第53條", "53条を確認"],
  ["查看衛福部說明", "衛生福利部の説明を確認"],
  ["個案責任仍由司法認定", "個別事案の責任は司法が判断する"],
  ["通報的作用，是啟動主管機關的分級、調查與保護程序，不等於認定照顧者施虐，也不等於刑事定罪或必然進行緊急安置。", "通報は、所管当局による振り分け、調査、保護の手続を始めるものです。養育者が虐待したとの認定でも、刑事上の有罪判決でもなく、必ず緊急措置になるという意味でもありません。"],
  ["本文屬旁聽記憶、報導資料及文學性敘事整理，不代表法院已對白麗芳、兒盟或其他相關人員的法律責任作成認定。個案是否違反通報義務、與損害結果有無法律因果關係，以及是否應負民事、行政或刑事責任，仍應依行為當時的法規、完整證據與法院裁判判斷。", "本文は、傍聴時の記憶、報道資料、文学的な叙述を整理したものであり、裁判所が白麗芳、児童福祉連盟、その他の関係者の法的責任を認定したことを意味しません。個別事案で通報義務違反があったか、損害結果との法的因果関係があるか、民事・行政・刑事上の責任を負うかは、行為当時の法令、証拠全体、裁判所の判断に基づいて決められます。"],
  ["願下一個孩子，在傷害發生以前，就有人伸手接住。", "次の子どもに、傷つく前に誰かの手が届きますように。"],
  ["護童行動聯盟・法院旁聽・案件追蹤・制度倡議", "子ども保護行動連盟・裁判傍聴・事件追跡・制度提言"],
  ["回到頁首", "ページ上部へ"],
];

const attrPairs = {
  en: [
    ["剴剴案庭訊散文與證詞專題：完整節錄白麗芳被反覆追問兒虐辨識、疑似通報、訪視與保護責任的庭上問答。", "Kaikai case courtroom essay and testimony feature: a complete translated excerpt of repeated questioning of Bai Lifang about recognizing child abuse, reporting suspected abuse, visits, and protective responsibility."],
    ["護童行動聯盟", "Child Protection Action Alliance"],
    ["那一聲質問，落在每一個大人的心上", "The Question That Landed in Every Adult’s Heart"],
    ["從三小時基礎課程到三次警訊，完整節錄白麗芳被反覆追問兒虐辨識、疑似通報與保護責任的庭上問答。", "From a three-hour basic course to three warning signs: a complete translated excerpt of repeated questioning of Bai Lifang about recognizing abuse, reporting suspicion, and protective responsibility."],
    ["多元觀察", "Multiple Perspectives"],
    ["完整節錄白麗芳被反覆追問兒虐辨識、疑似通報與保護責任的庭上問答。", "A complete translated excerpt of repeated questioning of Bai Lifang about recognizing abuse, reporting suspicion, and protective responsibility."],
    ["回到護童行動聯盟首頁", "Return to the Child Protection Action Alliance home page"],
    ["頁面導覽", "Page navigation"],
    ["象徵剴剴的紙雕與陶土藝術形象", "Symbolic paper-and-clay artwork representing Kaikai"],
    ["以莫蘭迪色紙雕與陶土呈現的幼童象徵形象，孩子手持一顆小紙星，周圍有三片白色紙瓣。", "A symbolic child rendered in muted paper-cut and clay art, holding a small paper star and surrounded by three white paper petals."],
    ["法庭插畫：胡原碩法官質問兒盟前執行長白麗芳，圖中署名來源為《報導者》、法庭插畫陳靖宜。", "Courtroom illustration of Judge Hu Yuanshuo questioning former CWLF chief executive Bai Lifang; the image credits The Reporter and courtroom illustrator Chen Jingyi."],
    ["證詞資料說明", "Testimony information"],
    ["證詞閱讀重點", "Testimony reading guide"],
    ["結語", "Closing message"],
  ],
  ja: [
    ["剴剴案庭訊散文與證詞專題：完整節錄白麗芳被反覆追問兒虐辨識、疑似通報、訪視與保護責任的庭上問答。", "カイカイ事件の法廷エッセイと証言特集。虐待の認識、疑いの通報、訪問、保護責任について白麗芳が繰り返し問われた質疑を、傍聴メモから全編翻訳しています。"],
    ["護童行動聯盟", "子ども保護行動連盟"],
    ["那一聲質問，落在每一個大人的心上", "あの問いは、すべての大人の心に落ちた"],
    ["從三小時基礎課程到三次警訊，完整節錄白麗芳被反覆追問兒虐辨識、疑似通報與保護責任的庭上問答。", "3時間の基礎研修から三つの警告の兆候まで。虐待の認識、疑いの通報、保護責任について白麗芳が繰り返し問われた質疑を、傍聴メモから全編翻訳。"],
    ["多元觀察", "多角的考察"],
    ["完整節錄白麗芳被反覆追問兒虐辨識、疑似通報與保護責任的庭上問答。", "虐待の認識、疑いの通報、保護責任について白麗芳が繰り返し問われた質疑を、傍聴メモから全編翻訳。"],
    ["回到護童行動聯盟首頁", "子ども保護行動連盟のホームへ戻る"],
    ["頁面導覽", "ページ内ナビゲーション"],
    ["象徵剴剴的紙雕與陶土藝術形象", "カイカイを象徴する紙彫刻と粘土造形"],
    ["以莫蘭迪色紙雕與陶土呈現的幼童象徵形象，孩子手持一顆小紙星，周圍有三片白色紙瓣。", "落ち着いた色彩の紙彫刻と粘土造形による子どもの象徴像。小さな紙の星を手にし、三枚の白い紙の花びらに囲まれている。"],
    ["法庭插畫：胡原碩法官質問兒盟前執行長白麗芳，圖中署名來源為《報導者》、法庭插畫陳靖宜。", "法廷イラスト：胡原碩裁判官が児童福祉連盟元執行長の白麗芳に質問する場面。画像には『報導者（The Reporter）』、法廷画・陳靖宜とクレジットされています。"],
    ["證詞資料說明", "証言情報"],
    ["證詞閱讀重點", "証言を読むポイント"],
    ["結語", "結び"],
  ],
};

function getConverter() {
  const siteSource = fs.readFileSync(path.join(ROOT, "site.js"), "utf8");
  const end = siteSource.indexOf("const origText");
  if (end < 0) throw new Error("Cannot locate the Traditional-to-Simplified conversion tables.");
  const context = {};
  const prelude = siteSource.slice(0, end);
  const factory = [
    prelude,
    "globalThis.convertForBuild = function(value) {",
    "  if (!value) return value;",
    "  if (Object.prototype.hasOwnProperty.call(exactMap, value)) return exactMap[value];",
    "  let converted = value;",
    "  sortedPairs.forEach(function(pair) { converted = converted.split(pair[0]).join(pair[1]); });",
    "  let output = '';",
    "  for (const character of converted) output += Object.prototype.hasOwnProperty.call(charMap, character) ? charMap[character] : character;",
    "  return output;",
    "};",
  ].join("\n");
  vm.runInNewContext(factory, context);
  return context.convertForBuild;
}

function translateTextNodes(html, pairs, locale) {
  const translations = new Map(pairs);
  const uniqueRequired = new Set();
  html.replace(/>([^<]+)</gs, function (_match, raw) {
    const value = raw.trim();
    if (/[\u3400-\u9fff]/u.test(value)) uniqueRequired.add(value);
    return _match;
  });
  const missing = [...uniqueRequired].filter(function (value) { return !translations.has(value); });
  if (missing.length) {
    throw new Error(locale + " is missing visible translations:\n" + missing.join("\n"));
  }
  return html.replace(/>([^<]+)</gs, function (match, raw) {
    const value = raw.trim();
    if (!translations.has(value)) return match;
    return ">" + raw.replace(value, translations.get(value)) + "<";
  });
}

function replaceRequired(html, pairs, locale) {
  const ordered = [...pairs].sort(function (left, right) { return right[0].length - left[0].length; });
  for (const pair of ordered) {
    if (!html.includes(pair[0])) throw new Error(locale + " cannot find attribute text: " + pair[0]);
    html = html.split(pair[0]).join(pair[1]);
  }
  return html;
}

function alternateMarkup() {
  return [
    '    <link rel="alternate" hreflang="zh-Hant" href="' + editions["zh-Hant"] + '" />',
    '    <link rel="alternate" hreflang="zh-Hans" href="' + editions["zh-Hans"] + '" />',
    '    <link rel="alternate" hreflang="en" href="' + editions.en + '" />',
    '    <link rel="alternate" hreflang="ja" href="' + editions.ja + '" />',
    '    <link rel="alternate" hreflang="x-default" href="' + editions["zh-Hant"] + '" />',
  ].join("\n");
}

function localizeStructure(html, locale) {
  const homes = {
    "zh-Hans": PUBLIC_ROOT + "?lang=zh-Hans",
    en: PUBLIC_ROOT + "en/",
    ja: PUBLIC_ROOT + "ja/",
  };
  const pinned = {
    "zh-Hans": PUBLIC_ROOT + "news/pinned-reports/?lang=zh-Hans",
    en: PUBLIC_ROOT + "en/news/pinned-reports/",
    ja: PUBLIC_ROOT + "ja/news/pinned-reports/",
  };
  const canonicals = {
    "zh-Hans": editions["zh-Hans"],
    en: editions.en,
    ja: editions.ja,
  };
  const ogLocales = {"zh-Hans": "zh_CN", en: "en_US", ja: "ja_JP"};

  html = html.replace('<html lang="zh-Hant">', '<html lang="' + locale + '">');
  html = html.replace(
    /    <link rel="alternate" hreflang="zh-Hant"[\s\S]*?    <link rel="alternate" hreflang="x-default"[^>]+\/>/,
    alternateMarkup(),
  );
  html = html.replace(
    '    <link rel="canonical" href="' + editions["zh-Hant"] + '" />',
    '    <link rel="canonical" href="' + canonicals[locale] + '" />',
  );
  html = html.replace(
    '<meta property="og:url" content="' + editions["zh-Hant"] + '" />',
    '<meta property="og:url" content="' + canonicals[locale] + '" />',
  );
  html = html.replace('<meta property="og:locale" content="zh_TW" />', '<meta property="og:locale" content="' + ogLocales[locale] + '" />');
  html = html.replace(/\s*<script>try\{const l=new URLSearchParams[\s\S]*?<\/script>/, "");
  html = html.replace(/\s*<script src="\.\.\/\.\.\/site\.js[^>]*><\/script>/, "");
  html = html.replace('  <body data-hans="supported">', "  <body>");
  html = html.replaceAll('href="assets/', 'href="' + PUBLIC_ROOT + ARTICLE_ROUTE + 'assets/');
  html = html.replaceAll('src="assets/', 'src="' + PUBLIC_ROOT + ARTICLE_ROUTE + 'assets/');
  html = html.replace('<a class="brand" href="../../"', '<a class="brand" href="' + homes[locale] + '"');
  html = html.replace('<a href="../../">', '<a href="' + homes[locale] + '">');
  html = html.replace('<a href="../pinned-reports/">', '<a href="' + pinned[locale] + '">');
  html = html.replace(/four-language-toolbar-20260901\.css\?v=[^"]+/, "four-language-toolbar-20260901.css?v=" + VERSION);
  html = html.replace(/four-language-toolbar-20260901\.js\?v=[^"]+/, "four-language-toolbar-20260901.js?v=" + VERSION);
  html = html.replace(/<meta property="article:modified_time" content="[^"]+" \/>/, '<meta property="article:modified_time" content="2026-09-05T09:45:00+08:00" />');
  return html;
}

function ensureDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
}

enPairs.push(
  ["關鍵質問與完整回應","The key question and the full response"],
  ["以下整段節錄自12月18日旁聽筆記；現場中斷與證人其後的回答一併保留。","The following passage is excerpted in full from the December 18 courtroom notes, including the interruption and the witness’s subsequent response."],
  ["如果在9月第一次訪視、10月再次訪視，到11月出現這麼巨大的落差，社工是否可以認定小朋友沒有受到妥善照顧？","If the first visit was in September, another in October, and such a drastic deterioration appeared by November, could the social worker conclude that the child was not receiving proper care?"],
  ["我沒有參與這個個案，也沒有看過完整紀錄，所以沒有辦法直接做出推論。但我相信當下的決定一定有很多考量。我只能說，一般情況下，當孩子出現狀況時，社工會希望孩子先就醫，例如看小兒科或牙醫，也希望透過醫療專業來協助判斷。另一方面，在出養的經驗中，孩子在轉換照顧環境時，常常會出現適應問題，所以當時團隊的討論，可能會先朝「適應困難」的方向來理解。","I was not involved in this case and have not seen the complete records, so I cannot draw a direct conclusion. But I believe many considerations informed the decision at the time. Generally, when a child develops problems, social workers want the child to see a doctor first, such as a pediatrician or dentist, and seek medical expertise to help assess the situation. In adoption work, children often have adjustment difficulties when their care environment changes, so the team may initially have understood the situation as an adjustment problem."],
  ["依你的認知，社工在面對這麼大的落差時，應該要做什麼？","In your understanding, what should a social worker do when faced with such a drastic change?"],
  ["應該要進行討論。討論之後，可能還需要時間蒐集更多資訊；如果認為現有資料仍不足以判斷，也可能會決定先讓孩子去看醫生。","There should be a discussion. After that, more time may be needed to gather information. If the available information is still considered insufficient to make a judgment, they may decide to have the child see a doctor first."],
  ["所以社工要做的，就只是讓他去看醫生？","So all the social worker should do is have him see a doctor?"],
  ["事後回頭看，會覺得也許還應該再多做一些。但因為我沒有實際參與這個案子，只能說，每一個判斷，都是基於當下所掌握的資訊、諮詢結果，以及過往的經驗與專業知識所做出的。","Looking back, one may feel that more should have been done. But I was not actually involved in this case. All I can say is that each judgment was based on the information available at the time, consultation results, and past experience and professional knowledge."],
  ["那到底要到什麼樣的情況，兒盟才會認為有通報義務需要通報？一定要打到全身是傷、斷手斷腳才算嗎？","Then what exactly would it take for the Child Welfare League Foundation to consider itself obligated to report? Must a child be beaten until their whole body is covered in injuries, with broken arms and legs, before it counts?"],
  ["（旁聽民眾情緒激動哭泣，現場一度中斷）","(People in the public gallery cried in distress, and proceedings were briefly interrupted.)"],
  ["我沒有辦法直接回答當時的具體狀況。但依照我們以往的管理經驗，如果有明確的證據認為孩子可能遭受虐待，就應該要通報。不過，法律上所謂的責任通報，其實是「疑似」受虐或不當對待，就有通報義務。","I cannot directly answer about the specific situation at the time. But based on our past management experience, if there is clear evidence suggesting that a child may have been abused, it should be reported. However, the legal duty to report actually arises when abuse or mistreatment is suspected."],
  ["我也曾向檢察官解釋過，檢察官的提問往往是複合式的，例如先播放影片請我判斷是否為受虐，我回答無法判斷；接著談到責任通報，我又說疑似就應該通報；後面又連結到通報之後是否會進行緊急安置。這些不是一句話可以簡單說明清楚的。","I also explained to the prosecutor that the questions often combine several issues. For example, a video is shown and I am asked whether it depicts abuse; I answer that I cannot determine that. Then the question turns to mandatory reporting, and I say that suspicion should be reported. This is then linked to whether emergency placement would follow a report. These issues cannot be explained clearly in a single sentence."],
  ["查看白麗芳證人旁聽紀錄","Read the courtroom notes for witness Bai Lifang"],
  ["那句話落下，旁聽民眾情緒激動哭泣，現場一度中斷。白麗芳未直接回答當時的具體狀況，其後先提到「明確證據」，再說明「疑似」受虐或不當對待就有通報義務。","After that question, people in the public gallery cried in distress and proceedings were briefly interrupted. Bai Lifang did not directly address the specific circumstances at the time. She subsequently referred first to “clear evidence,” then explained that suspected abuse or mistreatment triggers the duty to report."],
  ["白麗芳","Bai Lifang"]
);
jaPairs.push(
  ["關鍵質問與完整回應","核心となる問いと、その後の応答"],
  ["以下整段節錄自12月18日旁聽筆記；現場中斷與證人其後的回答一併保留。","以下は12月18日の傍聴メモからの一連の抜粋です。中断と、その後の証人の回答も残しています。"],
  ["如果在9月第一次訪視、10月再次訪視，到11月出現這麼巨大的落差，社工是否可以認定小朋友沒有受到妥善照顧？","9月の初回訪問、10月の再訪問から、11月にはこれほど大きな変化が出ていたなら、ソーシャルワーカーは子どもが適切に養育されていないと判断できるのではありませんか。"],
  ["我沒有參與這個個案，也沒有看過完整紀錄，所以沒有辦法直接做出推論。但我相信當下的決定一定有很多考量。我只能說，一般情況下，當孩子出現狀況時，社工會希望孩子先就醫，例如看小兒科或牙醫，也希望透過醫療專業來協助判斷。另一方面，在出養的經驗中，孩子在轉換照顧環境時，常常會出現適應問題，所以當時團隊的討論，可能會先朝「適應困難」的方向來理解。","私はこのケースに関与しておらず、記録全体も見ていないため、直接推論することはできません。ただ、当時の判断には多くの考慮があったと思います。一般に子どもに異変があれば、まず小児科や歯科などを受診し、医療の専門性を通じて判断を助けてもらいたいと考えます。また、養子縁組支援では、養育環境が変わると子どもに適応上の問題がよく起きます。そのため当時のチームも、まず「適応の困難」として理解しようとした可能性があります。"],
  ["依你的認知，社工在面對這麼大的落差時，應該要做什麼？","あなたの認識では、これほど大きな変化に直面したとき、ソーシャルワーカーは何をすべきですか。"],
  ["應該要進行討論。討論之後，可能還需要時間蒐集更多資訊；如果認為現有資料仍不足以判斷，也可能會決定先讓孩子去看醫生。","話し合うべきです。その後、さらに情報を集める時間が必要かもしれません。現状の資料では判断できないと考えれば、まず子どもを受診させるという決定もあり得ます。"],
  ["所以社工要做的，就只是讓他去看醫生？","では、ソーシャルワーカーがすべきことは、受診させるだけなのですか。"],
  ["事後回頭看，會覺得也許還應該再多做一些。但因為我沒有實際參與這個案子，只能說，每一個判斷，都是基於當下所掌握的資訊、諮詢結果，以及過往的經驗與專業知識所做出的。","振り返れば、もっとすべきことがあったと思うかもしれません。ただ、私は実際に関与していません。言えるのは、一つ一つの判断は、当時把握していた情報、相談の結果、過去の経験と専門知識に基づいていたということです。"],
  ["那到底要到什麼樣的情況，兒盟才會認為有通報義務需要通報？一定要打到全身是傷、斷手斷腳才算嗎？","では、一体どのような状況になれば、児童福祉連盟は通報義務があり、通報すべきだと考えるのですか。全身が傷だらけになり、手足の骨が折れるまで殴られなければ、該当しないのですか。"],
  ["（旁聽民眾情緒激動哭泣，現場一度中斷）","（傍聴人が感情を抑えきれず泣き、審理は一時中断した）"],
  ["我沒有辦法直接回答當時的具體狀況。但依照我們以往的管理經驗，如果有明確的證據認為孩子可能遭受虐待，就應該要通報。不過，法律上所謂的責任通報，其實是「疑似」受虐或不當對待，就有通報義務。","当時の具体的な状況について直接答えることはできません。ただ、これまでの管理経験では、子どもが虐待された可能性を示す明確な証拠があれば、通報すべきです。ただし、法律上の通報義務は、実際には虐待や不適切な扱いの「疑い」があれば生じます。"],
  ["我也曾向檢察官解釋過，檢察官的提問往往是複合式的，例如先播放影片請我判斷是否為受虐，我回答無法判斷；接著談到責任通報，我又說疑似就應該通報；後面又連結到通報之後是否會進行緊急安置。這些不是一句話可以簡單說明清楚的。","検察官にも説明しましたが、質問には複数の論点が含まれることが多いのです。例えば映像を見せられ、虐待かどうかを判断するよう求められると、判断できないと答えます。次に通報義務について聞かれると、疑いがあれば通報すべきだと答えます。さらに、通報後の緊急保護につながるかという話になります。これらは一言で簡単に説明しきれるものではありません。"],
  ["查看白麗芳證人旁聽紀錄","白麗芳証人の傍聴記録を読む"],
  ["那句話落下，旁聽民眾情緒激動哭泣，現場一度中斷。白麗芳未直接回答當時的具體狀況，其後先提到「明確證據」，再說明「疑似」受虐或不當對待就有通報義務。","その問いの後、傍聴人が泣き、審理は一時中断した。白麗芳は当時の具体的な状況には直接答えず、その後まず「明確な証拠」に言及し、続けて虐待や不適切な扱いの「疑い」があれば通報義務があると説明した。"],
  ["白麗芳","白麗芳"]
);

enPairs.push(["法官", "Judge"]);
jaPairs.push(["法官", "裁判官"]);
const source = fs.readFileSync(SOURCE_PATH, "utf8");
const convertForBuild = getConverter();

let hans = convertForBuild(source);
hans = localizeStructure(hans, "zh-Hans");

let en = translateTextNodes(source, enPairs, "en");
en = replaceRequired(en, attrPairs.en, "en");
en = localizeStructure(en, "en");

let ja = translateTextNodes(source, jaPairs, "ja");
ja = replaceRequired(ja, attrPairs.ja, "ja");
ja = localizeStructure(ja, "ja");

const outputs = [
  [path.join(ROOT, ARTICLE_ROUTE, "zh-Hans/index.html"), hans],
  [path.join(ROOT, "en", ARTICLE_ROUTE, "index.html"), en],
  [path.join(ROOT, "ja", ARTICLE_ROUTE, "index.html"), ja],
];
for (const output of outputs) {
  ensureDirectory(output[0]);
  fs.writeFileSync(output[0], output[1], "utf8");
  console.log(path.relative(ROOT, output[0]));
}
