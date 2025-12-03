import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../providers/portfolio_provider.dart';
import '../models/portfolio_item.dart';
import '../services/data_service.dart';
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
                final notice = DataService.getInvestmentNotice();
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
          IconButton(
            icon: const Icon(Icons.admin_panel_settings),
            onPressed: () {
              Navigator.pushNamed(context, '/admin');
            },
            tooltip: '관리자',
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
                // Header Section
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(32),
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
                      const Icon(
                        Icons.work_outline,
                        size: 64,
                        color: Colors.white,
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        '포트폴리오',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${provider.portfolios.length}개의 프로젝트',
                        style: const TextStyle(
                          fontSize: 18,
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
                  child: Column(
                    children: [
                      const Text(
                        '© 2024 Portfolio Manager',
                        style: TextStyle(color: Colors.grey),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          TextButton.icon(
                            icon: const Icon(Icons.info_outline, size: 18),
                            label: const Text('회사소개'),
                            onPressed: () {
                              Navigator.pushNamed(context, '/company-info');
                            },
                          ),
                          const SizedBox(width: 16),
                          TextButton.icon(
                            icon: const Icon(Icons.admin_panel_settings, size: 18),
                            label: const Text('관리자'),
                            onPressed: () {
                              Navigator.pushNamed(context, '/admin');
                            },
                          ),
                        ],
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
                              color: Colors.black,
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
}
