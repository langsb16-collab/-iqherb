# 📱 휴대폰 표시 오류 해결 가이드

## 🔍 문제 진단
- ✅ **로컬 환경**: 정상 작동 (언어 선택기 표시됨)
- ❌ **모바일 (iqherb.org)**: 언어 선택기 없음
- ❌ **데스크톱 (iqherb.org)**: i18n.js 로드 실패

### 원인
Cloudflare Pages가 최신 GitHub 커밋을 자동으로 배포하지 않음

---

## ✅ 해결 방법

### 옵션 1: Cloudflare Dashboard 수동 배포 (권장)

#### 단계 1: Cloudflare Dashboard 접속
1. https://dash.cloudflare.com 접속
2. 로그인

#### 단계 2: iqherb 프로젝트 선택
1. 왼쪽 메뉴에서 **"Workers & Pages"** 클릭
2. **"iqherb"** 프로젝트 선택

#### 단계 3: 수동 배포
1. **"Deployments"** 탭 클릭
2. 상단의 **"Create deployment"** 버튼 클릭
3. **Branch**: `main` 선택
4. **"Create deployment"** 버튼 클릭
5. 빌드 진행 (약 2-3분 소요)
6. "Success" 표시 확인

#### 단계 4: 배포 확인
1. 휴대폰에서 https://iqherb.org 접속
2. **브라우저 캐시 삭제**:
   - Chrome: 설정 > 개인정보 > 인터넷 사용 기록 삭제
   - Safari: 설정 > Safari > 방문 기록 및 웹사이트 데이터 지우기
3. 페이지 새로고침
4. 헤더 오른쪽 상단에 언어 선택기 확인

---

### 옵션 2: Cloudflare 캐시 삭제

#### 단계 1: 도메인 캐시 삭제
1. Cloudflare Dashboard 접속
2. **"iqherb.org"** 도메인 선택
3. 왼쪽 메뉴에서 **"Caching"** 클릭
4. **"Configuration"** 탭
5. **"Purge Everything"** 버튼 클릭
6. 확인 후 5분 대기

#### 단계 2: 브라우저 캐시 삭제
- 휴대폰 브라우저 캐시 완전 삭제
- 앱 삭제 후 재설치 (브라우저 앱)

---

### 옵션 3: Cloudflare Pages 빌드 설정 확인

#### GitHub 연동 확인
1. Cloudflare Dashboard > Workers & Pages > iqherb
2. **"Settings"** 탭 클릭
3. **"Builds & deployments"** 섹션
4. **"Configure Production deployments"** 확인
   - **Production branch**: `main` 확인
   - **Build command**: `npm run build` 확인
   - **Build output directory**: `dist` 확인
5. 설정이 잘못되었다면 수정 후 저장

---

## 📋 배포 확인 체크리스트

### 배포 성공 시 표시되는 것
- [ ] 헤더 오른쪽에 언어 선택 드롭다운 (🇰🇷 🇺🇸 🇨🇳 등)
- [ ] 언어 변경 시 모든 텍스트 즉시 번역
- [ ] 관리자 페이지 (#/admin) 정상 작동
- [ ] localStorage에 선택 언어 저장

### 명령어로 확인
\`\`\`bash
# i18n.js 파일 존재 확인
curl -I https://iqherb.org/static/i18n.js

# 200 OK 응답이 나와야 함
\`\`\`

---

## 🆘 문제가 계속되면

### 1. 로컬 테스트 URL 사용
임시로 로컬 환경에서 테스트:
- https://www.genspark.ai/api/code_sandbox/preview_url?sandbox_id=i9crqm43nfb3kkn3ut1sl-2e77fc33&port=3000&type=novita

### 2. GitHub 커밋 확인
최신 커밋 확인:
\`\`\`bash
git log --oneline -5
\`\`\`

현재 최신 커밋:
- 1584e30 "Add wrangler.toml for explicit Cloudflare Pages build configuration"
- 2c1d047 "Fix: Improve build script for reliable public file copy"
- c4c72b6 "Fix: Update vite config for proper public file copy in Cloudflare Pages"

### 3. 수동 빌드 및 배포
Cloudflare API 키가 있다면:
\`\`\`bash
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name iqherb
\`\`\`

---

## 📝 요약

**문제**: Cloudflare Pages가 최신 코드를 자동 배포하지 않음  
**해결**: Cloudflare Dashboard에서 **수동 배포** 실행  
**소요 시간**: 약 2-3분

**배포 후 확인**:
1. 휴대폰 브라우저 캐시 삭제
2. https://iqherb.org 재접속
3. 헤더의 언어 선택기 확인 ✅

