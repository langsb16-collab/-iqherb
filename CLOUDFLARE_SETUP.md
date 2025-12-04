# Cloudflare Pages 배포 설정

## 🚨 CRITICAL: Cloudflare Pages 설정 확인 필수!

### 📋 올바른 설정:

**Build settings:**
- **Build command**: `(비워두기 또는 echo "Using pre-built files")`
- **Build output directory**: `build/web`
- **Root directory**: `/`

### ⚠️ 중요 사항:

1. **Pre-built 파일 사용**: 
   - GitHub에 이미 빌드된 `build/web` 디렉토리가 포함되어 있음
   - Cloudflare는 빌드할 필요 없이 `build/web`만 서빙하면 됨

2. **Cloudflare Dashboard 설정 확인**:
   ```
   https://dash.cloudflare.com/
   → Pages
   → -iqherb
   → Settings
   → Builds & deployments
   ```

3. **설정 변경 후**:
   - "Retry deployment" 버튼 클릭
   - 또는 새 커밋으로 자동 배포 트리거

### 🔍 배포 확인:

배포 완료 후 (3-5분):
```
https://iqherb.org
```

브라우저에서 F12 → Console 확인:
- 오류 메시지 없어야 함
- 프로젝트 목록이 표시되어야 함

### 📊 현재 커밋:

```
7b0f291 - CRITICAL: Add pre-built web files for Cloudflare Pages deployment
```

이 커밋에는 완전히 빌드된 Flutter 웹 애플리케이션이 포함되어 있습니다.
