export interface TarotCard {
  id: number;
  name: string;
  nameKor: string;
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  symbol: string;
  keywords: string[];
  meaning: string;
}

export interface DrawnCard extends TarotCard {
  position: '상황' | '조언' | '결과';
  reversed: boolean;
}

const M = 'major';
const W = 'wands';
const C = 'cups';
const S = 'swords';
const P = 'pentacles';

export const TAROT_DECK: TarotCard[] = [
  // ── Major Arcana ──────────────────────────────────────────────────────────
  { id:  0, name:'The Fool',            nameKor:'바보',            suit:M, symbol:'☆', keywords:['새로운 시작','순수','모험','가능성'],         meaning:'무한한 가능성의 새 출발, 두려움 없는 도전과 자유로운 영혼' },
  { id:  1, name:'The Magician',        nameKor:'마법사',          suit:M, symbol:'∞', keywords:['의지력','창조','실현','집중'],                meaning:'잠재력 발현과 의지의 힘으로 현실을 변화시키는 능력' },
  { id:  2, name:'The High Priestess',  nameKor:'여사제',          suit:M, symbol:'☽', keywords:['직관','신비','내면의 지혜','비밀'],            meaning:'숨겨진 진실과 깊은 내면의 목소리에 귀 기울이는 시간' },
  { id:  3, name:'The Empress',         nameKor:'여황제',          suit:M, symbol:'♀', keywords:['풍요','창조성','모성','자연'],                 meaning:'풍요로움과 창조적 에너지, 사랑과 아름다움의 번성' },
  { id:  4, name:'The Emperor',         nameKor:'황제',            suit:M, symbol:'♂', keywords:['권위','안정','구조','리더십'],                 meaning:'질서와 규율로 세워진 견고한 기반, 강한 의지의 지배력' },
  { id:  5, name:'The Hierophant',      nameKor:'교황',            suit:M, symbol:'✝', keywords:['전통','지혜','영성','가르침'],                 meaning:'검증된 전통과 영적 지혜, 믿음과 제도 속에서의 성장' },
  { id:  6, name:'The Lovers',          nameKor:'연인',            suit:M, symbol:'♡', keywords:['사랑','선택','조화','연결'],                   meaning:'마음 깊은 연결과 중요한 선택, 가치에 따른 결정' },
  { id:  7, name:'The Chariot',         nameKor:'전차',            suit:M, symbol:'◈', keywords:['의지','승리','추진력','통제'],                 meaning:'강한 의지와 자기 통제로 이루어내는 승리와 전진' },
  { id:  8, name:'Strength',            nameKor:'힘',              suit:M, symbol:'⊕', keywords:['용기','인내','내면의 힘','자기확신'],           meaning:'부드러운 강인함과 인내로 극복하는 내면의 진정한 힘' },
  { id:  9, name:'The Hermit',          nameKor:'은둔자',          suit:M, symbol:'⊙', keywords:['내성','고독','지혜','성찰'],                   meaning:'내면의 빛을 따라가는 깊은 성찰과 지혜의 시간' },
  { id: 10, name:'Wheel of Fortune',    nameKor:'운명의 수레바퀴', suit:M, symbol:'⊛', keywords:['변화','운명','순환','행운'],                   meaning:'삶의 순환과 운명의 전환, 변화의 흐름을 받아들이는 지혜' },
  { id: 11, name:'Justice',             nameKor:'정의',            suit:M, symbol:'⚖', keywords:['공정','균형','진실','결과'],                   meaning:'행동의 결과와 공정한 균형, 진실에 기반한 올바른 판단' },
  { id: 12, name:'The Hanged Man',      nameKor:'매달린 사람',     suit:M, symbol:'♃', keywords:['희생','전환','새 시각','기다림'],              meaning:'다른 관점에서 보는 깨달음, 자발적 희생이 가져오는 통찰' },
  { id: 13, name:'Death',               nameKor:'죽음',            suit:M, symbol:'⚸', keywords:['변환','끝과 시작','해방','재생'],              meaning:'낡은 것의 종말과 새로운 것의 탄생, 필연적 변화와 해방' },
  { id: 14, name:'Temperance',          nameKor:'절제',            suit:M, symbol:'≈', keywords:['균형','인내','조화','치유'],                   meaning:'절제와 균형 속에서 이루어지는 치유와 통합의 과정' },
  { id: 15, name:'The Devil',           nameKor:'악마',            suit:M, symbol:'◆', keywords:['속박','집착','물질','환상'],                   meaning:'자신을 묶는 집착과 두려움, 의식하면 끊을 수 있는 사슬' },
  { id: 16, name:'The Tower',           nameKor:'탑',              suit:M, symbol:'⚡', keywords:['격변','각성','파괴','해방'],                   meaning:'기존 구조의 붕괴와 갑작스러운 각성, 진실을 드러내는 변혁' },
  { id: 17, name:'The Star',            nameKor:'별',              suit:M, symbol:'★', keywords:['희망','치유','영감','믿음'],                   meaning:'어둠 속에 빛나는 희망과 치유, 미래에 대한 순수한 믿음' },
  { id: 18, name:'The Moon',            nameKor:'달',              suit:M, symbol:'☽', keywords:['환상','불안','무의식','직관'],                 meaning:'무의식의 세계와 숨겨진 두려움, 혼란 속에서 찾는 직관' },
  { id: 19, name:'The Sun',             nameKor:'태양',            suit:M, symbol:'☀', keywords:['기쁨','성공','활력','명확성'],                 meaning:'밝고 긍정적인 에너지, 성공과 행복이 충만한 최고의 순간' },
  { id: 20, name:'Judgement',           nameKor:'심판',            suit:M, symbol:'♪', keywords:['각성','재생','용서','소명'],                   meaning:'과거를 정리하고 진정한 소명을 깨닫는 영혼의 각성' },
  { id: 21, name:'The World',           nameKor:'세계',            suit:M, symbol:'◎', keywords:['완성','성취','통합','자유'],                   meaning:'여정의 완성과 온전한 통합, 모든 것이 하나가 되는 충만함' },

  // ── Wands (완드) ──────────────────────────────────────────────────────────
  { id:22, name:'Ace of Wands',    nameKor:'완드 에이스', suit:W, symbol:'⁂', keywords:['창조적 시작','열정','영감','잠재력'],    meaning:'새로운 열정과 창조적 영감의 불꽃이 타오르는 시작' },
  { id:23, name:'Two of Wands',    nameKor:'완드 2',      suit:W, symbol:'⁂', keywords:['계획','비전','결정','탐구'],            meaning:'미래를 내다보는 비전과 대담한 계획, 탐구의 시작' },
  { id:24, name:'Three of Wands',  nameKor:'완드 3',      suit:W, symbol:'⁂', keywords:['확장','기회','선견지명','성장'],        meaning:'노력의 결과가 나타나고 새로운 기회가 펼쳐지는 단계' },
  { id:25, name:'Four of Wands',   nameKor:'완드 4',      suit:W, symbol:'⁂', keywords:['축하','안정','공동체','기쁨'],          meaning:'목표 달성의 기쁨과 안정, 함께 나누는 축하의 시간' },
  { id:26, name:'Five of Wands',   nameKor:'완드 5',      suit:W, symbol:'⁂', keywords:['갈등','경쟁','도전','긴장'],            meaning:'다양한 관점 충돌과 건강한 경쟁, 창의적 긴장 속 성장' },
  { id:27, name:'Six of Wands',    nameKor:'완드 6',      suit:W, symbol:'⁂', keywords:['승리','인정','자신감','리더십'],        meaning:'노력의 결실과 당당한 승리, 주변의 인정과 존경' },
  { id:28, name:'Seven of Wands',  nameKor:'완드 7',      suit:W, symbol:'⁂', keywords:['방어','끈기','도전','자기주장'],        meaning:'압박에 맞서 자신의 입장을 지키는 용기와 끈기' },
  { id:29, name:'Eight of Wands',  nameKor:'완드 8',      suit:W, symbol:'⁂', keywords:['빠른 변화','행동','전진','소식'],       meaning:'상황이 빠르게 전개되고 긍정적 에너지가 집중되는 순간' },
  { id:30, name:'Nine of Wands',   nameKor:'완드 9',      suit:W, symbol:'⁂', keywords:['회복력','경계','끈기','피로'],          meaning:'힘든 여정 끝에도 포기하지 않는 강인한 회복력' },
  { id:31, name:'Ten of Wands',    nameKor:'완드 10',     suit:W, symbol:'⁂', keywords:['부담','책임','완성','번아웃'],          meaning:'무거운 책임감과 부담, 목표 완수 후 필요한 휴식' },
  { id:32, name:'Page of Wands',   nameKor:'완드 페이지', suit:W, symbol:'⁂', keywords:['탐구','열정','새 아이디어','모험'],     meaning:'새로운 아이디어와 모험에 들뜬 자유로운 열정' },
  { id:33, name:'Knight of Wands', nameKor:'완드 기사',   suit:W, symbol:'⁂', keywords:['충동적 행동','에너지','추진력','여행'], meaning:'뜨거운 열정으로 빠르게 행동하는 충동적 에너지' },
  { id:34, name:'Queen of Wands',  nameKor:'완드 여왕',   suit:W, symbol:'⁂', keywords:['카리스마','자신감','창의성','독립'],    meaning:'매력적 카리스마와 강한 의지, 창의적 리더십' },
  { id:35, name:'King of Wands',   nameKor:'완드 왕',     suit:W, symbol:'⁂', keywords:['비전','리더십','기업가','성취'],        meaning:'원대한 비전과 영향력 있는 리더십으로 이루는 성취' },

  // ── Cups (컵) ─────────────────────────────────────────────────────────────
  { id:36, name:'Ace of Cups',    nameKor:'컵 에이스', suit:C, symbol:'◇', keywords:['새 감정','사랑','직관','영적 각성'],    meaning:'순수한 감정의 시작과 넘치는 사랑, 깊은 영적 각성' },
  { id:37, name:'Two of Cups',    nameKor:'컵 2',      suit:C, symbol:'◇', keywords:['파트너십','연결','사랑','상호이해'],    meaning:'두 사람 사이의 깊은 연결과 조화로운 감정의 교류' },
  { id:38, name:'Three of Cups',  nameKor:'컵 3',      suit:C, symbol:'◇', keywords:['축하','우정','기쁨','공동체'],          meaning:'함께하는 기쁨과 우정, 사람들과 나누는 행복한 축하' },
  { id:39, name:'Four of Cups',   nameKor:'컵 4',      suit:C, symbol:'◇', keywords:['권태','내성','기회 놓침','성찰'],       meaning:'내면으로 향하는 시선, 주변의 기회를 놓치는 무감각' },
  { id:40, name:'Five of Cups',   nameKor:'컵 5',      suit:C, symbol:'◇', keywords:['상실','슬픔','후회','수용'],            meaning:'상실과 슬픔 뒤에도 남아있는 것들, 수용과 치유의 시작' },
  { id:41, name:'Six of Cups',    nameKor:'컵 6',      suit:C, symbol:'◇', keywords:['추억','순수함','과거','향수'],          meaning:'행복했던 과거의 기억과 순수한 감정으로 돌아가는 시간' },
  { id:42, name:'Seven of Cups',  nameKor:'컵 7',      suit:C, symbol:'◇', keywords:['환상','선택','망상','꿈'],              meaning:'수많은 선택지와 환상, 현실과 꿈 사이의 혼란' },
  { id:43, name:'Eight of Cups',  nameKor:'컵 8',      suit:C, symbol:'◇', keywords:['이탈','내면 탐구','방랑','포기'],       meaning:'더 깊은 의미를 찾아 현재를 떠나는 결단과 영적 탐구' },
  { id:44, name:'Nine of Cups',   nameKor:'컵 9',      suit:C, symbol:'◇', keywords:['소원성취','만족','행복','풍요'],        meaning:'바라던 소원의 성취와 깊은 만족감, 물질적 정서적 충만함' },
  { id:45, name:'Ten of Cups',    nameKor:'컵 10',     suit:C, symbol:'◇', keywords:['행복','가족','조화','완성'],            meaning:'완벽한 감정적 충만함, 사랑하는 사람들과의 행복한 조화' },
  { id:46, name:'Page of Cups',   nameKor:'컵 페이지', suit:C, symbol:'◇', keywords:['창의성','직관','메시지','꿈'],          meaning:'창의적 영감과 감성적 메시지, 순수한 상상력의 발현' },
  { id:47, name:'Knight of Cups', nameKor:'컵 기사',   suit:C, symbol:'◇', keywords:['낭만','이상주의','감수성','제안'],      meaning:'낭만적이고 이상적인 사랑의 추구, 감성적 제안과 초대' },
  { id:48, name:'Queen of Cups',  nameKor:'컵 여왕',   suit:C, symbol:'◇', keywords:['공감','직관','감성','돌봄'],            meaning:'깊은 공감 능력과 강한 직관, 따뜻하고 지혜로운 돌봄' },
  { id:49, name:'King of Cups',   nameKor:'컵 왕',     suit:C, symbol:'◇', keywords:['감성적 성숙','지혜','균형','치유'],     meaning:'감정을 지혜롭게 다스리는 성숙함, 치유와 균형의 리더십' },

  // ── Swords (소드) ────────────────────────────────────────────────────────
  { id:50, name:'Ace of Swords',    nameKor:'소드 에이스', suit:S, symbol:'†', keywords:['명확성','진실','돌파구','결단'],         meaning:'명확한 진실과 강력한 결단, 지적 돌파구의 순간' },
  { id:51, name:'Two of Swords',    nameKor:'소드 2',      suit:S, symbol:'†', keywords:['교착','결정 회피','균형','긴장'],         meaning:'결정을 미루는 교착 상태, 균형 속의 불편한 긴장' },
  { id:52, name:'Three of Swords',  nameKor:'소드 3',      suit:S, symbol:'†', keywords:['상처','슬픔','배신','아픔'],              meaning:'마음의 상처와 배신의 고통, 치유를 위해 직면해야 할 아픔' },
  { id:53, name:'Four of Swords',   nameKor:'소드 4',      suit:S, symbol:'†', keywords:['휴식','회복','명상','충전'],              meaning:'지친 심신의 휴식과 회복, 고요 속에서 찾는 내면의 평화' },
  { id:54, name:'Five of Swords',   nameKor:'소드 5',      suit:S, symbol:'†', keywords:['갈등','패배','자존심','상처'],            meaning:'승패를 넘어서 남는 상처와 자존심 싸움의 공허함' },
  { id:55, name:'Six of Swords',    nameKor:'소드 6',      suit:S, symbol:'†', keywords:['이행','전환','회복','치유'],              meaning:'힘든 상황을 벗어나 더 나은 곳으로의 조용한 여정' },
  { id:56, name:'Seven of Swords',  nameKor:'소드 7',      suit:S, symbol:'†', keywords:['전략','기만','은밀함','영리함'],          meaning:'영리한 전략과 은밀한 계획, 진실을 숨기는 교묘함' },
  { id:57, name:'Eight of Swords',  nameKor:'소드 8',      suit:S, symbol:'†', keywords:['제한','속박','두려움','갇힘'],            meaning:'스스로 만든 한계와 두려움, 인식의 전환으로 벗어날 수 있는 속박' },
  { id:58, name:'Nine of Swords',   nameKor:'소드 9',      suit:S, symbol:'†', keywords:['불안','악몽','걱정','자기혐오'],          meaning:'밤을 지새우는 걱정과 불안, 마음속 두려움이 만들어낸 고통' },
  { id:59, name:'Ten of Swords',    nameKor:'소드 10',     suit:S, symbol:'†', keywords:['끝','배신','위기','새벽'],               meaning:'고통스러운 끝이지만 새벽이 오듯 새로운 시작이 기다림' },
  { id:60, name:'Page of Swords',   nameKor:'소드 페이지', suit:S, symbol:'†', keywords:['지적 호기심','소통','감시','아이디어'],   meaning:'날카로운 지적 호기심과 빠른 사고, 아이디어의 탐구' },
  { id:61, name:'Knight of Swords', nameKor:'소드 기사',   suit:S, symbol:'†', keywords:['결단','행동','야망','지적 힘'],           meaning:'빠르고 결단력 있는 행동, 강한 의지로 밀어붙이는 추진력' },
  { id:62, name:'Queen of Swords',  nameKor:'소드 여왕',   suit:S, symbol:'†', keywords:['명석함','독립','공정','솔직함'],          meaning:'날카로운 통찰력과 독립적 판단, 직설적이고 공정한 지혜' },
  { id:63, name:'King of Swords',   nameKor:'소드 왕',     suit:S, symbol:'†', keywords:['지성','권위','공정','진실'],              meaning:'높은 지성과 강한 권위, 진실과 정의를 수호하는 리더십' },

  // ── Pentacles (펜타클) ────────────────────────────────────────────────────
  { id:64, name:'Ace of Pentacles',    nameKor:'펜타클 에이스', suit:P, symbol:'⬡', keywords:['물질적 시작','기회','번영','안정'],       meaning:'새로운 물질적 기회와 번영의 씨앗, 안정된 기반의 시작' },
  { id:65, name:'Two of Pentacles',    nameKor:'펜타클 2',      suit:P, symbol:'⬡', keywords:['균형','적응','변화','관리'],              meaning:'바쁜 일상 속 유연한 균형 잡기, 변화에 적응하는 능력' },
  { id:66, name:'Three of Pentacles',  nameKor:'펜타클 3',      suit:P, symbol:'⬡', keywords:['협력','숙련','계획','팀워크'],            meaning:'함께 이루는 성과와 전문성, 팀워크와 계획의 결실' },
  { id:67, name:'Four of Pentacles',   nameKor:'펜타클 4',      suit:P, symbol:'⬡', keywords:['보수','안정','집착','절약'],              meaning:'물질적 안정을 지키려는 집착, 변화를 두려워하는 보수성' },
  { id:68, name:'Five of Pentacles',   nameKor:'펜타클 5',      suit:P, symbol:'⬡', keywords:['결핍','역경','고난','소외'],              meaning:'물질적 어려움과 정서적 소외, 도움의 손길을 찾는 시간' },
  { id:69, name:'Six of Pentacles',    nameKor:'펜타클 6',      suit:P, symbol:'⬡', keywords:['관대함','나눔','균형','자선'],            meaning:'풍요를 나누는 관대함과 균형, 주고받는 흐름의 조화' },
  { id:70, name:'Seven of Pentacles',  nameKor:'펜타클 7',      suit:P, symbol:'⬡', keywords:['인내','평가','성장','수확'],              meaning:'노력의 결과를 점검하는 시간, 인내하며 기다리는 수확기' },
  { id:71, name:'Eight of Pentacles',  nameKor:'펜타클 8',      suit:P, symbol:'⬡', keywords:['숙련','노력','집중','완성'],              meaning:'꾸준한 노력으로 기술을 연마하는 헌신과 장인 정신' },
  { id:72, name:'Nine of Pentacles',   nameKor:'펜타클 9',      suit:P, symbol:'⬡', keywords:['독립','풍요','자립','우아함'],            meaning:'스스로 이룬 풍요로운 독립, 자립과 세련된 삶의 즐거움' },
  { id:73, name:'Ten of Pentacles',    nameKor:'펜타클 10',     suit:P, symbol:'⬡', keywords:['부','유산','가족','완성'],                meaning:'세대를 이어가는 풍요와 안정, 물질적 성공의 완성' },
  { id:74, name:'Page of Pentacles',   nameKor:'펜타클 페이지', suit:P, symbol:'⬡', keywords:['배움','현실적','근면','야망'],            meaning:'실용적인 목표를 향한 배움과 꾸준한 첫걸음' },
  { id:75, name:'Knight of Pentacles', nameKor:'펜타클 기사',   suit:P, symbol:'⬡', keywords:['책임감','끈기','신뢰성','근면'],          meaning:'신중하고 믿음직한 태도로 꾸준히 나아가는 책임감' },
  { id:76, name:'Queen of Pentacles',  nameKor:'펜타클 여왕',   suit:P, symbol:'⬡', keywords:['실용적','풍요','돌봄','현실감'],          meaning:'풍요로운 환경을 만들어가는 실용적 지혜와 따뜻한 돌봄' },
  { id:77, name:'King of Pentacles',   nameKor:'펜타클 왕',     suit:P, symbol:'⬡', keywords:['성공','부','리더십','안정'],              meaning:'탁월한 현실 감각과 물질적 성공, 신뢰받는 안정적 리더십' },
];

/** 중복 없이 n장 랜덤 추출 */
export function drawCards(n: number): DrawnCard[] {
  const positions: Array<'상황' | '조언' | '결과'> = ['상황', '조언', '결과'];
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map((card, i) => ({
    ...card,
    position: positions[i] ?? '결과',
    reversed: Math.random() < 0.25,
  }));
}

/** 카드 데이터를 AI 프롬프트용 문자열로 변환 */
export function formatCardsForPrompt(cards: DrawnCard[]): string {
  return cards
    .map(c => `[${c.position}] ${c.nameKor}(${c.name})${c.reversed ? ' (역방향)' : ''}\n  키워드: ${c.keywords.join(', ')}\n  의미: ${c.meaning}`)
    .join('\n\n');
}
