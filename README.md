# iqherb - OpenFunding IT Hub 🌐

## 프로젝트 개요
**iqherb**는 Cloudflare Pages + D1 + Hono로 만든 IT 프로젝트 펀딩 및 소개 플랫폼입니다. 다국어(한국어/영어/중국어)를 지원하며, 유튜브 영상을 통한 프로젝트 홍보 기능을 제공합니다.

### 주요 기능
- ✅ 프로젝트 관리 (CRUD) - 다국어 지원
- ✅ 유튜브 링크 5개 개별 입력 및 표시
- ✅ 썸네일 클릭 시 재생 (자동재생 X)
- ✅ 2~5개 영상 세로 배열
- ✅ 펀딩 유형 선택 (투자/기부)
- ✅ 카테고리별 분류 (의료/투자/기타)
- ✅ Cloudflare D1 데이터베이스 연동
- ✅ 반응형 디자인 (TailwindCSS)
- ✅ 관리자 페이지 (프로젝트 생성/편집/삭제)

## 🌐 URL

### 프로덕션 (Cloudflare Pages)
- **메인 페이지**: https://iqherb.org
- **관리자 페이지**: https://iqherb.org/#/admin
- **최신 배포**: https://68b4e0ca.iqherb.pages.dev
- **GitHub**: https://github.com/langsb16-collab/-iqherb

### 개발 환경 (Sandbox)
- **앱 URL**: https://3000-i9crqm43nfb3kkn3ut1sl-2e77fc33.sandbox.novita.ai
- **로컬 개발 서버**: http://localhost:3000

### API 엔드포인트
- `GET /api/projects` - 모든 프로젝트 가져오기
- `POST /api/projects` - 새 프로젝트 추가
- `PUT /api/projects/:id` - 프로젝트 수정
- `DELETE /api/projects/:id` - 프로젝트 삭제

## 🗄️ 데이터 아키텍처

### 데이터 모델
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,                -- 기본 제목
  title_ko TEXT,                      -- 한국어 제목
  title_en TEXT,                      -- 영어 제목
  title_zh TEXT,                      -- 중국어 제목
  description TEXT,                   -- 기본 설명
  description_ko TEXT,                -- 한국어 설명
  description_en TEXT,                -- 영어 설명
  description_zh TEXT,                -- 중국어 설명
  category TEXT,                      -- 카테고리 (의료/투자/기타)
  funding_type TEXT NOT NULL,         -- 펀딩 유형 (investment/donation)
  amount INTEGER DEFAULT 0,           -- 목표 금액
  youtube_url_1 TEXT,                 -- 유튜브 링크 1
  youtube_url_2 TEXT,                 -- 유튜브 링크 2
  youtube_url_3 TEXT,                 -- 유튜브 링크 3
  youtube_url_4 TEXT,                 -- 유튜브 링크 4
  youtube_url_5 TEXT,                 -- 유튜브 링크 5
  text_info TEXT,                     -- 기본 추가 정보
  text_info_ko TEXT,                  -- 한국어 추가 정보
  text_info_en TEXT,                  -- 영어 추가 정보
  text_info_zh TEXT,                  -- 중국어 추가 정보
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 저장소 서비스
- **Cloudflare D1**: SQLite 기반 글로벌 분산 데이터베이스
  - **프로덕션 DB**: `iqherb-production` (UUID: 914d50d4-0144-448f-b0a5-b525fbdb6e6e)
  - **리전**: ENAM (Eastern North America)
- **로컬 개발**: `.wrangler/state/v3/d1`에 로컬 SQLite 파일

### 데이터 플로우
```
사용자 → 프론트엔드 (HTML/JS) 
       → API 요청 (Axios)
       → Hono 백엔드 (Cloudflare Workers)
       → D1 데이터베이스 (SQLite)
       → 응답 반환
```

## 📖 사용자 가이드

### 관리자 페이지 사용법

#### 프로젝트 생성
1. **관리자 페이지 접속**: https://iqherb.org/#/admin
2. **"새 프로젝트" 버튼 클릭**
3. **다국어 정보 입력**:
   - 제목: `한국어|||English|||中文` 형식
   - 설명: `한국어|||English|||中文` 형식
   - 기타 정보: `한국어|||English|||中文` 형식
   - **구분자**: `|||` (파이프 3개) - Shift + `\` 또는 Shift + `₩` 키
4. **카테고리 선택**: 의료/투자/기타
5. **펀딩 유형 선택**: 투자/기부
6. **유튜브 링크 입력**: 개별 입력창에 5개까지 입력 가능
7. **저장 버튼 클릭**

#### 프로젝트 편집
1. 프로젝트 카드의 **✏️ (연필) 아이콘** 클릭
2. 정보 수정
3. **저장** 클릭

#### 프로젝트 삭제
1. 프로젝트 카드의 **🗑️ (휴지통) 아이콘** 클릭
2. 확인 대화상자에서 **"확인"** 클릭

### 메인 페이지 사용법
1. **https://iqherb.org** 접속
2. **언어 선택**: 한국어/English/中文
3. **프로젝트 카드 클릭**: 모달 팝업으로 상세 정보 표시
4. **유튜브 영상**: 썸네일 클릭 시 재생 (2~5개 세로 배열)
5. **자동재생 없음**: 사용자가 직접 클릭해야 재생

## 🚀 배포

### 플랫폼
**Cloudflare Pages** - Edge에서 실행되는 초고속 웹 애플리케이션

### 배포 상태
✅ **Active** - https://iqherb.org

### 기술 스택
- **프레임워크**: Hono v4.10.7
- **런타임**: Cloudflare Workers
- **데이터베이스**: Cloudflare D1 (SQLite)
- **프론트엔드**: Vanilla JavaScript + Axios
- **스타일링**: TailwindCSS + Font Awesome
- **빌드 도구**: Vite v6.4.1
- **배포 도구**: Wrangler v4.53.0

### 마지막 업데이트
**2025-12-07** - 기존 11개 프로젝트 복구 완료

## 📊 현재 등록된 프로젝트 (11개)

1. **코인자동매매 프로그램 cashiq.me** - 투자 (₩50,000)
2. **뇌질환 케어 전문 의료관광 패키지** - 의료 (₩100,000)
3. **암호화폐 베팅 플랫폼** - 투자 (₩75,000)
4. **AI 기반 사주 운세 분석** - 기타 (₩30,000)
5. **전라도 수퍼로드 관광 코스** - 투자 (₩120,000)
6. **의료관광 종합 플랫폼** - 의료 (₩150,000)
7. **캘린더 AI 일정관리** - 기타 (₩40,000)
8. **여행 추천 플랫폼 TourIt** - 투자 (₩80,000)
9. **디지털 명함 Puke365** - 기타 (₩25,000)
10. **JT 비트코인 거래소** - 투자 (₩200,000)
11. **토론 플랫폼 Debate** - 기타 (₩60,000)

## 📁 프로젝트 구조
```
iqherb/
├── src/
│   ├── index.tsx              # Hono 앱 메인 파일 (API + UI)
│   └── renderer.tsx           # JSX 렌더러
├── public/
│   └── static/
│       ├── app.js             # 프론트엔드 JavaScript
│       └── styles.css         # 커스텀 CSS
├── migrations/
│   ├── 0001_initial_schema.sql    # 초기 스키마
│   └── 0002_projects_schema.sql   # 프로젝트 테이블
├── dist/                      # 빌드 출력 디렉토리
│   ├── _worker.js            # 컴파일된 Worker 스크립트
│   ├── _routes.json          # 라우팅 설정
│   └── static/               # 정적 파일
├── ecosystem.config.cjs      # PM2 설정 (개발 서버)
├── wrangler.jsonc            # Cloudflare 설정
├── vite.config.ts            # Vite 빌드 설정
├── package.json              # 의존성 및 스크립트
└── README.md                 # 이 파일
```

## 🛠️ 로컬 개발

### 요구사항
- Node.js 18+
- npm

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 로컬 데이터베이스 마이그레이션
npm run db:migrate:local

# 샘플 데이터 복구 (11개 프로젝트)
npx wrangler d1 execute iqherb-production --local --file=./restore_data_v2.sql

# 개발 서버 시작 (PM2)
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:sandbox

# 서버 테스트
curl http://localhost:3000
```

### 포트 정리
```bash
npm run clean-port
# 또는
fuser -k 3000/tcp
```

## 📝 API 예제

### 프로젝트 목록 가져오기
```bash
curl https://iqherb.org/api/projects
```

### 프로젝트 추가
```bash
curl -X POST https://iqherb.org/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "새 프로젝트",
    "title_ko": "새 프로젝트",
    "title_en": "New Project",
    "title_zh": "新项目",
    "description_ko": "한국어 설명",
    "description_en": "English description",
    "description_zh": "中文描述",
    "category": "투자",
    "funding_type": "investment",
    "amount": 100000,
    "youtube_url_1": "https://www.youtube.com/watch?v=..."
  }'
```

### 프로젝트 수정
```bash
curl -X PUT https://iqherb.org/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title_ko": "수정된 제목"
  }'
```

### 프로젝트 삭제
```bash
curl -X DELETE https://iqherb.org/api/projects/1
```

## 🎯 다음 단계

### 즉시 추가 가능한 기능
1. ✅ **이미지 업로드**: 프로젝트 썸네일 업로드 (Cloudflare R2)
2. ✅ **검색 기능**: 프로젝트 제목/설명 검색
3. ✅ **필터링**: 카테고리/펀딩 유형별 필터
4. ✅ **정렬**: 금액/날짜별 정렬
5. ✅ **통계 대시보드**: 프로젝트 통계 및 차트

### 향후 개선 사항
1. **사용자 인증**: Cloudflare Access 연동
2. **결제 시스템**: Stripe 또는 토스페이먼츠 연동
3. **실시간 업데이트**: WebSocket 또는 Server-Sent Events
4. **PWA**: 오프라인 지원
5. **다크 모드**: 테마 전환 기능

## 📦 의존성

### 프로덕션
- `hono`: ^4.10.7

### 개발
- `@cloudflare/workers-types`: 4.20250705.0
- `@hono/vite-cloudflare-pages`: ^0.4.2
- `vite`: ^6.4.1
- `wrangler`: ^4.53.0
- `typescript`: ^5.0.0

## 🔧 개발 명령어

```bash
# 빌드
npm run build

# 로컬 개발 서버 (Vite)
npm run dev

# Wrangler 개발 서버 (with D1)
npm run dev:sandbox
npm run dev:d1

# 프리뷰 (프로덕션 빌드)
npm run preview

# 배포 (Cloudflare Pages)
npm run deploy
npm run deploy:prod

# D1 마이그레이션
npm run db:migrate:local     # 로컬
npm run db:migrate:prod      # 프로덕션

# D1 데이터 복구
npm run db:seed              # 샘플 데이터
npm run db:reset             # 완전 리셋

# D1 콘솔
npm run db:console:local     # 로컬
npm run db:console:prod      # 프로덕션

# TypeScript 타입 생성
npm run cf-typegen

# Git 명령어
npm run git:init             # Git 초기화
npm run git:commit           # 커밋
npm run git:status           # 상태 확인
npm run git:log              # 로그 확인
```

## 🔑 다국어 입력 방법

### 구분자: `|||` (파이프 3개)
- **키보드 위치**: Shift + `\` 또는 Shift + `₩`
- **입력 형식**: `한국어|||English|||中文`

### 예시
```
제목: 혁신적인 프로젝트|||Innovative Project|||创新项目
설명: 새로운 기술 기반|||Based on new technology|||基于新技术
기타정보: 글로벌 시장 진출|||Global market entry|||进军全球市场
```

## 📄 라이선스
MIT

## 👨‍💻 개발자
GenSpark AI Assistant

---

**Powered by Cloudflare Pages + D1 + Hono** ⚡

**Last Updated**: 2025-12-07
