# 🚀 배포 가이드

## Cloudflare Pages 자동 배포 설정

### 📋 Cloudflare Dashboard에서 설정하기

1. **Cloudflare Dashboard 접속**
   - 👉 https://dash.cloudflare.com/
   - 좌측 메뉴에서 **Workers & Pages** 클릭

2. **GitHub 저장소 연동**
   - **"Create application"** 또는 기존 프로젝트 선택
   - **"Connect to Git"** 클릭
   - GitHub 저장소 선택: `langsb16-collab/-iqherb`
   - Production 브랜치: `main`

3. **빌드 설정**
   ```
   Project name: iqherb-org
   Framework preset: Flutter (web)
   Build command: flutter build web --release
   Build output directory: build/web
   Root directory: (비워두기)
   ```

4. **환경 변수 추가**
   ```
   FLUTTER_VERSION = 3.35.4
   ```

5. **커스텀 도메인 설정**
   - Settings → Custom domains
   - 도메인 추가: `iqherb.org`
   - 도메인 추가: `www.iqherb.org`

### ✅ 설정 완료 후

이제 `main` 브랜치에 푸시할 때마다 자동으로 https://iqherb.org에 배포됩니다!

```bash
git add .
git commit -m "Update: 변경 내용"
git push origin main
```

Cloudflare가 자동으로:
1. 코드 체크아웃
2. Flutter 빌드 실행
3. https://iqherb.org에 배포

### 🌐 확인

- 메인 사이트: https://iqherb.org
- WWW: https://www.iqherb.org
- 배포 현황: https://dash.cloudflare.com/

---

## 📝 현재 상태

- ✅ GitHub 저장소: https://github.com/langsb16-collab/-iqherb
- ✅ 최신 커밋: Hive 에러 복구 시스템 추가
- ✅ Flutter 빌드: 완료
- ⏳ Cloudflare 연동: Dashboard에서 설정 필요
