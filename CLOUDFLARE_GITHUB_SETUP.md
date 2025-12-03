# 🌐 Cloudflare Pages + GitHub 연동 설정 가이드

## 📋 준비물 확인
- ✅ GitHub 저장소: https://github.com/langsb16-collab/-iqherb
- ✅ Cloudflare 계정 (iqherb.org 도메인 관리 중)
- ✅ Flutter 프로젝트 코드 푸시 완료

---

## 🚀 단계별 설정 방법

### 1️⃣ Cloudflare Dashboard 접속

1. 브라우저에서 접속: **https://dash.cloudflare.com/**
2. Cloudflare 계정으로 로그인

---

### 2️⃣ Workers & Pages 메뉴 이동

1. 로그인 후 좌측 사이드바에서 **"Workers & Pages"** 클릭
   ```
   좌측 메뉴에서 "Workers & Pages" 찾아서 클릭
   ```

---

### 3️⃣ 새 프로젝트 생성

#### 옵션 A: 프로젝트가 없는 경우

1. **"Create application"** 버튼 클릭 (파란색 큰 버튼)
2. **"Pages"** 탭 선택 (Workers / Pages 중)
3. **"Connect to Git"** 버튼 클릭

#### 옵션 B: 기존 프로젝트가 있는 경우

1. 기존 프로젝트 목록에서 **"iqherb-org"** 찾기
2. 프로젝트 클릭 → **"Settings"** 탭
3. **"Builds & deployments"** 섹션에서 설정

---

### 4️⃣ GitHub 계정 연결

1. **"Connect GitHub account"** 또는 **"Connect to Git"** 버튼 클릭

2. GitHub 권한 승인 팝업이 열림:
   - Read access to code
   - Read access to metadata
   - Read and write access to deployments

3. **"Authorize Cloudflare Pages"** 버튼 클릭

4. GitHub 비밀번호 또는 2FA 인증 완료

---

### 5️⃣ GitHub 저장소 선택

1. 승인 완료 후 저장소 목록이 표시됨

2. 검색창에 **"-iqherb"** 입력

3. 저장소 선택: **langsb16-collab/-iqherb**

4. **"Begin setup"** 버튼 클릭

---

### 6️⃣ 빌드 설정 구성

이제 빌드 설정 페이지가 나타납니다. 아래와 같이 입력:

```
Project name: iqherb-org
Production branch: main

Framework preset: Flutter (Web)
Build command: flutter build web --release
Build output directory: build/web
Root directory: (비워두기)
```

---

### 7️⃣ 환경 변수 추가

빌드 설정 화면에서:

1. **"Environment variables (advanced)"** 섹션 펼치기

2. **"Add variable"** 클릭

3. 환경 변수 추가:
   ```
   Variable name: FLUTTER_VERSION
   Value: 3.35.4
   ```

---

### 8️⃣ 배포 시작!

1. 모든 설정 확인 후 **"Save and Deploy"** 버튼 클릭

2. Cloudflare가 자동으로:
   - GitHub에서 코드 체크아웃
   - Flutter 환경 설정
   - flutter build web --release 실행
   - build/web 디렉토리 배포

3. 첫 배포는 약 3-5분 소요

---

### 9️⃣ 커스텀 도메인 연결

배포가 완료되면:

1. 프로젝트 대시보드에서 **"Custom domains"** 탭 클릭

2. **"Set up a custom domain"** 버튼 클릭

3. 도메인 추가: **iqherb.org**

4. DNS 레코드 자동 설정 확인 후 **"Activate domain"** 클릭

5. 같은 방법으로 **www.iqherb.org** 추가

---

### 🔟 자동 배포 확인

설정 완료! 이제 확인:

1. **"Deployments"** 탭에서 배포 히스토리 확인

2. 자동 배포 설정 확인:
   ```
   Settings → Builds & deployments
   ✓ Automatic deployments: Enabled
   ✓ Production branch: main
   ```

3. 테스트: GitHub에 푸시
   ```bash
   git add .
   git commit -m "Test auto deployment"
   git push origin main
   ```

4. Cloudflare Dashboard에서 자동 빌드 시작 확인!

---

## ✅ 완료 체크리스트

설정이 제대로 되었는지 확인:

- [ ] Workers & Pages에서 **iqherb-org** 프로젝트 보임
- [ ] GitHub 저장소 **langsb16-collab/-iqherb** 연결됨
- [ ] Production branch: **main**
- [ ] Build command: `flutter build web --release`
- [ ] Build output directory: `build/web`
- [ ] 환경 변수 **FLUTTER_VERSION=3.35.4** 설정
- [ ] Custom domain **iqherb.org** 추가
- [ ] Custom domain **www.iqherb.org** 추가
- [ ] Automatic deployments **Enabled**
- [ ] 첫 배포 성공

---

## 🌐 배포 확인 URL

설정 완료 후 접속 가능:

- **메인 사이트**: https://iqherb.org
- **WWW**: https://www.iqherb.org
- **Cloudflare 기본 URL**: https://iqherb-org.pages.dev
- **대시보드**: https://dash.cloudflare.com/

---

## 🔄 자동 배포 작동 방식

이제 다음과 같이 작동합니다:

```
1. 코드 수정
2. git push origin main
3. GitHub → Cloudflare Webhook 자동 트리거
4. Cloudflare가 자동으로 빌드
5. iqherb.org 자동 업데이트!
```

---

## 🆘 문제 해결

### Q1: GitHub 저장소가 목록에 안 보여요
**A:** GitHub → Settings → Applications → Cloudflare Pages에서 저장소 권한 부여

### Q2: 빌드가 실패해요
**A:** Cloudflare Dashboard → Deployments → Build logs 확인

### Q3: 도메인이 연결 안 돼요
**A:** DNS 전파 대기 (최대 24시간, 보통 몇 분)

### Q4: 자동 배포가 안 돼요
**A:** Settings → Builds & deployments에서 Automatic deployments Enabled 확인

---

## 💡 유용한 팁

### 빌드 캐시 활성화
Settings → Builds & deployments → Build cache 활성화 (빌드 시간 단축)

### Branch 프리뷰 배포
Settings → Branch deployments 활성화 → feature 브랜치도 자동 프리뷰 URL 생성

---

## 🎉 완료!

이제 **코드 수정 → Git 푸시 → 자동 배포**가 작동합니다! 🚀
