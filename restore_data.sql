-- 기존 데이터 삭제 (새로 시작)
DELETE FROM projects;

-- 11개 프로젝트 복구
INSERT INTO projects (title_ko, title_en, title_zh, description_ko, description_en, description_zh, text_info_ko, text_info_en, text_info_zh, thumbnail_url, image_url, youtube_url_1, youtube_url_2, youtube_url_3, youtube_url_4, youtube_url_5, status, display_order, created_at, updated_at) VALUES
('코인자동매매 프로그램 cashiq.me 고객 본인 계정 사용 only', 'Crypto Auto-Trading Program cashiq.me Customer Own Account Only', '加密货币自动交易程序 cashiq.me 仅限客户自有账户', '고객님의 거래소 계정으로 자동매매를 실행합니다. cashiq.me에서 안전하게 이용하세요.', 'Execute auto-trading with your own exchange account. Use it safely at cashiq.me.', '使用您自己的交易所账户执行自动交易。在 cashiq.me 安全使用。', '본인 계정 직접 연동', 'Direct account integration', '直接账户连接', '', '', '', '', '', '', '', 'active', 1, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),

('뇌질환 케어 전문 의료관광 패키지', 'Specialized Medical Tourism Package for Brain Disease Care', '脑疾病护理专业医疗旅游套餐', '뇌질환 전문 케어와 함께하는 의료관광 서비스', 'Medical tourism service with specialized brain disease care', '提供专业脑疾病护理的医疗旅游服务', '전문 의료진 상담 포함', 'Includes professional medical consultation', '包含专业医疗咨询', '', '', '', '', '', '', '', 'active', 2, '2024-01-15 11:00:00', '2024-01-15 11:00:00'),

('암호화폐 베팅 플랫폼', 'Cryptocurrency Betting Platform', '加密货币投注平台', '안전하고 투명한 암호화폐 기반 베팅 서비스', 'Safe and transparent cryptocurrency-based betting service', '安全透明的加密货币投注服务', '블록체인 기반 투명성', 'Blockchain-based transparency', '基于区块链的透明度', '', '', '', '', '', '', '', 'active', 3, '2024-01-15 12:00:00', '2024-01-15 12:00:00'),

('AI 기반 사주 운세 분석', 'AI-Based Fortune Telling Analysis', '基于AI的命理分析', '인공지능이 분석하는 정확한 사주 운세', 'Accurate fortune telling analyzed by artificial intelligence', '人工智能分析的准确命理', '개인 맞춤형 운세', 'Personalized fortune', '个性化运势', '', '', '', '', '', '', '', 'active', 4, '2024-01-15 13:00:00', '2024-01-15 13:00:00'),

('전라도 수퍼로드 관광 코스', 'Jeollado Superroad Tourism Course', '全罗道超级公路旅游路线', '전라도의 숨은 명소를 찾아가는 특별한 여행', 'Special journey to discover hidden attractions in Jeollado', '探索全罗道隐藏景点的特别旅程', '현지인 추천 코스', 'Local recommended course', '当地推荐路线', '', '', '', '', '', '', '', 'active', 5, '2024-01-15 14:00:00', '2024-01-15 14:00:00'),

('의료관광 종합 플랫폼', 'Comprehensive Medical Tourism Platform', '综合医疗旅游平台', '한국 의료관광의 모든 것을 한 곳에서', 'Everything about Korean medical tourism in one place', '韩国医疗旅游的一切尽在一处', '병원 예약부터 통역까지', 'From hospital reservation to interpretation', '从医院预约到翻译', '', '', '', '', '', '', '', 'active', 6, '2024-01-15 15:00:00', '2024-01-15 15:00:00'),

('캘린더 AI 일정관리', 'Calendar AI Schedule Management', '日历AI日程管理', 'AI가 최적의 일정을 추천해드립니다', 'AI recommends optimal schedules for you', 'AI为您推荐最佳日程', '스마트 일정 조정', 'Smart schedule adjustment', '智能日程调整', '', '', '', '', '', '', '', 'active', 7, '2024-01-15 16:00:00', '2024-01-15 16:00:00'),

('여행 추천 플랫폼 TourIt', 'Travel Recommendation Platform TourIt', '旅游推荐平台TourIt', '당신만을 위한 맞춤 여행 추천', 'Customized travel recommendations just for you', '专为您定制的旅游推荐', 'AI 기반 추천 시스템', 'AI-based recommendation system', '基于AI的推荐系统', '', '', '', '', '', '', '', 'active', 8, '2024-01-15 17:00:00', '2024-01-15 17:00:00'),

('디지털 명함 Puke365', 'Digital Business Card Puke365', '数字名片Puke365', '스마트한 디지털 명함으로 네트워킹 시작', 'Start networking with smart digital business cards', '使用智能数字名片开始建立人脉', 'QR 코드 공유 가능', 'QR code sharing available', '可分享二维码', '', '', '', '', '', '', '', 'active', 9, '2024-01-15 18:00:00', '2024-01-15 18:00:00'),

('JT 비트코인 거래소', 'JT Bitcoin Exchange', 'JT比特币交易所', '안전하고 빠른 암호화폐 거래', 'Safe and fast cryptocurrency trading', '安全快速的加密货币交易', '실시간 시세 제공', 'Real-time price quotes', '提供实时行情', '', '', '', '', '', '', '', 'active', 10, '2024-01-15 19:00:00', '2024-01-15 19:00:00'),

('토론 플랫폼 Debate', 'Debate Platform Debate', '辩论平台Debate', '건강한 토론 문화를 만들어갑니다', 'Creating a healthy debate culture', '创造健康的辩论文化', '실시간 투표 기능', 'Real-time voting feature', '实时投票功能', '', '', '', '', '', '', '', 'active', 11, '2024-01-15 20:00:00', '2024-01-15 20:00:00');
