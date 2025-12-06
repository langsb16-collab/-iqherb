# ⚠️ 공지/참고뉴스 표시 문제 및 해결 가이드

## 📋 현재 상황

### ✅ 정상 작동하는 부분
1. **API 엔드포인트**: 모두 정상 작동
   - `GET /api/announcements` - 공지 조회
   - `POST /api/announcements` - 공지 생성
   - `GET /api/news` - 참고뉴스 조회
   - `POST /api/news` - 참고뉴스 생성

2. **관리자 페이지**: 등록 기능 정상
   - https://iqherb.org/#/admin
   - "공지" 탭 → "새 공지" 작동
   - "참고뉴스" 탭 → "새 참고뉴스" 작동

3. **메인 페이지**: 표시 기능 정상
   - https://iqherb.org
   - API에서 데이터 로드
   - 화면에 렌더링

### ⚠️ 발견된 문제

**문제**: 관리자 페이지에서 등록한 공지/참고뉴스가 **메인 페이지에 표시되지 않거나 불안정함**

**원인**: Cloudflare Pages의 **서버리스 특성**
- 데이터를 **서버 메모리(memoryAnnouncements, memoryNews)**에 저장
- Cloudflare Pages는 **여러 인스턴스**를 사용
- 각 인스턴스는 **독립적인 메모리** 보유
- POST 요청은 인스턴스 A로, GET 요청은 인스턴스 B로 갈 수 있음
- 결과: 데이터가 **일관성 없게 표시**

### 구조도
```
사용자 → POST /api/announcements → 인스턴스 A (메모리에 저장)
사용자 → GET /api/announcements → 인스턴스 B (메모리 비어있음) → ❌ 데이터 없음

또는

사용자 → POST /api/announcements → 인스턴스 A (메모리에 저장)
사용자 → GET /api/announcements → 인스턴스 A (같은 인스턴스) → ✅ 데이터 있음
```

## ✅ 임시 해결책 (현재 상태)

### 테스트 데이터로 확인
```bash
# 1. 공지 등록
curl -X POST https://iqherb.org/api/announcements \
  -H "Content-Type: application/json" \
  -d '{"title":"테스트 공지","content":"이것은 테스트 공지입니다"}'

# 2. 즉시 확인 (같은 세션)
curl https://iqherb.org/api/announcements
# → 표시됨 ✅

# 3. 잠시 후 다시 확인
curl https://iqherb.org/api/announcements
# → 표시되지 않을 수 있음 ⚠️
```

### 작동 조건
- **같은 Cloudflare 인스턴스**를 사용하는 동안은 정상 작동
- 브라우저 세션이 유지되면 대부분 같은 인스턴스로 라우팅됨
- 하지만 **보장되지 않음**

## 🔧 근본적인 해결책: Cloudflare D1 데이터베이스

### 1. D1 데이터베이스 생성
```bash
# 1. D1 데이터베이스 생성
npx wrangler d1 create iqherb-db

# 2. 출력된 database_id를 복사하여 wrangler.jsonc에 추가
```

### 2. wrangler.jsonc 설정
```jsonc
{
  "name": "iqherb",
  "compatibility_date": "2025-12-05",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "./dist",
  
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "iqherb-db",
      "database_id": "your-database-id-here"
    }
  ]
}
```

### 3. 마이그레이션 파일 생성
```bash
mkdir -p migrations
```

**migrations/0001_create_tables.sql:**
```sql
-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  youtube_link TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created ON news(created_at DESC);
```

### 4. 마이그레이션 실행
```bash
# 로컬 개발 환경
npx wrangler d1 migrations apply iqherb-db --local

# 프로덕션 환경
npx wrangler d1 migrations apply iqherb-db
```

### 5. API 코드 수정 (src/index.tsx)

**변경 전 (메모리 저장):**
```typescript
let memoryAnnouncements: any[] = []

app.get('/api/announcements', async (c) => {
  const activeAnnouncements = memoryAnnouncements.filter(a => a.status === 'active')
  return c.json({ success: true, data: activeAnnouncements })
})
```

**변경 후 (D1 데이터베이스):**
```typescript
app.get('/api/announcements', async (c) => {
  try {
    if (c.env.DB) {
      const { results } = await c.env.DB.prepare(
        'SELECT * FROM announcements WHERE status = ? ORDER BY created_at DESC'
      ).bind('active').all()
      return c.json({ success: true, data: results })
    }
    
    // D1이 없으면 메모리 fallback
    const activeAnnouncements = memoryAnnouncements.filter(a => a.status === 'active')
    return c.json({ success: true, data: activeAnnouncements })
  } catch (error) {
    console.error('Announcements API error:', error)
    return c.json({ success: true, data: [] })
  }
})

app.post('/api/announcements', async (c) => {
  try {
    const body = await c.req.json()
    
    if (c.env.DB) {
      const result = await c.env.DB.prepare(
        'INSERT INTO announcements (title, content, image_url) VALUES (?, ?, ?)'
      ).bind(body.title, body.content, body.image_url || '').run()
      
      return c.json({ 
        success: true, 
        data: { 
          id: result.meta.last_row_id, 
          ...body,
          status: 'active',
          created_at: new Date().toISOString()
        }
      })
    }
    
    // D1이 없으면 메모리 fallback
    const newAnnouncement = {
      id: Date.now(),
      ...body,
      image_url: body.image_url || '',
      status: 'active',
      created_at: new Date().toISOString()
    }
    memoryAnnouncements.push(newAnnouncement)
    return c.json({ success: true, data: newAnnouncement })
  } catch (error) {
    console.error('Create announcement error:', error)
    return c.json({ success: false, error: 'Failed to create announcement' }, 500)
  }
})
```

### 6. 개발 서버 실행 (D1 포함)
```bash
# ecosystem.config.cjs 수정
module.exports = {
  apps: [{
    name: 'iqherb',
    script: 'npx',
    args: 'wrangler pages dev dist --d1=iqherb-db --local --ip 0.0.0.0 --port 3000',
    // ...
  }]
}

# 실행
npm run build
pm2 restart iqherb
```

## 📊 메모리 vs D1 비교

| 항목 | 메모리 저장 (현재) | D1 데이터베이스 |
|------|------------------|----------------|
| **저장 위치** | 서버 메모리 | Cloudflare D1 |
| **영구성** | ❌ 서버 재시작시 소실 | ✅ 영구 저장 |
| **일관성** | ❌ 인스턴스마다 다름 | ✅ 모든 인스턴스 동일 |
| **확장성** | ❌ 제한적 | ✅ 무제한 |
| **성능** | ✅ 매우 빠름 | ✅ 빠름 (edge) |
| **비용** | ✅ 무료 | ✅ 무료 (기본 할당량) |
| **구현 복잡도** | ✅ 간단 | ⚠️ 중간 |

## ⚠️ 현재 상태 사용 시 주의사항

### 1. 데이터 소실 가능
- 서버 재시작, 배포, 또는 인스턴스 변경 시 데이터 소실
- **중요한 데이터는 별도 백업 필요**

### 2. 불일치 가능
- 같은 시간에 다른 사용자가 다른 데이터를 볼 수 있음
- 관리자가 등록한 내용이 즉시 표시되지 않을 수 있음

### 3. 테스트/개발 용도로만 권장
- 프로덕션 환경에서는 D1 데이터베이스 사용 강력 권장
- 현재 상태는 **PoC(Proof of Concept)** 수준

## 🎯 권장 사항

### 즉시 (현재 상태)
- ✅ 기능 테스트 및 데모 가능
- ✅ 개발 및 디버깅 가능
- ⚠️ 실제 운영은 권장하지 않음

### 단기 (1-2일 내)
- D1 데이터베이스 설정
- API 코드를 D1 사용하도록 수정
- 마이그레이션 및 테스트

### 장기 (프로덕션)
- D1 데이터베이스 + 백업 전략
- 모니터링 및 알림 시스템
- 데이터 정합성 검증

## 📝 테스트 방법

### 현재 상태 테스트
```bash
# 1. 관리자 페이지 접속
https://iqherb.org/#/admin

# 2. 공지 등록
- "공지" 탭 클릭
- "새 공지" 클릭
- 제목/내용 입력
- 저장

# 3. 메인 페이지 확인 (같은 브라우저)
https://iqherb.org
- "공지" 섹션 스크롤
- 등록한 공지가 표시되면 ✅
- 표시되지 않으면 페이지 새로고침 (F5)

# 4. 다른 브라우저로 확인
- 새 시크릿 창 또는 다른 브라우저
- https://iqherb.org 접속
- 공지가 보이지 않을 수 있음 ⚠️
```

## 🔗 관련 링크

- **라이브 사이트**: https://iqherb.org
- **관리자 페이지**: https://iqherb.org/#/admin
- **GitHub**: https://github.com/langsb16-collab/-iqherb
- **Cloudflare D1 문서**: https://developers.cloudflare.com/d1/

---

**✅ 현재 상태**: 기능은 정상 작동하지만 데이터 일관성 문제가 있음

**🎯 권장**: Cloudflare D1 데이터베이스 구현으로 영구 저장 및 일관성 확보

**⏱️ 예상 작업 시간**: D1 설정 및 마이그레이션 약 1-2시간
