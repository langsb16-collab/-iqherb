# iqherb - 할 일 관리 앱 ✅

## 프로젝트 개요
**iqherb**는 Cloudflare Pages + D1 + Hono로 만든 간단하고 빠른 할 일 관리 애플리케이션입니다.

### 주요 기능
- ✅ 할 일 추가/수정/삭제 (CRUD)
- ✅ 할 일 완료 표시 (체크박스)
- ✅ 실시간 UI 업데이트
- ✅ Cloudflare D1 데이터베이스 연동
- ✅ 반응형 디자인 (TailwindCSS)
- ✅ 깔끔하고 직관적인 UI

## 🌐 URL

### 개발 환경 (Sandbox)
- **앱 URL**: https://3000-i9crqm43nfb3kkn3ut1sl-2e77fc33.sandbox.novita.ai
- **API 엔드포인트**:
  - `GET /api/todos` - 모든 할 일 가져오기
  - `POST /api/todos` - 새 할 일 추가
  - `PUT /api/todos/:id` - 할 일 수정 (완료 표시)
  - `DELETE /api/todos/:id` - 할 일 삭제

### 프로덕션 (Cloudflare Pages)
- **배포 대기 중** - Cloudflare API 토큰 설정 후 배포 예정

## 🗄️ 데이터 아키텍처

### 데이터 모델
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 저장소 서비스
- **Cloudflare D1**: SQLite 기반 글로벌 분산 데이터베이스
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

### 할 일 추가하기
1. 상단 입력창에 할 일을 입력하세요
2. "추가" 버튼을 클릭하거나 Enter 키를 누르세요
3. 새로운 할 일이 목록 상단에 추가됩니다

### 할 일 완료 표시
- 각 할 일 왼쪽의 체크박스를 클릭하세요
- 완료된 할 일은 회색으로 표시되고 취소선이 그어집니다

### 할 일 삭제
1. 할 일 항목에 마우스를 올리세요
2. 오른쪽에 나타나는 🗑️ 아이콘을 클릭하세요
3. 확인 대화상자에서 "확인"을 누르면 삭제됩니다

## 🚀 배포

### 플랫폼
**Cloudflare Pages** - Edge에서 실행되는 초고속 웹 애플리케이션

### 배포 상태
❌ **대기 중** - Cloudflare API 토큰 설정 필요

### 기술 스택
- **프레임워크**: Hono v4.10.7
- **런타임**: Cloudflare Workers
- **데이터베이스**: Cloudflare D1 (SQLite)
- **프론트엔드**: Vanilla JavaScript + Axios
- **스타일링**: TailwindCSS + Font Awesome
- **빌드 도구**: Vite v6.3.5
- **배포 도구**: Wrangler v4.4.0

### 마지막 업데이트
**2025-12-07**

## 📁 프로젝트 구조
```
iqherb/
├── src/
│   ├── index.tsx           # Hono 앱 메인 파일 (API + UI)
│   └── renderer.tsx        # JSX 렌더러 (사용 안 함)
├── migrations/
│   └── 0001_initial_schema.sql  # D1 데이터베이스 스키마
├── dist/                   # 빌드 출력 디렉토리
│   ├── _worker.js         # 컴파일된 Worker 스크립트
│   └── _routes.json       # 라우팅 설정
├── public/                # 정적 파일 (현재 사용 안 함)
├── ecosystem.config.cjs   # PM2 설정 (개발 서버)
├── wrangler.jsonc         # Cloudflare 설정
├── vite.config.ts         # Vite 빌드 설정
├── package.json           # 의존성 및 스크립트
└── README.md             # 이 파일
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
```

## 📝 API 예제

### 할 일 목록 가져오기
```bash
curl http://localhost:3000/api/todos
```

### 할 일 추가
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "새로운 할 일"}'
```

### 할 일 완료 표시
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### 할 일 삭제
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## 🎯 다음 단계

### 즉시 추가 가능한 기능
1. ✅ **할 일 편집**: 제목 수정 기능
2. ✅ **우선순위**: 중요도 표시 기능
3. ✅ **필터링**: 완료/미완료 필터
4. ✅ **검색**: 할 일 검색 기능
5. ✅ **카테고리**: 할 일 분류 기능

### 배포 완료 후
1. **커스텀 도메인** 연결
2. **GitHub Actions** CI/CD 파이프라인
3. **사용자 인증**: Cloudflare Access
4. **다크 모드**: 테마 전환 기능
5. **PWA**: 오프라인 지원

## 📦 의존성

### 프로덕션
- `hono`: ^4.10.7

### 개발
- `@hono/vite-build`: ^1.2.0
- `@hono/vite-dev-server`: ^0.18.2
- `@hono/vite-cloudflare-pages`: ^0.4.2
- `vite`: ^6.3.5
- `wrangler`: ^4.4.0

## 🔧 개발 명령어

```bash
# 빌드
npm run build

# 로컬 개발 서버 (Vite)
npm run dev

# Wrangler 개발 서버 (with D1)
npm run dev:sandbox

# 프리뷰 (프로덕션 빌드)
npm run preview

# 배포 (Cloudflare Pages)
npm run deploy

# D1 마이그레이션 (로컬)
npm run db:migrate:local

# D1 콘솔 (로컬)
npm run db:console:local

# TypeScript 타입 생성
npm run cf-typegen
```

## 📄 라이선스
MIT

## 👨‍💻 개발자
GenSpark AI Assistant

---

**Powered by Cloudflare Pages + D1 + Hono** ⚡
