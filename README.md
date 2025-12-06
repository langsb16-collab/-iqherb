# OpenFunding IT Hub

당신의 아이디어, 이곳에서 투자와 연결됩니다

## 프로젝트 개요

**OpenFunding IT Hub**는 개발자, 창업자, 창작자를 위한 프로젝트 쇼케이스 및 자금 조달 플랫폼입니다.

### 주요 기능

✅ **완료된 기능**
- 메인 페이지: 프로젝트 목록 카드 형식 디스플레이 (썸네일 없는 깔끔한 디자인)
- 관리자 페이지 (`/#/admin`): localStorage 기반 프로젝트 CRUD 관리
- 반응형 디자인 (모바일/태블릿/데스크톱) - 히어로 섹션 최적화
- 자금 방식 필터링 (투자/수익분배/창업희망)
- 프로젝트 검색 및 정렬 기능
- **텍스트 정보 입력** (여러 줄 텍스트로 프로젝트 상세 설명)
- **프로젝트 상세 모달** (클릭 시 텍스트 정보 + YouTube 영상 표시)
- 프로젝트 조회수 추적
- 에러 처리 및 로딩 상태
- **✨ localStorage와 API 동기화** (PC와 모바일 간 데이터 동기화)
- **📦 데이터 내보내기/가져오기** (JSON 파일로 기기 간 데이터 이동)

### 기술 스택

- **프레임워크**: Hono (Cloudflare Workers)
- **데이터베이스**: Cloudflare D1 (SQLite)
- **프론트엔드**: TailwindCSS, Vanilla JavaScript
- **배포**: Cloudflare Pages
- **버전 관리**: Git, GitHub

## 주요 엔드포인트

### 웹 페이지
- **메인 페이지**: https://iqherb.org - 프로젝트 목록
- **관리자 페이지**: https://iqherb.org/#/admin - 프로젝트 관리 (localStorage 기반)

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
- `funding_type` - 자금 방식 (투자/수익분배/창업희망)
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

### ⚠️ 배포 전 필수 작업
1. **Cloudflare API 키 설정**: Deploy 탭에서 API 토큰 생성 및 등록
2. **빌드 완료**: `npm run build` 실행

### 배포 명령어
```bash
# 1. 빌드
npm run build

# 2. Cloudflare Pages 배포
npx wrangler pages deploy dist --project-name iqherb
```

### 배포 후 확인
- **프로덕션 URL**: https://iqherb.pages.dev
- **커스텀 도메인**: https://iqherb.org (Cloudflare Pages 대시보드에서 설정)

### 주의사항
- **데이터 동기화 방식** (메모리 저장소):
  - 메인 페이지: API 우선, localStorage 백업 (PC/모바일 동기화)
  - 관리자 페이지: localStorage와 API 동시 저장
  - **PC에서 등록 → 즉시 API에 저장 → 모바일에서 자동 표시** ✅
  - 캐시 삭제 시에도 API에서 데이터 복구 가능
- ⚠️ **메모리 저장소 한계**: 서버 재시작 시 데이터 초기화됨 (Cloudflare Pages 배포 시마다 리셋)
- 💾 **영구 저장**: D1 데이터베이스 연결 시 영구 저장 가능
- 📦 **백업 권장**: 중요 데이터는 "내보내기" 기능으로 JSON 파일 백업

## 사용 가이드

### 메인 페이지
1. 프로젝트 카드 목록 확인
2. 자금 방식으로 필터링 (투자/수익분배/창업희망)
3. 검색어로 프로젝트 찾기
4. 정렬 옵션으로 프로젝트 정렬 (최신순/금액순/조회수순)

### 관리자 페이지
1. `/#/admin`로 접속
2. "새 프로젝트" 버튼 클릭
3. 프로젝트 정보 입력:
   - 기본 정보 (제목, 설명, 카테고리)
   - 자금 정보 (방식, 금액)
   - **텍스트 정보** (프로젝트 상세 설명 입력)
4. "저장" 버튼으로 프로젝트 등록
5. 기존 프로젝트 수정/삭제 가능

### 데이터 동기화 (PC ↔ 모바일)

**자동 동기화 (권장):**
1. **PC에서 프로젝트 등록**:
   - 관리자 페이지(`/#/admin`)에서 프로젝트 등록
   - localStorage에 자동 저장
2. **PC에서 관리자 페이지 재접속**:
   - 페이지 로드 시 자동으로 API에 업로드 🔄
   - 콘솔에서 "🔄 Syncing X projects to API..." 확인 가능
3. **모바일에서 확인**:
   - 메인 페이지 접속 → API에서 자동 로드
   - ✅ 즉시 프로젝트 표시됨!

**수동 동기화 (백업용):**
1. **PC에서 내보내기**:
   - 관리자 페이지(`/#/admin`)에서 "내보내기" 버튼 클릭
   - JSON 파일 다운로드 (`iqherb-projects-YYYY-MM-DD.json`)
2. **모바일에서 가져오기**:
   - 모바일에서 관리자 페이지(`/#/admin`) 접속
   - "가져오기" 버튼 클릭
   - 다운로드한 JSON 파일 선택
   - 자동으로 중복 제거 후 병합
3. ✅ 모든 기기에서 동일한 프로젝트 확인 가능!

### 특별 기능
- **텍스트 기반 프로젝트 정보**: 
  - 관리자 폼: 여러 줄 텍스트 입력 가능
  - 메인 페이지: 프로젝트 클릭 시 상세 정보 표시
  - YouTube 링크가 있으면 영상도 함께 표시
- **localStorage 기반 저장**: 브라우저 로컬 저장 (최대 100개 프로젝트)
- **깔끔한 카드 디자인**: 썸네일 없이 정보만 표시

## 배포 상태

### 로컬 개발 환경
- ✅ **실행 중**: http://localhost:3000
- ✅ **관리자 페이지**: http://localhost:3000/admin.html
- ✅ **API 테스트 완료**: 3개 샘플 프로젝트 로드

### GitHub
- ✅ **저장소**: https://github.com/langsb16-collab/-iqherb
- ✅ **브랜치**: main
- ✅ **최신 커밋**: Add export/import feature for cross-device data sync

### Cloudflare Pages
- ✅ **최신 배포**: https://f3a35c01.iqherb.pages.dev (2025-12-06)
- ✅ **프로젝트명**: iqherb
- ✅ **커스텀 도메인**: https://iqherb.org (활성화 완료)
- ✅ **주요 업데이트**: 
  - "대출희망" → "창업희망" 변경
  - 데이터 내보내기/가져오기 기능 추가
  - **자동 동기화: PC → API → 모바일 완벽 작동** ✨
  - 관리자 페이지 접속 시 localStorage 자동 업로드
  - D1 없이도 API 작동 (메모리 기반)
  - YouTube 썸네일 로딩 개선 (안정성 향상)

## 향후 개발 계획

🔄 **진행 예정**
- D1 프로덕션 데이터베이스 연결 (Cloudflare 대시보드에서 수동 설정)
- 프로젝트 상세 페이지 구현
- 이미지 갤러리 기능
- 댓글 및 문의 시스템
- 프로젝트 분석 및 통계

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
