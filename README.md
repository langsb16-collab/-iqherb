# OpenFunding IT Hub

당신의 아이디어, 이곳에서 투자와 연결됩니다

## 프로젝트 개요

**OpenFunding IT Hub**는 개발자, 창업자, 창작자를 위한 프로젝트 쇼케이스 및 자금 조달 플랫폼입니다.

### 주요 기능

✅ **완료된 기능**
- 메인 페이지: 프로젝트 목록 카드 형식 디스플레이
- 관리자 페이지 (`/admin.html`): 비밀번호 없이 프로젝트 CRUD 관리
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 자금 방식 필터링 (투자/수익분배/대출희망)
- 프로젝트 검색 및 정렬 기능
- 이미지 업로드 (Base64 인코딩)
- 유튜브 링크 지원 (썸네일 + 빨간 재생 버튼 자동 표시)
- 프로젝트 조회수 추적
- 에러 처리 및 로딩 상태

### 기술 스택

- **프레임워크**: Hono (Cloudflare Workers)
- **데이터베이스**: Cloudflare D1 (SQLite)
- **프론트엔드**: TailwindCSS, Vanilla JavaScript
- **배포**: Cloudflare Pages
- **버전 관리**: Git, GitHub

## 주요 엔드포인트

### 웹 페이지
- **메인 페이지**: `/` - 프로젝트 목록
- **관리자 페이지**: `/admin.html` - 프로젝트 관리 (비밀번호 불필요)

### API 엔드포인트
- `GET /api/projects` - 모든 활성 프로젝트 목록 조회
- `GET /api/projects/:id` - 특정 프로젝트 상세 조회
- `POST /api/projects` - 새 프로젝트 생성
- `PUT /api/projects/:id` - 프로젝트 수정
- `DELETE /api/projects/:id` - 프로젝트 삭제

## 데이터 모델

### Projects 테이블
- `id` - 프로젝트 ID (자동 증가)
- `title` - 프로젝트명 (필수)
- `description` - 한줄 소개
- `category` - 카테고리 (앱/웹플랫폼/O2O/게임/헬스케어/교육 등)
- `funding_type` - 자금 방식 (투자/수익분배/대출희망)
- `amount` - 희망 금액 (만원 단위)
- `languages` - 지원 언어
- `app_link` - 앱 스토어 링크
- `website_link` - 웹사이트 링크
- `youtube_link` - 유튜브 링크
- `thumbnail` - 썸네일 이미지 (Base64)
- `business_model` - 비즈니스 모델
- `team_info` - 팀 소개
- `contact_email` - 담당자 이메일
- `status` - 상태 (active/inactive)
- `view_count` - 조회수
- `created_at` - 생성일시
- `updated_at` - 수정일시

## 로컬 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 로컬 데이터베이스 초기화
```bash
# 마이그레이션 적용
npm run db:migrate:local

# 샘플 데이터 시드
npm run db:seed
```

### 3. 개발 서버 실행
```bash
# 빌드
npm run build

# PM2로 서비스 시작
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:sandbox
```

### 4. 로컬 테스트
```bash
curl http://localhost:3000
curl http://localhost:3000/api/projects
```

## Cloudflare Pages 배포

### 1. D1 데이터베이스 생성
```bash
npx wrangler d1 create iqherb-production
```

생성된 `database_id`를 `wrangler.jsonc`에 추가

### 2. 프로덕션 데이터베이스 마이그레이션
```bash
npm run db:migrate:prod
```

### 3. Cloudflare Pages 프로젝트 생성
```bash
npx wrangler pages project create iqherb \
  --production-branch main \
  --compatibility-date 2024-12-05
```

### 4. 배포
```bash
npm run deploy:prod
```

## 사용 가이드

### 메인 페이지
1. 프로젝트 카드 목록 확인
2. 자금 방식으로 필터링 (투자/수익분배/대출희망)
3. 검색어로 프로젝트 찾기
4. 정렬 옵션으로 프로젝트 정렬 (최신순/금액순/조회수순)

### 관리자 페이지
1. `/admin.html`로 접속 (비밀번호 불필요)
2. "새 프로젝트" 버튼 클릭
3. 프로젝트 정보 입력:
   - 기본 정보 (제목, 설명, 카테고리)
   - 자금 정보 (방식, 금액)
   - 링크 정보 (앱/웹/유튜브)
   - 이미지 업로드 (PC에서 업로드, Base64 자동 변환)
   - 비즈니스 정보
   - 연락처 정보
4. "저장" 버튼으로 프로젝트 등록
5. 기존 프로젝트 수정/삭제 가능

### 특별 기능
- **유튜브 링크**: YouTube URL 입력 시 썸네일과 빨간 재생 버튼 자동 표시
- **이미지 업로드**: PC에서 이미지 선택 시 Base64로 자동 변환 및 저장
- **조회수 추적**: 프로젝트 클릭 시 자동으로 조회수 증가

## 배포 상태

### 로컬 개발 환경
- ✅ **실행 중**: http://localhost:3000
- ✅ **API 테스트 완료**: 3개 샘플 프로젝트 로드
- ✅ **샌드박스 URL**: https://3000-i9crqm43nfb3kkn3ut1sl-2e77fc33.sandbox.novita.ai

### GitHub
- ✅ **저장소**: https://github.com/langsb16-collab/-iqherb
- ✅ **브랜치**: main
- ✅ **최신 커밋**: Initial commit with full features

### Cloudflare Pages
- ⏳ **대기 중**: Cloudflare API 키 설정 필요
- 🎯 **목표 도메인**: https://iqherb.org

## 향후 개발 계획

🔄 **진행 예정**
- Cloudflare Pages 배포
- 커스텀 도메인 연결 (iqherb.org)
- 프로젝트 상세 페이지 구현
- 이미지 갤러리 기능
- 댓글 및 문의 시스템

💡 **개선 가능 항목**
- 사용자 인증 시스템 (투자자/창업자 구분)
- 프로젝트 승인 워크플로우
- 알림 시스템
- 통계 대시보드
- 다국어 지원

## 프로젝트 구조

```
webapp/
├── src/
│   ├── index.tsx              # Hono 메인 앱
│   └── renderer.tsx           # JSX 렌더러
├── public/
│   ├── admin.html             # 관리자 페이지
│   └── static/
│       ├── app.js             # 메인 페이지 JavaScript
│       ├── admin.js           # 관리자 페이지 JavaScript
│       ├── router.js          # 클라이언트 라우터
│       └── styles.css         # 커스텀 CSS
├── migrations/
│   └── 0001_initial_schema.sql # D1 데이터베이스 스키마
├── dist/                       # 빌드 결과물
├── ecosystem.config.cjs        # PM2 설정
├── wrangler.jsonc             # Cloudflare 설정
├── package.json               # 의존성 및 스크립트
└── README.md                  # 이 파일
```

## 라이선스

© 2024 OpenFunding IT Hub. All rights reserved.

## 문의

프로젝트 관련 문의: [GitHub Issues](https://github.com/langsb16-collab/-iqherb/issues)

---

**프로젝트가 자본을 만나는 곳** - OpenFunding IT Hub
