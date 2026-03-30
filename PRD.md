# 프로젝트 이름: 운세 에이전트 (Fortune Agent - 가칭)

## 1. 프로젝트 개요
AI 기술을 결합하여 사주, 타로, 꿈해몽 서비스를 제공하는 통합 웹/앱 서비스입니다. 사용자의 고민에 대해 데이터 기반의 분석과 AI의 공감 능력을 결합한 개인화된 상담 경험을 제공합니다.

## 2. 주요 기능 (MVP)
### ① 사주 (Saju)
- 만세력 라이브러리를 이용한 사주팔자(8자) 및 대운 산출.
- LLM을 활용하여 격국, 용신, 일간 중심의 현대적 해석 제공.
- 금전운, 연애운, 직장운 등 카테고리별 분석.

### ② 타로 (Tarot)
- 78장 타로 카드 데이터베이스 구축 (이미지 및 키워드).
- 사용자의 질문(고민)에 따른 랜덤 카드 뽑기 로직.
- 카드 상징과 사용자 질문을 결합한 AI 스토리텔링 해석.

### ③ 꿈해몽 (Dream Interpretation)
- 자연어 기반 꿈 내용 입력.
- RAG(검색 증강 생성)를 활용하여 전통적 해몽 데이터와 매칭.
- 심리학적 관점과 운세적 관점을 결합한 분석 결과 제공.

## 3. 기술 스택 (Proposed)
- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React (Icons)
- **Backend:** Python (FastAPI) or Next.js API Routes
- **AI Orchestration:** Dify (External API) 또는 LangChain/LangGraph
- **Database:** PostgreSQL (Supabase 추천)
- **Deployment:** Vercel

## 4. 사용자 여정 (User Flow)
1. 메인 화면에서 서비스 선택 (사주/타로/꿈해몽).
2. 정보 입력 (생년월일시 또는 고민 내용).
3. AI 에이전트의 분석 프로세스 진행 (애니메이션 효과).
4. 결과 리포트 출력 및 저장/공유 기능.