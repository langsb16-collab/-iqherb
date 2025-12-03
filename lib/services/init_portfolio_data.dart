import '../models/portfolio_item.dart';

class InitPortfolioData {
  static List<PortfolioItem> getInitialData() {
    return [
      PortfolioItem(
        id: 'cashiq',
        title: 'CashiQ',
        subtitle: '뇌출혈·뇌경색 환자와 가족을 위한 종합 케어 플랫폼',
        description: '''병원 찾기부터 재활, 간병, 보험, 지원정책까지 모든 정보를 한 곳에서 제공하는 통합 의료 케어 서비스입니다.

주요 기능:
• 3,500+ 등록 병원
• 1,200+ 간병인 네트워크
• 105+ 재활 영상
• 24/7 지원 서비스
• 전문 상담 및 보험 안내''',
        siteMap: 'https://cashiq.org',
        languages: ['한국어', 'English', '中文', '日本語'],
        imageUrls: ['assets/images/projects/cashiq_brain_care.png'],
        youtubeLinks: [],
        order: 1,
      ),
      PortfolioItem(
        id: 'coupleGate',
        title: 'Couple Gate',
        subtitle: '국경을 넘어 사랑을 연결하는 국제 연애·결혼 매칭 플랫폼',
        description: '''40대·50대·60대 싱글·돌싱 글로벌 국제 연애·결혼을 위한 프리미엄 매칭 서비스입니다.

주요 특징:
• 검증된 회원 프로필
• 안전한 매칭 시스템
• 다국어 지원
• 문화 교류 프로그램
• 전문 상담 서비스''',
        siteMap: 'https://jtbit.me',
        languages: ['한국어', 'English'],
        imageUrls: ['assets/images/projects/couple_gate.png'],
        youtubeLinks: [],
        order: 2,
      ),
      PortfolioItem(
        id: 'jeollaFood',
        title: '전라도 미식 슈퍼로드',
        subtitle: '전라도의 맛과 여행을 한 곳에',
        description: '''지역 맛집·축제·촬영지·여행사·근저 농력, 지역민 중고거래, 무료 배달앱 등을 제공하는 전라도 생활지도 플랫폼입니다.

주요 콘텐츠:
• 350+ 전라도 맛집
• 60+ 지역 축제
• 32+ 맛있 여행사
• 100+ 숙박업소
• 현지인 추천 코스''',
        siteMap: 'https://jt365.me',
        languages: ['한국어', 'English', '中文', '日本語'],
        imageUrls: ['assets/images/projects/jeolla_food.png'],
        youtubeLinks: [],
        order: 3,
      ),
      PortfolioItem(
        id: 'oracleAI',
        title: '운세의 신 Oracle AI',
        subtitle: '글로벌 6개국어 AI 운세 서비스',
        description: '''인공지능 기술로 제공하는 현대적인 운세·점술 플랫폼입니다.

제공 서비스:
• AI 분석 운세
• 얼굴 관상
• 손금 분석
• 오늘의 운세
• 사주팔자
• 타로 카드
• 데일리 운세''',
        siteMap: 'https://jt8282.com',
        languages: ['한국어', 'English', '中文', '日本語', 'Español', 'Français'],
        imageUrls: ['assets/images/projects/oracle_ai.png'],
        youtubeLinks: [],
        order: 4,
      ),
      PortfolioItem(
        id: 'mediTrip',
        title: 'Medi Trip Korea',
        subtitle: '한국 의료관광 공식 안내',
        description: '''서울 정부부터 가격, 상담, 예약까지 한국 의료관광을 원스톱으로 해결해드립니다.

제공 서비스:
• 병원 예약 시스템
• 의료 통역 서비스
• 숙박 및 교통 안내
• 관광 프로그램 연계
• 24시간 고객 지원
• 의료 상담 서비스''',
        siteMap: 'https://meditour.me',
        languages: ['한국어', 'English', '中文', 'العربية', 'Русский'],
        imageUrls: ['assets/images/projects/medi_trip.png'],
        youtubeLinks: [],
        order: 5,
      ),
      PortfolioItem(
        id: 'careWalk',
        title: 'CareWalk',
        subtitle: '혼자 병원 가기 어려우신가요?',
        description: '''전문 동행자가 안전하게 병원까지 함께합니다.

주요 서비스:
• 동행자 찾기
• 동행자 등록
• 즉시 매칭
• 안전 인증
• 신분 확인 및 범죄경력 조회
• 다국어 지원''',
        siteMap: 'https://tourit.xyz',
        languages: ['한국어'],
        imageUrls: ['assets/images/projects/care_walk.png'],
        youtubeLinks: [],
        order: 6,
      ),
    ];
  }
}
