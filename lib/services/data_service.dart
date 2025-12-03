import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/portfolio_item.dart';
import '../models/company_info.dart';
import '../models/investment_notice.dart';

class DataService {
  static const String portfolioBoxName = 'portfolios';
  static const String companyBoxName = 'company';
  static const String investmentNoticeBoxName = 'investment_notices';
  
  // Web platform uses shared_preferences
  static SharedPreferences? _prefs;
  static bool _isWebPlatform = kIsWeb;
  static bool _isInitialized = false;

  static Future<void> initialize() async {
    if (_isInitialized) {
      debugPrint('⚠️ DataService already initialized, skipping...');
      return;
    }

    try {
      if (_isWebPlatform) {
        // Web platform: Use shared_preferences (stable, no IndexedDB issues)
        debugPrint('🌐 Initializing web storage (SharedPreferences) - Hive disabled for web');
        await _initializeWebStorage();
      } else {
        // Mobile platform: Use Hive (high performance)
        debugPrint('📱 Initializing mobile storage (Hive)...');
        await _initializeHive();
      }
      _isInitialized = true;
      debugPrint('✅ DataService initialization complete!');
    } catch (e) {
      debugPrint('❌ DataService initialization error: $e');
      // Don't rethrow - allow app to continue even if initialization fails
      _isInitialized = true;  // Mark as initialized to prevent retries
    }
  }

  // ==================== WEB STORAGE (shared_preferences) ====================
  static Future<void> _initializeWebStorage() async {
    try {
      _prefs = await SharedPreferences.getInstance();
      debugPrint('✅ Web storage (shared_preferences) initialized successfully');
      
      // Initialize default data if empty
      await _initializeWebDefaultData();
    } catch (e) {
      debugPrint('❌ Web storage initialization failed: $e');
      rethrow;
    }
  }

  static Future<void> _initializeWebDefaultData() async {
    final portfolios = _getWebPortfolios();
    if (portfolios.isEmpty) {
      await _addWebDefaultPortfolios();
    }
    
    final company = _getWebCompanyInfo();
    if (company == null) {
      await _addWebDefaultCompanyInfo();
    }
  }

  static List<PortfolioItem> _getWebPortfolios() {
    if (_prefs == null) return [];
    final String? data = _prefs!.getString('portfolios');
    if (data == null) return [];
    
    try {
      final List<dynamic> jsonList = json.decode(data);
      return jsonList.map((json) => PortfolioItem.fromJson(json)).toList();
    } catch (e) {
      debugPrint('❌ Failed to decode portfolios: $e');
      return [];
    }
  }

  static Future<void> _saveWebPortfolios(List<PortfolioItem> portfolios) async {
    if (_prefs == null) return;
    final jsonList = portfolios.map((p) => p.toJson()).toList();
    await _prefs!.setString('portfolios', json.encode(jsonList));
  }

  static CompanyInfo? _getWebCompanyInfo() {
    if (_prefs == null) return null;
    final String? data = _prefs!.getString('company');
    if (data == null) return null;
    
    try {
      final Map<String, dynamic> jsonData = json.decode(data);
      return CompanyInfo.fromJson(jsonData);
    } catch (e) {
      debugPrint('❌ Failed to decode company info: $e');
      return null;
    }
  }

  static Future<void> _saveWebCompanyInfo(CompanyInfo info) async {
    if (_prefs == null) return;
    await _prefs!.setString('company', json.encode(info.toJson()));
  }

  static Future<void> _addWebDefaultPortfolios() async {
    final portfolios = _createDefaultPortfolios();
    await _saveWebPortfolios(portfolios);
    debugPrint('✅ Added ${portfolios.length} default portfolios to web storage');
  }

  static Future<void> _addWebDefaultCompanyInfo() async {
    final company = _createDefaultCompanyInfo();
    await _saveWebCompanyInfo(company);
    debugPrint('✅ Added default company info to web storage');
  }

  // ==================== HIVE STORAGE (Mobile) ====================
  static Future<void> _initializeHive() async {
    int retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        await Hive.initFlutter();
        
        // Register adapters (only register if not already registered)
        if (!Hive.isAdapterRegistered(0)) {
          Hive.registerAdapter(PortfolioItemAdapter());
        }
        if (!Hive.isAdapterRegistered(1)) {
          Hive.registerAdapter(CompanyInfoAdapter());
        }
        if (!Hive.isAdapterRegistered(2)) {
          Hive.registerAdapter(InvestmentNoticeAdapter());
        }

        // Open boxes with error recovery
        await _openBoxWithRetry<PortfolioItem>(portfolioBoxName);
        await _openBoxWithRetry<CompanyInfo>(companyBoxName);
        await _openBoxWithRetry<InvestmentNotice>(investmentNoticeBoxName);

        // Initialize default data if empty
        await _initializeHiveDefaultData();
        
        debugPrint('✅ Hive database initialized successfully');
        return; // Success!
        
      } catch (e) {
        retryCount++;
        debugPrint('⚠️ Hive initialization error (attempt $retryCount/$maxRetries): $e');
        
        if (retryCount < maxRetries) {
          debugPrint('🔄 Retrying initialization...');
          await Future.delayed(Duration(milliseconds: 500 * retryCount));
          
          // Try to recover by deleting corrupted boxes
          try {
            await _recoverFromError();
          } catch (recoveryError) {
            debugPrint('⚠️ Recovery attempt failed: $recoveryError');
          }
        } else {
          debugPrint('❌ Failed to initialize Hive after $maxRetries attempts');
          rethrow;
        }
      }
    }
  }

  static Future<void> _openBoxWithRetry<T>(String boxName) async {
    try {
      await Hive.openBox<T>(boxName);
    } catch (e) {
      debugPrint('❌ Failed to open box "$boxName": $e');
      debugPrint('🔄 Deleting corrupted box and retrying...');
      try {
        await Hive.deleteBoxFromDisk(boxName);
        await Hive.openBox<T>(boxName);
        debugPrint('✅ Successfully recovered box "$boxName"');
      } catch (retryError) {
        debugPrint('❌ Recovery failed for "$boxName": $retryError');
        rethrow;
      }
    }
  }

  static Future<void> _recoverFromError() async {
    try {
      // Delete all boxes and reinitialize
      await Hive.deleteBoxFromDisk(portfolioBoxName);
      await Hive.deleteBoxFromDisk(companyBoxName);
      await Hive.deleteBoxFromDisk(investmentNoticeBoxName);
      
      // Reopen boxes
      await Hive.openBox<PortfolioItem>(portfolioBoxName);
      await Hive.openBox<CompanyInfo>(companyBoxName);
      await Hive.openBox<InvestmentNotice>(investmentNoticeBoxName);
      
      // Reinitialize default data
      await _initializeHiveDefaultData();
      
      debugPrint('✅ Successfully recovered from error');
    } catch (e) {
      debugPrint('❌ Recovery failed completely: $e');
      rethrow;
    }
  }

  static Future<void> _initializeHiveDefaultData() async {
    final portfolioBox = Hive.box<PortfolioItem>(portfolioBoxName);
    final companyBox = Hive.box<CompanyInfo>(companyBoxName);

    // Initialize portfolio items if empty
    if (portfolioBox.isEmpty) {
      await _addHiveDefaultPortfolios();
    }

    // Initialize company info if empty
    if (companyBox.isEmpty) {
      await _addHiveDefaultCompanyInfo();
    }
  }

  static Future<void> _addHiveDefaultPortfolios() async {
    final portfolioBox = Hive.box<PortfolioItem>(portfolioBoxName);
    final portfolios = _createDefaultPortfolios();

    for (var portfolio in portfolios) {
      await portfolioBox.add(portfolio);
    }
    debugPrint('✅ Added ${portfolios.length} default portfolios to Hive');
  }

  static Future<void> _addHiveDefaultCompanyInfo() async {
    final companyBox = Hive.box<CompanyInfo>(companyBoxName);
    final companyInfo = _createDefaultCompanyInfo();
    await companyBox.add(companyInfo);
    debugPrint('✅ Added default company info to Hive');
  }

  // ==================== SHARED DEFAULT DATA CREATION ====================
  static List<PortfolioItem> _createDefaultPortfolios() {
    return [
      PortfolioItem(
        id: 'cashiq',
        title: 'cashiq.org',
        subtitle: '뇌질환 케어 플랫폼',
        description: '한국어 / 영어 / 중국어 / 일본어',
        siteMap: '''cashiq.org (뇌질환 케어 플랫폼)
│
├── HOME (홈)  
│
├── 병원 검색  (등록 병원 2,500+ 이상)  
│
├── 간병인  (전문 간병인 찾기)  
│
├── 간병일기  (간병일지 기록 & 공유)  
│
├── 재활운동  (재활운동 영상 30+ 개)  
│
├── 지원정책  (정부 지원 정책 정보)  
│
├── 커뮤니티  (환자/가족/간병인 커뮤니티 공간)  
│
├── 민원 접수  (문의 / 요청 / 신고 창구)  
│
├── 공지  (공지사항 / 업데이트 안내)  
│
├── 유료회원 서비스 안내 / 문의  
│
└── (부가) 응급 가이드 / QR 코드 문의 / 개발 문의''',
        languages: ['한국어', '영어', '중국어', '일본어'],
        imageUrls: ['assets/images/projects/cashiq_brain_care.png'],
        order: 1,
        category: null,
        amount: null,
      ),
      PortfolioItem(
        id: 'jt8282',
        title: 'jt8282.com',
        subtitle: '운세의 신, 오라클 AI',
        description: '궁합 · 심리 분석 · 글로벌 6개국어 플랫폼',
        siteMap: '''jt8282.com
│
├── HOME (메인)
│    ├─ 오늘의 운세
│    ├─ AI Oracle 질문창
│    ├─ 궁합 보기
│    ├─ 상대방 심리 분석
│    ├─ 프리미엄 안내
│    └─ 언어 선택 (KR/EN/CN/JP/VN/AR)
│
├── 운세 (Fortune)
│    ├─ 오늘의 운세
│    ├─ 주간 운세
│    ├─ 연애 운세
│    ├─ 재물 운세
│    └─ 건강 운세
│
├── 오라클 AI (Oracle AI)
│    └─ AI 질문 답변 서비스''',
        languages: ['한국어', '영어', '중국어', '일본어', '베트남어', '아랍어'],
        imageUrls: ['assets/images/projects/oracle_ai.png'],
        order: 2,
        category: null,
        amount: null,
      ),
      PortfolioItem(
        id: 'jt365',
        title: 'jt365.me',
        subtitle: '전라도 맛집 / 무료배달 / 중고거래 / 지자체 홍보',
        description: '전라도 맛집·무료배달·중고거래·지자체 홍보 플랫폼',
        siteMap: '''jt365.me
│
├── HOME (메인)
│    ├─ 전라도 맛집 추천
│    ├─ 실시간 무료배달 안내
│    ├─ 중고거래 인기상품
│    ├─ 오늘의 지자체 정책·축제
│    └─ 언어 선택 (KR/EN/CN/JP)
│
├── 맛집 지도 (Food Map)
│    ├─ 지역별 맛집 (광주 / 전주 / 목포 / 여수 / 군산 / 순천 등)
│    ├─ 카테고리(한식·양식·중식·카페·야시장 등)
│    ├─ 리뷰 / 평점
│    └─ 추천 코스
│
├── 무료배달 서비스 (Free Delivery)
│    ├─ 제휴 음식점 목록
│    ├─ 최소주문금액 없음
│    ├─ 배달 가능 지역 안내
│    ├─ 실시간 주문·배차
│    └─ 배달 파트너 모집
│
├── 중고거래 (Local Market)
│    ├─ 판매하기
│    ├─ 구매하기
│    ├─ 동네 인증
│    ├─ 1:1 채팅
│    └─ 안전거래 가이드
│
├── 지자체 홍보센터 (Local Gov. Center)
│    ├─ 전남·전북 정책 안내
│    ├─ 지원금 / 청년정책 / 복지정책
│    ├─ 지역 축제 캘린더
│    ├─ 관광 명소 홍보
│    └─ 기업·소상공인 지원사업 안내''',
        languages: ['한국어', '영어', '중국어', '일본어'],
        imageUrls: ['assets/images/projects/jeolla_food.png'],
        order: 3,
        category: null,
        amount: null,
      ),
      PortfolioItem(
        id: 'jtbit',
        title: 'jtbit.me',
        subtitle: '커플·국제 연애 게이트 / 보이스피싱 방지 플랫폼',
        description: '안전한 국제 데이팅 및 보이스피싱 방지 서비스',
        siteMap: '''jtbit.me
│
├── HOME (메인)
│    ├─ 글로벌 데이팅 소개
│    ├─ 매칭 시작하기
│    ├─ 안전인증 안내
│    ├─ 인기 프로필
│    └─ 언어 (KR/EN/CN/JP/VN/AR)
│
├── 회원가입 / 인증센터
│    ├─ 기본 정보 입력
│    ├─ 신분증 인증 (여권/운전면허증/ID + 얼굴 사진 비교)
│    ├─ Selfie + 증명서 실시간 검증
│    ├─ SNS 3개 연동 (Instagram / Facebook / TikTok 등)
│    └─ VIP 심화 인증
│
├── 매칭 (Matching)
│    ├─ 국가별 매칭
│    ├─ 나이/언어/라이프스타일 필터
│    ├─ 연애 목적 선택 (연애/결혼/해외 장거리 등)
│    ├─ AI 추천 매칭
│    └─ 좋아요 / 관심 / 매칭 성사
│
├── 보이스피싱 / 로맨스스캠 방지 AI
│    ├─ 채팅 패턴 AI 분석
│    ├─ 금융요구·이상행동 자동 감지
│    ├─ 위험 사용자 차단 시스템
│    ├─ 인증 실패 사용자 경고
│    └─ 안전 수칙 안내''',
        languages: ['한국어', '영어', '중국어', '일본어', '베트남어', '아랍어'],
        imageUrls: ['assets/images/projects/couple_gate.png'],
        order: 4,
        category: null,
        amount: null,
      ),
      PortfolioItem(
        id: 'puke365',
        title: 'puke365.biz',
        subtitle: 'AI 음식 인식 · 칼로리 계산 · 영양 분석 · 질병위험도 예측',
        description: 'AI 기반 식단 관리 및 건강 분석 플랫폼',
        siteMap: '''puke365.biz
│
├── HOME (메인)
│    ├─ 음식 사진 업로드
│    ├─ 실시간 칼로리 분석
│    ├─ 영양소 분석 요약
│    ├─ 질병 위험도 경고
│    └─ 언어 선택 (KR/EN/CN/JP/VN/AR)
│
├── 음식 인식 AI
│    ├─ 사진 자동 분석
│    ├─ 음식 분류 모델
│    ├─ 1접시 분석 / 다중 음식 분석
│    └─ 음식 DB 자동 매칭
│
├── 칼로리 계산
│    ├─ Kcal 자동 산출
│    ├─ 3대 영양소 비율 (탄수·단백질·지방)
│    ├─ 섬유질·나트륨 등 확장 분석
│    └─ 1일 기준 섭취량 대비 분석
│
├── 질병 위험도 분석 (AI Health Risk)
│    ├─ 당뇨 위험도
│    ├─ 고혈압 위험도
│    ├─ 비만 위험도
│    ├─ 심혈관/대사질환 경고
│    └─ 맞춤형 건강 조언''',
        languages: ['한국어', '영어', '중국어', '일본어', '베트남어', '아랍어'],
        imageUrls: ['assets/images/projects/puke365_food_ai.png'],
        order: 5,
        category: null,
        amount: null,
      ),
      PortfolioItem(
        id: 'meditour',
        title: 'meditour.me',
        subtitle: '한국 의료·시술 정보 · 병원 안내 · 의료관광 통합 플랫폼',
        description: '의료관광 및 병원 정보 서비스',
        siteMap: '''meditour.me
│
├── HOME (메인)
│    ├─ 인기 시술 / 검진 패키지
│    ├─ 병원 · 클리닉 추천
│    ├─ 고객 후기
│    ├─ 상담 신청 버튼
│    └─ 언어 선택 (KR/EN/CN/JP/VN/AR)
│
├── 시술·검진 카테고리 (Treatments)
│    ├─ 성형외과
│    ├─ 피부과
│    ├─ 치과
│    ├─ 모발이식
│    ├─ 건강검진 패키지
│    └─ 기타(산부인과, 정형외과 등)
│
├── 병원/클리닉 정보 (Hospitals)
│    ├─ 병원 상세 정보
│    ├─ 전문의 소개
│    ├─ 시술 가격 안내
│    ├─ 위치/지도
│    ├─ 리뷰 & 후기
│    └─ 상담 요청하기
│
├── 가격 · 패키지 안내 (Pricing)
│    ├─ 시술별 가격
│    ├─ 건강검진 패키지
│    ├─ 성형 패키지
│    └─ 맞춤 견적 요청''',
        languages: ['한국어', '영어', '중국어', '일본어', '베트남어', '아랍어'],
        imageUrls: ['assets/images/projects/medi_trip.png'],
        order: 6,
        category: null,
        amount: null,
      ),
      PortfolioItem(
        id: 'tourit',
        title: 'tourit.xyz',
        subtitle: '병원 동행 중개 O2O 플랫폼·간병보조·실시간 매칭',
        description: '의료관광 동행 서비스',
        siteMap: '''tourit.xyz
│
├── HOME (메인)
│    ├─ 서비스 소개
│    ├─ 동행자 실시간 매칭 시작
│    ├─ 동행 요금 안내
│    ├─ 고객 후기
│    └─ 언어 선택 (KR/EN/CN/JP/VN/AR/TH)
│
├── 동행 서비스 예약 (Booking)
│    ├─ 병원 방문 동행
│    ├─ 검사·진료 동행
│    ├─ 입·퇴원 지원
│    ├─ 이동 보조
│    └─ 일정 예약 / 결제
│
├── 동행자 프로필 (Partners)
│    ├─ 동행자 리스트
│    ├─ 전문 분야(간병/언어 지원 등)
│    ├─ 경력 및 평점
│    ├─ 다국어 지원 여부
│    └─ 바로 요청하기
│
├── 실시간 매칭 (Realtime Matching)
│    ├─ 현재 가능한 동행자 보기
│    ├─ 지역·언어·성별 필터
│    ├─ 1:1 매칭 요청
│    └─ 매칭 알림 받기''',
        languages: ['한국어', '영어', '중국어', '일본어', '베트남어', '아랍어', '태국어'],
        imageUrls: ['assets/images/projects/care_walk.png'],
        order: 7,
        category: null,
        amount: null,
      ),
    ];
  }

  static CompanyInfo _createDefaultCompanyInfo() {
    return CompanyInfo(
      id: 'company_001',
      companyName: '개발팀',
      description: '다양한 플랫폼 개발 전문팀',
      teamMembers: ['개발팀'],
      developmentScope: [
        'Windows 응용프로그램 개발',
        'Unity 3D 프로그램 개발',
        '사이트개발',
        'Android, iPhone 어플 개발',
        'Python, Tensorflow, Pytorch, Keras, PyQT, OpenCV, Numpy, Pandas',
        'Unity3D, C#, 2D, Animation, 3D Animation, VR, AR',
        'Multiplayer Game, Game Server',
        'HTML5, CSS3, Javascript, Bootstrap, PHP, CI, Laravel, WordPress',
        'Node.Js, Express.Js, Django, VUE.Js, MySQL',
      ],
      youtubeLink: 'https://youtu.be/GSGFA8SuCBk',
      contactTelegram: 'HERB4989',
    );
  }

  // ==================== UNIFIED API (Auto-detects platform) ====================
  static List<PortfolioItem> getAllPortfolios() {
    if (_isWebPlatform) {
      final portfolios = _getWebPortfolios();
      portfolios.sort((a, b) => a.order.compareTo(b.order));
      return portfolios;
    } else {
      final box = Hive.box<PortfolioItem>(portfolioBoxName);
      final items = box.values.toList();
      items.sort((a, b) => a.order.compareTo(b.order));
      return items;
    }
  }

  static PortfolioItem? getPortfolioById(String id) {
    if (_isWebPlatform) {
      final portfolios = _getWebPortfolios();
      try {
        return portfolios.firstWhere((item) => item.id == id);
      } catch (e) {
        return portfolios.isNotEmpty ? portfolios.first : null;
      }
    } else {
      final box = Hive.box<PortfolioItem>(portfolioBoxName);
      return box.values.firstWhere(
        (item) => item.id == id,
        orElse: () => box.values.first,
      );
    }
  }

  static Future<void> addPortfolio(PortfolioItem item) async {
    if (_isWebPlatform) {
      final portfolios = _getWebPortfolios();
      portfolios.add(item);
      await _saveWebPortfolios(portfolios);
    } else {
      final box = Hive.box<PortfolioItem>(portfolioBoxName);
      await box.add(item);
    }
  }

  static Future<void> updatePortfolio(int index, PortfolioItem item) async {
    if (_isWebPlatform) {
      final portfolios = _getWebPortfolios();
      if (index >= 0 && index < portfolios.length) {
        portfolios[index] = item;
        await _saveWebPortfolios(portfolios);
      }
    } else {
      final box = Hive.box<PortfolioItem>(portfolioBoxName);
      await box.putAt(index, item);
    }
  }

  static Future<void> deletePortfolio(int index) async {
    if (_isWebPlatform) {
      final portfolios = _getWebPortfolios();
      if (index >= 0 && index < portfolios.length) {
        portfolios.removeAt(index);
        await _saveWebPortfolios(portfolios);
      }
    } else {
      final box = Hive.box<PortfolioItem>(portfolioBoxName);
      await box.deleteAt(index);
    }
  }

  // Company Info operations
  static CompanyInfo? getCompanyInfo() {
    if (_isWebPlatform) {
      return _getWebCompanyInfo();
    } else {
      final box = Hive.box<CompanyInfo>(companyBoxName);
      return box.values.isNotEmpty ? box.values.first : null;
    }
  }

  static Future<void> updateCompanyInfo(CompanyInfo info) async {
    if (_isWebPlatform) {
      await _saveWebCompanyInfo(info);
    } else {
      final box = Hive.box<CompanyInfo>(companyBoxName);
      if (box.isNotEmpty) {
        await box.putAt(0, info);
      } else {
        await box.add(info);
      }
    }
  }

  // Investment Notice operations (currently Hive-only for mobile)
  static InvestmentNotice? getInvestmentNotice() {
    if (_isWebPlatform) {
      // Not implemented for web yet
      return null;
    } else {
      final box = Hive.box<InvestmentNotice>(investmentNoticeBoxName);
      final activeNotices = box.values.where((notice) => notice.isActive).toList();
      return activeNotices.isNotEmpty ? activeNotices.first : null;
    }
  }

  static List<InvestmentNotice> getAllInvestmentNotices() {
    if (_isWebPlatform) {
      return [];
    } else {
      final box = Hive.box<InvestmentNotice>(investmentNoticeBoxName);
      return box.values.toList()..sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
    }
  }

  static Future<void> addInvestmentNotice(InvestmentNotice notice) async {
    if (!_isWebPlatform) {
      final box = Hive.box<InvestmentNotice>(investmentNoticeBoxName);
      await box.add(notice);
    }
  }

  static Future<void> updateInvestmentNotice(int index, InvestmentNotice notice) async {
    if (!_isWebPlatform) {
      final box = Hive.box<InvestmentNotice>(investmentNoticeBoxName);
      await box.putAt(index, notice);
    }
  }

  static Future<void> deleteInvestmentNotice(int index) async {
    if (!_isWebPlatform) {
      final box = Hive.box<InvestmentNotice>(investmentNoticeBoxName);
      await box.deleteAt(index);
    }
  }
}
