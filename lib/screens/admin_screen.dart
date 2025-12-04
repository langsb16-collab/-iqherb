import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/portfolio_provider.dart';
import '../models/portfolio_item.dart';
import 'admin_media_manager_screen.dart';
import 'admin_investment_notice_screen.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'dart:convert';

class AdminScreen extends StatefulWidget {
  const AdminScreen({super.key});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('관리자 페이지'),
        centerTitle: true,
      ),
      body: Consumer<PortfolioProvider>(
        builder: (context, provider, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Card(
                  color: Colors.blue.shade50,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        Icon(Icons.admin_panel_settings, size: 40, color: Colors.blue.shade700),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '포트폴리오 관리',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue.shade700,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '총 ${provider.portfolios.length}개의 프로젝트',
                                style: TextStyle(color: Colors.blue.shade600),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.campaign),
                          label: const Text('투자 안내'),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const AdminInvestmentNoticeScreen(),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                          ),
                        ),
                        const SizedBox(width: 8),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.perm_media),
                          label: const Text('미디어 관리'),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const AdminMediaManagerScreen(),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.purple,
                          ),
                        ),
                        const SizedBox(width: 8),
                        ElevatedButton.icon(
                          icon: const Icon(Icons.add),
                          label: const Text('새 프로젝트 추가'),
                          onPressed: () => _showAddEditDialog(context, null),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Portfolio List
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
                                            // uploadedImagePaths만 관리 (uploadedImageBytes는 미리보기용이므로 제거)
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
                // 카테고리 선택
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '카테고리 선택',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade400),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          isExpanded: true,
                          value: s