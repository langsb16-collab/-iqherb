import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:lottie/lottie.dart';
import '../providers/portfolio_provider.dart';
import '../models/portfolio_item.dart';
import '../services/data_service_web.dart';
import 'investment_notice_screen.dart';
import 'dart:convert';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Portfolio Manager',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        actions: [
          // 투자 관련 주요 안내 버튼
          Container(
            margin: const EdgeInsets.only(right: 8),
            child: ElevatedButton.icon(
              onPressed: () {
                final notice = DataServiceWeb.getInvestmentNotice();
                if (notice != null) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => InvestmentNoticeScreen(notice: notice),
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('등록된 투자 안내가 없습니다.'),
                      backgroundColor: Colors.orange,
                    ),
                  );
                }
              },
              icon: const Icon(Icons.campaign, size: 20),
              label: const Text('투자 관련 주요 안내'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              Navigator.pushNamed(context, '/company-info');
            },
            tooltip: '회사소개',
          ),
        ],
      ),
      body: Consumer<PortfolioProvider>(
        builder: (context, provider, child) {
          if (provider.portfolios.isEmpty) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          return SingleChildScrollView(
            child: Column(
              children: [
                // Header Section with Lottie Animation (70% 축소 + 모바일 최적화)
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.symmetric(
                    vertical: MediaQuery.of(context).size.width < 600 ? 16 : 24,
                    horizontal: MediaQuery.of(context).size.width < 600 ? 16 : 32,
                  ),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.blue.shade700,
                        Colors.blue.shade500,
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Column(
                    children: [
                      // Lottie Animation Hero Section (70% 축소)
                      LayoutBuilder(
                        builder: (context, constraints) {
                          // 모바일: 화면 폭의 80%, 데스크톱: 364px (520 * 0.7)
                          final isMobile = MediaQuery.of(context).size.width < 600;
                          final animWidth = isMobile 
                              ? MediaQuery.of(context).size.width * 0.8 
                              : 364.0; // 520 * 0.7
                          final animHeight = isMobile 
                              ? animWidth * 0.75 // 모바일 비율 유지
                              : 280.0; // 400 * 0.7
                          
                          return SizedBox(
                            width: animWidth,
                            height: animHeight,
                            child: Lottie.network(
                              '/lottie/laptop-hero-10s.json',
                              fit: BoxFit.contain,
                              repeat: true,
                              animate: true,
                              errorBuilder: (context, error, stackTrace) {
                                // Fallback to icon if Lottie fails to load
                                return Icon(
                                  Icons.work_outline,
                                  size: isMobile ? 48 : 64,
                                  color: Colors.white,
                                );
                              },
                            ),
                          );
                        },
                      ),
                      SizedBox(height: MediaQuery.of(context).size.width < 600 ? 12 : 16),
                      Text(
                        '포트폴리오',
                        style: TextStyle(
                          fontSize: MediaQuery.of(context).size.width < 600 ? 24 : 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: MediaQuery.of(context).size.width < 600 ? 4 : 8),
                      Text(
                        '${provider.portfolios.length}개의 프로젝트',
                        style: TextStyle(
                          fontSize: MediaQuery.of(context).size.width < 600 ? 14 : 16,
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),

                // Portfolio Grid
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      // Responsive grid columns
                      int crossAxisCount;
                      if (constraints.maxWidth > 1200) {
                        crossAxisCount = 3;
                      } else if (constraints.maxWidth > 800) {
                        crossAxisCount = 2;
                      } else {
                        crossAxisCount = 1;
                      }

                      return GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: crossAxisCount,
                          childAspectRatio: 1.2,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                        ),
                        itemCount: provider.portfolios.length,
                        itemBuilder: (context, index) {
                          final portfolio = provider.portfolios[index];
                          return _buildPortfolioCard(context, portfolio);
                        },
                      );
                    },
                  ),
                ),

                // Footer
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  color: Colors.grey.shade100,
                  child: Stack(
                    children: [
                      Column(
                        children: [
                          const Text(
                            '© 2024 Portfolio Manager',
                            style: TextStyle(color: Colors.grey),
                          ),
                          const SizedBox(height: 8),
                          TextButton.icon(
                            icon: const Icon(Icons.info_outline, size: 18),
                            label: const Text('회사소개'),
                            onPressed: () {
                              Navigator.pushNamed(context, '/company-info');
                            },
                          ),
                        ],
                      ),
                      // 숨겨진 관리자 버튼 (오른쪽 하단)
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: InkWell(
                          onTap: () {
                            Navigator.pushNamed(context, '/admin222');
                          },
                          child: Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade200,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildPortfolioCard(BuildContext context, PortfolioItem portfolio) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          Navigator.pushNamed(
            context,
            '/portfolio-detail',
            arguments: portfolio.id,
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail Image
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  border: Border.all(color: Colors.grey.shade300, width: 1),
                ),
                child: _buildThumbnailImage(portfolio),
              ),
            ),
            
            // Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title
                    Text(
                      portfolio.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    
                    // Subtitle
                    Text(
                      portfolio.subtitle,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey.shade700,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    
                    // Category & Amount Buttons
                    Row(
                      children: [
                        if (portfolio.category != null)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.red,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              portfolio.category!,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        if (portfolio.category != null && portfolio.amount != null)
                          const SizedBox(width: 6),
                        if (portfolio.amount != null)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.black,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              '${portfolio.amount}만원',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const Spacer(),
                    
                    // Languages
                    Wrap(
                      spacing: 4,
                      runSpacing: 4,
                      children: portfolio.languages.take(3).map((lang) {
                        return Chip(
                          label: Text(
                            lang,
                            style: const TextStyle(fontSize: 9),
                          ),
                          padding: EdgeInsets.zero,
                          visualDensity: VisualDensity.compact,
                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildThumbnailImage(PortfolioItem portfolio) {
    // 유튜브 링크가 있으면 썸네일 표시 (우선순위 1)
    if (portfolio.youtubeLinks.isNotEmpty) {
      final youtubeUrl = portfolio.youtubeLinks.first;
      String? videoId = _extractYoutubeVideoId(youtubeUrl);
      
      if (videoId != null) {
        final thumbnailUrl = 'https://img.youtube.com/vi/$videoId/hqdefault.jpg';
        return Stack(
          fit: StackFit.expand,
          children: [
            CachedNetworkImage(
              imageUrl: thumbnailUrl,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(
                color: Colors.grey.shade200,
                child: const Center(
                  child: CircularProgressIndicator(),
                ),
              ),
              errorWidget: (context, url, error) => _buildPlaceholderImage(portfolio),
            ),
            // 유튜브 플레이 버튼 오버레이
            Center(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.9),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.play_arrow,
                  color: Colors.white,
                  size: 32,
                ),
              ),
            ),
          ],
        );
      }
    }
    
    if (portfolio.imageUrls.isEmpty) {
      return _buildPlaceholderImage(portfolio);
    }

    final imageUrl = portfolio.imageUrls.first;
    
    // HTTP URL \uc774\ubbf8\uc9c0 (CachedNetworkImage \uc0ac\uc6a9)
    if (imageUrl.startsWith('http')) {
      return CachedNetworkImage(
        imageUrl: imageUrl,
        fit: BoxFit.contain,
        placeholder: (context, url) => Container(
          color: Colors.grey.shade200,
          child: const Center(
            child: CircularProgressIndicator(),
          ),
        ),
        errorWidget: (context, url, error) => _buildPlaceholderImage(portfolio),
      );
    }
    
    // Base64 \uc774\ubbf8\uc9c0 (data:image/... \ud615\uc2dd)
    if (imageUrl.startsWith('data:image')) {
      try {
        final base64String = imageUrl.split(',')[1];
        final bytes = base64Decode(base64String);
        return Image.memory(
          bytes,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) => _buildPlaceholderImage(portfolio),
        );
      } catch (e) {
        return _buildPlaceholderImage(portfolio);
      }
    }
    
    // \uae30\ud0c0 \uacbd\uc6b0 (\ub85c\uceec \ud30c\uc77c \uacbd\ub85c \ub4f1) - \ud50c\ub808\uc774\uc2a4\ud640\ub354 \ud45c\uc2dc
    return _buildPlaceholderImage(portfolio);
  }

  Widget _buildPlaceholderImage(PortfolioItem portfolio) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            _getGradientColor(portfolio.order).withValues(alpha: 0.3),
            _getGradientColor(portfolio.order).withValues(alpha: 0.1),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Icon(
        _getIconForPortfolio(portfolio.order),
        size: 48,
        color: _getGradientColor(portfolio.order),
      ),
    );
  }

  Color _getGradientColor(int order) {
    final colors = [
      Colors.blue,
      Colors.purple,
      Colors.green,
      Colors.orange,
      Colors.red,
      Colors.teal,
      Colors.indigo,
    ];
    return colors[(order - 1) % colors.length];
  }

  IconData _getIconForPortfolio(int order) {
    final icons = [
      Icons.medical_services,
      Icons.stars,
      Icons.restaurant,
      Icons.favorite,
      Icons.health_and_safety,
      Icons.local_hospital,
      Icons.accessible,
    ];
    return icons[(order - 1) % icons.length];
  }

  // 유튜브 비디오 ID 추출 함수
  String? _extractYoutubeVideoId(String url) {
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    final regExp = RegExp(
      r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})',
      caseSensitive: false,
    );
    final match = regExp.firstMatch(url);
    return match?.group(1);
  }
}
