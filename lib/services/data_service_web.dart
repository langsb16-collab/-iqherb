import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/portfolio_item.dart';
import '../models/company_info.dart';
import '../models/investment_notice.dart';

/// Web-only DataService using SharedPreferences
/// This file is ONLY used on web platform (no Hive dependency)
class DataServiceWeb {
  static SharedPreferences? _prefs;
  static bool _isInitialized = false;

  static Future<void> initialize() async {
    if (_isInitialized) {
      debugPrint('⚠️ DataServiceWeb already initialized');
      return;
    }

    try {
      debugPrint('🌐 Initializing web storage (SharedPreferences)...');
      _prefs = await SharedPreferences.getInstance();
      
      // Initialize default data
      await _initializeDefaultData();
      
      _isInitialized = true;
      debugPrint('✅ Web storage initialized successfully (NO Hive/IndexedDB)');
    } catch (e) {
      debugPrint('❌ Web storage initialization error: $e');
      _isInitialized = true; // Mark as initialized to prevent retries
    }
  }

  static Future<void> _initializeDefaultData() async {
    final portfolios = getAllPortfolios();
    if (portfolios.isEmpty) {
      await _addDefaultPortfolios();
    }
    
    final company = getCompanyInfo();
    if (company == null) {
      await _addDefaultCompanyInfo();
    }
  }

  // ==================== Portfolio Operations ====================
  static List<PortfolioItem> getAllPortfolios() {
    if (_prefs == null) return [];
    final String? data = _prefs!.getString('portfolios');
    if (data == null) return [];
    
    try {
      final List<dynamic> jsonList = json.decode(data);
      final portfolios = jsonList.map((json) => PortfolioItem.fromJson(json)).toList();
      portfolios.sort((a, b) => a.order.compareTo(b.order));
      return portfolios;
    } catch (e) {
      debugPrint('❌ Failed to decode portfolios: $e');
      return [];
    }
  }

  static PortfolioItem? getPortfolioById(String id) {
    final portfolios = getAllPortfolios();
    try {
      return portfolios.firstWhere((item) => item.id == id);
    } catch (e) {
      return portfolios.isNotEmpty ? portfolios.first : null;
    }
  }

  static Future<void> addPortfolio(PortfolioItem item) async {
    final portfolios = getAllPortfolios();
    portfolios.add(item);
    await _savePortfolios(portfolios);
  }

  static Future<void> updatePortfolio(int index, PortfolioItem item) async {
    final portfolios = getAllPortfolios();
    if (index >= 0 && index < portfolios.length) {
      portfolios[index] = item;
      await _savePortfolios(portfolios);
    }
  }

  static Future<void> deletePortfolio(int index) async {
    final portfolios = getAllPortfolios();
    if (index >= 0 && index < portfolios.length) {
      portfolios.removeAt(index);
      await _savePortfolios(portfolios);
    }
  }

  static Future<void> _savePortfolios(List<PortfolioItem> portfolios) async {
    if (_prefs == null) return;
    final jsonList = portfolios.map((p) => p.toJson()).toList();
    await _prefs!.setString('portfolios', json.encode(jsonList));
  }

  // ==================== Company Info Operations ====================
  static CompanyInfo? getCompanyInfo() {
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

  static Future<void> updateCompanyInfo(CompanyInfo info) async {
    if (_prefs == null) return;
    await _prefs!.setString('company', json.encode(info.toJson()));
  }

  // ==================== Investment Notice Operations ====================
  static InvestmentNotice? getInvestmentNotice() {
    // Not implemented for web yet
    return null;
  }

  static List<InvestmentNotice> getAllInvestmentNotices() {
    return [];
  }

  static Future<void> addInvestmentNotice(InvestmentNotice notice) async {
    // Not implemented for web yet
  }

  static Future<void> updateInvestmentNotice(int index, InvestmentNotice notice) async {
    // Not implemented for web yet
  }

  static Future<void> deleteInvestmentNotice(int index) async {
    // Not implemented for web yet
  }

  // ==================== Default Data ====================
  static Future<void> _addDefaultPortfolios() async {
    final portfolios = _createDefaultPortfolios();
    await _savePortfolios(portfolios);
    debugPrint('✅ Added ${portfolios.length} default portfolios');
  }

  static Future<void> _addDefaultCompanyInfo() async {
    final company = _createDefaultCompanyInfo();
    await updateCompanyInfo(company);
    debugPrint('✅ Added default company info');
  }

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
      // Add remaining portfolios (continuing from previous implementation)
      PortfolioItem(
        id: 'jt365',
        title: 'jt365.me',
        subtitle: '전라도 맛집 / 무료배달 / 중고거래 / 지자체 홍보',
        description: '전라도 맛집·무료배달·중고거래·지자체 홍보 플랫폼',
        siteMap: 'jt365.me - 전라도 플랫폼',
        languages: ['한국어', '영어', '중국어', '일본어'],
        imageUrls: ['assets/images/projects/jeolla_food.png'],
        order: 3,
      ),
      PortfolioItem(
        id: 'jtbit',
        title: 'jtbit.me',
        subtitle: '커플·국제 연애 게이트 / 보이스피싱 방지 플랫폼',
        description: '안전한 국제 데이팅 및 보이스피싱 방지 서비스',
        siteMap: 'jtbit.me - 안전한 데이팅',
        languages: ['한국어', '영어', '중국어', '일본어', '베트남어', '아랍어'],
        imageUrls: ['assets/images/projects/couple_gate.png'],
        order: 4,
      ),
      PortfolioItem(
        id: 'puke365',
        title: 'puke365.biz',
        subtitle: 'AI 음식 인식 · 칼로리 계산 · 영양 분석 · 질병위험도 예측',
        description: 'AI 기반 식단 관리 및 건강 분석 플랫폼',
        siteMap: 'puke365.biz - AI 식단 관리',
        languages: ['한국어', '영어', '중국어', '일본어', '베트남어', '아랍어'],
        imageUrls: ['assets/images/projects/puke365_food_ai.png'],
        order: 5,
      ),
      PortfolioItem(
        id: 'meditour',
        title: 'meditour.me',
        subtitle: '한국 의료·시술 정보 · 병원 안내 · 의료관광 통합 플랫폼',
        description: '의료관광 및 병원 정보 서비스',
        siteMap: 'meditour.me - 의료관광',
        languages: ['한국어', '영어', '중국어', '일본어', '베트남어', '아랍어'],
        imageUrls: ['assets/images/projects/medi_trip.png'],
        order: 6,
      ),
      PortfolioItem(
        id: 'tourit',
        title: 'tourit.xyz',
        subtitle: '병원 동행 중개 O2O 플랫폼·간병보조·실시간 매칭',
        description: '의료관광 동행 서비스',
        siteMap: 'tourit.xyz - 동행 서비스',
        languages: ['한국어', '영어', '중국어', '일본어', '베트남어', '아랍어', '태국어'],
        imageUrls: ['assets/images/projects/care_walk.png'],
        order: 7,
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
}
