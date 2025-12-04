import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/portfolio_provider.dart';
import '../models/portfolio_item.dart';
import 'admin_media_manager_screen.dart';
import 'admin_investment_notice_screen.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'dart:convert';

class Admin222Screen extends StatefulWidget {
  const Admin222Screen({super.key});

  @override
  State<Admin222Screen> createState() => _Admin222ScreenState();
}

class _Admin222ScreenState extends State<Admin222Screen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('관리자 대시보드'),
        centerTitle: true,
        backgroundColor: Colors.blue.shade700,
        elevation: 0,
      ),
      body: Row(
        children: [
          // 사이드바
          NavigationRail(
            selectedIndex: _selectedIndex,
            onDestinationSelected: (int index) {
              setState(() {
                _selectedIndex = index;
              });
            },
            labelType: NavigationRailLabelType.all,
            backgroundColor: Colors.grey.shade100,
            destinations: const [
              NavigationRailDestination(
                icon: Icon(Icons.dashboard),
                selectedIcon: Icon(Icons.dashboard, color: Colors.blue),
                label: Text('대시보드'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.folder),
                selectedIcon: Icon(Icons.folder, color: Colors.blue),
                label: Text('프로젝트 관리'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.perm_media),
                selectedIcon: Icon(Icons.perm_media, color: Colors.blue),
                label: Text('미디어 관리'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.campaign),
                selectedIcon: Icon(Icons.campaign, color: Colors.blue),
                label: Text('투자 안내'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.info),
                selectedIcon: Icon(Icons.info, color: Colors.blue),
                label: Text('회사 소개'),
              ),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          // 메인 콘텐츠
          Expanded(
            child: _buildContent(),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    switch (_selectedIndex) {
      case 0:
        return _buildDashboard();
      case 1:
        return _buildProjectManagement();
      case 2:
        return _buildMediaManagementPage();
      case 3:
        return _buildInvestmentNoticePage();
      case 4:
        return _buildCompanyInfoPage();
      default:
        return _buildDashboard();
    }
  }

  Widget _buildDashboard() {
    return Consumer<PortfolioProvider>(
      builder: (context, provider, child) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '관리자 대시보드',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 24),
              GridView.count(
                crossAxisCount: 3,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 2,
                children: [
                  _buildStatCard(
                    '총 프로젝트',
                    '${provider.portfolios.length}개',
                    Icons.folder,
                    Colors.blue,
                  ),
                  _buildStatCard(
                    '총 이미지',
                    '${provider.portfolios.fold<int>(0, (sum, item) => sum + item.imageUrls.length)}개',
                    Icons.image,
                    Colors.green,
                  ),
                  _buildStatCard(
                    '총 동영상',
                    '${provider.portfolios.fold<int>(0, (sum, item) => sum + item.youtubeLinks.length)}개',
                    Icons.video_library,
                    Colors.orange,
                  ),
                ],
              ),
              const SizedBox(height: 32),
              Text(
                '최근 프로젝트',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 16),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: provider.portfolios.length > 5 ? 5 : provider.portfolios.length,
                itemBuilder: (context, index) {
                  final portfolio = provider.portfolios[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.blue.shade100,
                        child: Text('${portfolio.order}'),
                      ),
                      title: Text(portfolio.title),
                      subtitle: Text(portfolio.subtitle),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit, size: 20),
                            onPressed: () {
                              setState(() {
                                _selectedIndex = 1;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, size: 32, color: color),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    value,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectManagement() {
    return Consumer<PortfolioProvider>(
      builder: (context, provider, child) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '프로젝트 관리',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  ElevatedButton.icon(
                    icon: const Icon(Icons.add),
                    label: const Text('새 프로젝트 추가'),
                    onPressed: () => _showAddEditDialog(context, null),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: provider.portfolios.length,
                itemBuilder: (context, index) {
                  final portfolio = provider.portfolios[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ExpansionTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.blue.shade100,
                        child: Text(
                          '${portfolio.order}',
                          style: TextStyle(
                            color: Colors.blue.shade700,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      title: Text(
                        portfolio.title,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(portfolio.subtitle),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit, color: Colors.blue),
                            onPressed: () => _showAddEditDialog(context, index),
                            tooltip: '편집',
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete, color: Colors.red),
                            onPressed: () => _showDeleteDialog(context, index),
                            tooltip: '삭제',
                          ),
                        ],
                      ),
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _buildInfoRow('설명', portfolio.description),
                              const SizedBox(height: 8),
                              _buildInfoRow('지원 언어', portfolio.languages.join(', ')),
                              const SizedBox(height: 8),
                              _buildInfoRow('이미지', '${portfolio.imageUrls.length}개'),
                              const SizedBox(height: 8),
                              _buildInfoRow('유튜브', '${portfolio.youtubeLinks.length}개'),
                              const SizedBox(height: 12),
                              const Text(
                                '사이트맵:',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 4),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade100,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  portfolio.siteMap,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontFamily: 'monospace',
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
            ],
          ),
        );
      },
    );
  }

  Widget _buildMediaManagementPage() {
    return const AdminMediaManagerScreen();
  }

  Widget _buildInvestmentNoticePage() {
    return const AdminInvestmentNoticeScreen();
  }

  Widget _buildCompanyInfoPage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '회사 소개 관리',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 24),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '회사 소개 정보',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    '이 섹션에서는 회사 소개 페이지의 내용을 관리할 수 있습니다.',
                    style: TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    icon: const Icon(Icons.edit),
                    label: const Text('회사 소개 편집'),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('회사 소개 편집 기능이 곧 추가됩니다.'),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(
            '$label:',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        Expanded(
          child: Text(value),
        ),
      ],
    );
  }

  Widget _buildImagePreview(String imagePath) {
    // Base64 이미지 (data:image/... 형식)
    if (imagePath.startsWith('data:image')) {
      try {
        final base64String = imagePath.split(',')[1];
        final bytes = base64Decode(base64String);
        return Image.memory(
          bytes,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) => const Center(
            child: Icon(Icons.broken_image, size: 32, color: Colors.red),
          ),
        );
      } catch (e) {
        return const Center(
          child: Icon(Icons.broken_image, size: 32, color: Colors.red),
        );
      }
    }
    
    // HTTP URL 이미지
    if (imagePath.startsWith('http')) {
      return Image.network(
        imagePath,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => const Center(
          child: Icon(Icons.broken_image, size: 32, color: Colors.orange),
        ),
      );
    }
    
    // 기타 경우 (로컬 파일 경로 등)
    return const Center(
      child: Icon(Icons.image, size: 32, color: Colors.grey),
    );
  }

  void _showAddEditDialog(BuildContext context, int? index) {
    final provider = Provider.of<PortfolioProvider>(context, listen: false);
    final isEdit = index != null;
    final portfolio = isEdit ? provider.portfolios[index] : null;

    final titleController = TextEditingController(text: portfolio?.title ?? '');
    final subtitleController = TextEditingController(text: portfolio?.subtitle ?? '');
    final descriptionController = TextEditingController(text: portfolio?.description ?? '');
    final siteMapController = TextEditingController(text: portfolio?.siteMap ?? '');
    final languagesController = TextEditingController(text: portfolio?.languages.join(', ') ?? '');
    final youtubeLinksController = TextEditingController(text: portfolio?.youtubeLinks.join('\n') ?? '');
    final orderController = TextEditingController(text: portfolio?.order.toString() ?? '${provider.portfolios.length + 1}');
    final amountController = TextEditingController(text: portfolio?.amount?.toString() ?? '');
    
    // 업로드된 이미지 관리 (base64 문자열로 저장)
    List<String> uploadedImagePaths = List<String>.from(portfolio?.imageUrls ?? []);
    
    // 카테고리 선택 상태 (투자, 대출, 수익분배)
    String? selectedCategory = portfolio?.category;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text(isEdit ? '프로젝트 편집' : '새 프로젝트 추가'),
          content: SingleChildScrollView(
          child: SizedBox(
            width: 600,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleController,
                  decoration: const InputDecoration(
                    labelText: '제목 *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: subtitleController,
                  decoration: const InputDecoration(
                    labelText: '부제목 *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: '설명 *',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 2,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: siteMapController,
                  decoration: const InputDecoration(
                    labelText: '사이트맵 *',
                    border: OutlineInputBorder(),
                    hintText: '사이트 구조를 입력하세요',
                  ),
                  maxLines: 8,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: languagesController,
                  decoration: const InputDecoration(
                    labelText: '지원 언어 (쉼표로 구분) *',
                    border: OutlineInputBorder(),
                    hintText: '한국어, 영어, 중국어',
                  ),
                ),
                const SizedBox(height: 12),
                // 이미지 업로드 섹션
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Text(
                          '프로젝트 이미지',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        ElevatedButton.icon(
                          onPressed: () async {
                            try {
                              FilePickerResult? result = await FilePicker.platform.pickFiles(
                                type: FileType.custom,
                                allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                                allowMultiple: true,
                                withData: kIsWeb,
                              );

                              if (result != null && result.files.isNotEmpty) {
                                setDialogState(() {
                                  for (var file in result.files) {
                                    if (kIsWeb && file.bytes != null) {
                                      // 웹 플랫폼: 이미지를 base64로 변환하여 저장
                                      final extension = file.extension ?? 'png';
                                      final base64String = 'data:image/$extension;base64,${base64Encode(file.bytes!)}';
                                      uploadedImagePaths.add(base64String);
                                      if (kDebugMode) {
                                        debugPrint('✅ 이미지 추가: ${file.name} (${(file.bytes!.length / 1024).toStringAsFixed(1)} KB)');
                                      }
                                    } else if (file.path != null) {
                                      // 모바일 플랫폼: 파일 경로 저장
                                      uploadedImagePaths.add(file.path!);
                                      if (kDebugMode) {
                                        debugPrint('✅ 이미지 추가: ${file.path}');
                                      }
                                    }
                                  }
                                });
                                
                                if (!context.mounted) return;
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Row(
                                      children: [
                                        const Icon(Icons.check_circle, color: Colors.white),
                                        const SizedBox(width: 8),
                                        Text('${result.files.length}개의 이미지가 추가되었습니다.'),
                                      ],
                                    ),
                                    backgroundColor: Colors.green,
                                    duration: const Duration(seconds: 2),
                                  ),
                                );
                              }
                            } catch (e) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('이미지 업로드 실패: $e'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          },
                          icon: const Icon(Icons.add_photo_alternate, size: 20),
                          label: const Text('이미지 추가'),
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: uploadedImagePaths.isEmpty
                          ? const Center(
                              child: Padding(
                                padding: EdgeInsets.all(24),
                                child: Column(
                                  children: [
                                    Icon(Icons.image, size: 48, color: Colors.grey),
                                    SizedBox(height: 8),
                                    Text(
                                      '업로드된 이미지가 없습니다',
                                      style: TextStyle(color: Colors.grey),
                                    ),
                                  ],
                                ),
                              ),
                            )
                          : Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: List.generate(
                                uploadedImagePaths.length,
                                (i) => Stack(
                                  children: [
                                    Container(
                                      width: 100,
                                      height: 100,
                                      decoration: BoxDecoration(
                                        border: Border.all(color: Colors.grey.shade300),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(8),
                                        child: _buildImagePreview(uploadedImagePaths[i]),
                                      ),
                                    ),
                                    Positioned(
                                      top: 4,
                                      right: 4,
                                      child: InkWell(
                                        onTap: () {
                                          setDialogState(() {
                                            uploadedImagePaths.removeAt(i);
                                          });
                                        },
                                        child: Container(
                                          padding: const EdgeInsets.all(4),
                                          decoration: BoxDecoration(
                                            color: Colors.red.withValues(alpha: 0.9),
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(
                                            Icons.close,
                                            size: 16,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '총 ${uploadedImagePaths.length}개의 이미지',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: youtubeLinksController,
                  decoration: const InputDecoration(
                    labelText: '유튜브 링크 (한 줄에 하나씩)',
                    border: OutlineInputBorder(),
                    hintText: 'https://youtu.be/...',
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 12),
                // Category and Amount fields
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: selectedCategory,
                        decoration: const InputDecoration(
                          labelText: '카테고리',
                          border: OutlineInputBorder(),
                        ),
                        items: const [
                          DropdownMenuItem(value: null, child: Text('없음')),
                          DropdownMenuItem(value: '투자', child: Text('투자')),
                          DropdownMenuItem(value: '대출', child: Text('대출')),
                          DropdownMenuItem(value: '수익분배', child: Text('수익분배')),
                        ],
                        onChanged: (value) {
                          setDialogState(() {
                            selectedCategory = value;
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: amountController,
                        decoration: const InputDecoration(
                          labelText: '금액 (만원)',
                          border: OutlineInputBorder(),
                          hintText: '예: 5000',
                        ),
                        keyboardType: TextInputType.number,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: orderController,
                  decoration: const InputDecoration(
                    labelText: '순서 *',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                ),
              ],
            ),
          ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('취소'),
            ),
            ElevatedButton(
              onPressed: () {
                final title = titleController.text.trim();
                final subtitle = subtitleController.text.trim();
                final description = descriptionController.text.trim();
                final siteMap = siteMapController.text.trim();
                final languages = languagesController.text
                    .split(',')
                    .map((e) => e.trim())
                    .where((e) => e.isNotEmpty)
                    .toList();
                final youtubeLinks = youtubeLinksController.text
                    .split('\n')
                    .map((e) => e.trim())
                    .where((e) => e.isNotEmpty)
                    .toList();
                final order = int.tryParse(orderController.text) ?? provider.portfolios.length + 1;
                final amount = int.tryParse(amountController.text);

                if (title.isEmpty || subtitle.isEmpty || description.isEmpty || siteMap.isEmpty || languages.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('필수 항목을 모두 입력해주세요')),
                  );
                  return;
                }

                final newItem = PortfolioItem(
                  id: portfolio?.id ?? 'portfolio_${DateTime.now().millisecondsSinceEpoch}',
                  title: title,
                  subtitle: subtitle,
                  description: description,
                  siteMap: siteMap,
                  languages: languages,
                  imageUrls: uploadedImagePaths,
                  youtubeLinks: youtubeLinks,
                  order: order,
                  createdAt: portfolio?.createdAt,
                  updatedAt: DateTime.now(),
                  category: selectedCategory,
                  amount: amount,
                );

                if (isEdit) {
                  provider.updatePortfolio(index, newItem);
                } else {
                  provider.addPortfolio(newItem);
                }

                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(isEdit ? '프로젝트가 수정되었습니다.' : '프로젝트가 추가되었습니다.'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: Text(isEdit ? '수정' : '추가'),
            ),
          ],
        ),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, int index) {
    final provider = Provider.of<PortfolioProvider>(context, listen: false);
    final portfolio = provider.portfolios[index];
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('프로젝트 삭제'),
        content: Text('정말로 "${portfolio.title}" 프로젝트를 삭제하시겠습니까?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          ElevatedButton(
            onPressed: () {
              provider.deletePortfolio(index);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('프로젝트가 삭제되었습니다.'),
                  backgroundColor: Colors.red,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('삭제'),
          ),
        ],
      ),
    );
  }
}
