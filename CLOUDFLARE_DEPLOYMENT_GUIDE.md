# Cloudflare Pages 수동 배포 가이드

## 현재 상황
- ✅ 로컬 빌드 완료 (다국어 지원 포함)
- ✅ GitHub 푸시 완료 (커밋: 1695fdd)
- ⏳ Cloudflare Pages 자동 배포 대기 중

## 수동 배포 방법 (API 키 필요)

### 옵션 1: Cloudflare Dashboard 수동 배포
1. https://dash.cloudflare.com 접속
2. **Workers & Pages** 선택
3. **iqherb** 프로젝트 선택
4. **Deployments** 탭으로 이동
5. **Create deployment** 버튼 클릭
6. **Branch**: `main` 선택
7. **Deploy** 클릭

### 옵션 2: Wrangler CLI (API 키 설정 후)
\`\`\`bash
# Deploy 탭에서 Cloudflare API 키 설정 후
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name iqherb
\`\`\`

## 배포 확인 방법

### 1. 브라우저 캐시 완전 삭제
\`\`\`
Chrome/Edge:
1. F12 (개발자 도구)
2. Network 탭
3. "Disable cache" 체크
4. Ctrl+Shift+R (강제 새로고침)

또는:
1. 설정 > 개인정보 및 보안 > 쿠키 및 사이트 데이터 삭제
2. iqherb.org 검색하여 삭제
\`\`\`

### 2. 배포 확인 명령어
\`\`\`bash
# i18n.js 파일 확인
curl -I https://iqherb.org/static/i18n.js

# HTML에서 i18n 스크립트 확인
curl -s https://iqherb.org | grep "i18n.js"

# 언어 선택기 확인
curl -s https://iqherb.org | grep "languageSelector"
\`\`\`

### 3. 배포 성공 시 보이는 것
- 헤더 오른쪽에 언어 선택 드롭다운 (🇰🇷 한국어, 🇺🇸 English 등)
- HTML에 \`<script src="/static/i18n.js"></script>\` 포함
- HTML 요소에 \`data-i18n="xxx"\` 속성 포함

## 임시 해결방법: 직접 URL 접근
로컬 테스트 환경:
- https://www.genspark.ai/api/code_sandbox/preview_url?sandbox_id=i9crqm43nfb3kkn3ut1sl-2e77fc33&port=3000&type=novita

## 문제 해결

### Cloudflare 캐시 삭제
1. Cloudflare Dashboard 접속
2. iqherb.org 도메인 선택
3. **Caching** > **Configuration**
4. **Purge Everything** 클릭
5. 5분 대기 후 재확인

### GitHub Webhook 재연결
Cloudflare Pages가 GitHub 푸시를 감지하지 못하는 경우:
1. Cloudflare Dashboard > Workers & Pages > iqherb
2. **Settings** 탭
3. **Builds & deployments**
4. **Configure Production deployments** 확인
5. Branch: main 확인
6. **Retry deployment** 클릭

