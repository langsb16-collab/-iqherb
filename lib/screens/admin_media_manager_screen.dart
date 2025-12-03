import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;

class MediaItem {
  final String id;
  String name;
  final String type; // 'image' or 'video'
  final String? url;
  final Uint8List? bytes;
  final DateTime uploadedAt;
  String section;

  MediaItem({
    required this.id,
    required this.name,
    required this.type,
    this.url,
    this.bytes,
    required this.uploadedAt,
    required this.section,
  });
}

class AdminMediaManagerScreen extends StatefulWidget {
  const AdminMediaManagerScreen({super.key});

  @override
  State<AdminMediaManagerScreen> createState() => _AdminMediaManagerScreenState();
}

class _AdminMediaManagerScreenState extends State<AdminMediaManagerScreen> {
  final List<MediaItem> _mediaItems = [];
  String _selectedSection = '전체';
  final List<String> _sections = ['전체', '메인 배너', '프로젝트', '회사 소개', '팀원', '기타'];
  
  bool _isUploading = false;

  @override
  void initState() {
    super.initState();
    _loadSampleData();
  }

  void _loadSampleData() {
    // 샘플 데이터 로드 (실제로는 Hive나 서버에서 로드)
    _mediaItems.addAll([
      MediaItem(
        id: 'media_1',
        name: 'main_banner_1.jpg',
        type: 'image',
        url: 'https://picsum.photos/800/400?random=1',
        uploadedAt: DateTime.now().subtract(const Duration(days: 5)),
        section: '메인 배너',
      ),
      MediaItem(
        id: 'media_2',
        name: 'project_demo.mp4',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example',
        uploadedAt: DateTime.now().subtract(const Duration(days: 3)),
        section: '프로젝트',
      ),
      MediaItem(
        id: 'media_3',
        name: 'company_intro.jpg',
        type: 'image',
        url: 'https://picsum.photos/800/400?random=2',
        uploadedAt: DateTime.now().subtract(const Duration(days: 1)),
        section: '회사 소개',
      ),
    ]);
  }

  List<MediaItem> get _filteredMediaItems {
    if (_selectedSection == '전체') {
      return _mediaItems;
    }
    return _mediaItems.where((item) => item.section == _selectedSection).toList();
  }

  Future<void> _pickAndUploadFiles() async {
    try {
      setState(() {
        _isUploading = true;
      });

      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'webm'],
        allowMultiple: true,
        withData: kIsWeb, // 웹에서는 바이트 데이터 필요
      );

      if (result != null) {
        for (var file in result.files) {
          final String fileType = _getFileType(file.extension ?? '');
          
          final newMedia = MediaItem(
            id: 'media_${DateTime.now().millisecondsSinceEpoch}_${_mediaItems.length}',
            name: file.name,
            type: fileType,
            url: kIsWeb ? null : file.path,
            bytes: file.bytes,
            uploadedAt: DateTime.now(),
            section: _selectedSection == '전체' ? '기타' : _selectedSection,
          );

          setState(() {
            _mediaItems.insert(0, newMedia);
          });
        }

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('${result.files.length}개의 파일이 업로드되었습니다.'),
              backgroundColor: Colors.green,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('파일 업로드 실패: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  String _getFileType(String extension) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
    
    if (imageExtensions.contains(extension.toLowerCase())) {
      return 'image';
    } else if (videoExtensions.contains(extension.toLowerCase())) {
      return 'video';
    }
    return 'unknown';
  }

  void _showEditMediaDialog(MediaItem media) {
    final nameController = TextEditingController(text: media.name);
    String selectedSection = media.section;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('미디어 편집'),
          content: SizedBox(
            width: 400,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 미디어 미리보기
                if (media.type == 'image')
                  Container(
                    height: 200,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade300),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: media.bytes != null
                          ? Image.memory(
                              media.bytes!,
                              fit: BoxFit.cover,
                            )
                          : media.url != null
                              ? Image.network(
                                  media.url!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) =>
                                      const Center(child: Icon(Icons.broken_image, size: 48)),
                                )
                              : const Center(child: Icon(Icons.image, size: 48)),
                    ),
                  )
                else
                  Container(
                    height: 120,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade200,
                      border: Border.all(color: Colors.grey.shade300),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Center(
                      child: Icon(Icons.videocam, size: 64, color: Colors.grey),
                    ),
                  ),
                const SizedBox(height: 16),
                
                // 파일 이름
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: '파일 이름',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.title),
                  ),
                ),
                const SizedBox(height: 12),
                
                // 섹션 선택
                DropdownButtonFormField<String>(
                  initialValue: selectedSection,
                  decoration: const InputDecoration(
                    labelText: '섹션',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.category),
                  ),
                  items: _sections
                      .where((section) => section != '전체')
                      .map((section) => DropdownMenuItem(
                            value: section,
                            child: Text(section),
                          ))
                      .toList(),
                  onChanged: (value) {
                    setDialogState(() {
                      selectedSection = value!;
                    });
                  },
                ),
                const SizedBox(height: 12),
                
                // 파일 정보
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildInfoRow('타입', media.type == 'image' ? '이미지' : '동영상'),
                      const SizedBox(height: 4),
                      _buildInfoRow('업로드 날짜', _formatDate(media.uploadedAt)),
                      const SizedBox(height: 4),
                      _buildInfoRow('ID', media.id),
                    ],
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('취소'),
            ),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  media.name = nameController.text;
                  media.section = selectedSection;
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('미디어가 수정되었습니다.')),
                );
              },
              child: const Text('저장'),
            ),
          ],
        ),
      ),
    );
  }

  void _showDeleteConfirmDialog(MediaItem media) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('미디어 삭제'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('다음 미디어를 삭제하시겠습니까?'),
            const SizedBox(height: 8),
            Text(
              media.name,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _mediaItems.remove(media);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('미디어가 삭제되었습니다.'),
                  backgroundColor: Colors.red,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('삭제'),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      children: [
        SizedBox(
          width: 90,
          child: Text(
            '$label:',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(fontSize: 12),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final filteredItems = _filteredMediaItems;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('미디어 관리'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Column(
        children: [
          // 상단 컨트롤 바
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.blue.shade50,
            child: Row(
              children: [
                // 섹션 필터
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _sections.map((section) {
                        final isSelected = section == _selectedSection;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Text(section),
                            selected: isSelected,
                            onSelected: (selected) {
                              setState(() {
                                _selectedSection = section;
                              });
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                
                // 업로드 버튼
                ElevatedButton.icon(
                  onPressed: _isUploading ? null : _pickAndUploadFiles,
                  icon: _isUploading
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.upload_file),
                  label: Text(_isUploading ? '업로드 중...' : '파일 업로드'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  ),
                ),
              ],
            ),
          ),

          // 통계 카드
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    '전체 미디어',
                    _mediaItems.length.toString(),
                    Icons.perm_media,
                    Colors.blue,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    '이미지',
                    _mediaItems.where((m) => m.type == 'image').length.toString(),
                    Icons.image,
                    Colors.green,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    '동영상',
                    _mediaItems.where((m) => m.type == 'video').length.toString(),
                    Icons.videocam,
                    Colors.orange,
                  ),
                ),
              ],
            ),
          ),

          // 미디어 그리드
          Expanded(
            child: filteredItems.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.image_not_supported,
                          size: 64,
                          color: Colors.grey.shade400,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          '미디어가 없습니다',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '파일 업로드 버튼을 눌러 미디어를 추가하세요',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade500,
                          ),
                        ),
                      ],
                    ),
                  )
                : LayoutBuilder(
                    builder: (context, constraints) {
                      // 화면 크기에 따라 그리드 컬럼 수 조정
                      int crossAxisCount = 2;
                      if (constraints.maxWidth > 1200) {
                        crossAxisCount = 5;
                      } else if (constraints.maxWidth > 900) {
                        crossAxisCount = 4;
                      } else if (constraints.maxWidth > 600) {
                        crossAxisCount = 3;
                      }
                      
                      return GridView.builder(
                        padding: const EdgeInsets.all(16),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: crossAxisCount,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 1,
                        ),
                        itemCount: filteredItems.length,
                        itemBuilder: (context, index) {
                          final media = filteredItems[index];
                          return _buildMediaCard(media);
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMediaCard(MediaItem media) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => _showEditMediaDialog(media),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // 미디어 미리보기
            if (media.type == 'image')
              media.bytes != null
                  ? Image.memory(
                      media.bytes!,
                      fit: BoxFit.cover,
                    )
                  : media.url != null
                      ? Image.network(
                          media.url!,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              Container(
                                color: Colors.grey.shade200,
                                child: const Icon(Icons.broken_image, size: 48),
                              ),
                        )
                      : Container(
                          color: Colors.grey.shade200,
                          child: const Icon(Icons.image, size: 48),
                        )
            else
              Container(
                color: Colors.grey.shade300,
                child: const Icon(Icons.videocam, size: 48, color: Colors.grey),
              ),

            // 그라데이션 오버레이
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      Colors.black.withValues(alpha: 0.8),
                      Colors.transparent,
                    ],
                  ),
                ),
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      media.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      media.section,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 10,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),

            // 타입 배지
            Positioned(
              top: 8,
              left: 8,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: media.type == 'image' 
                      ? Colors.green.withValues(alpha: 0.9)
                      : Colors.orange.withValues(alpha: 0.9),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  media.type == 'image' ? '이미지' : '동영상',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            // 액션 버튼
            Positioned(
              top: 8,
              right: 8,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  InkWell(
                    onTap: () => _showEditMediaDialog(media),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.blue.withValues(alpha: 0.9),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.edit,
                        size: 16,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(width: 4),
                  InkWell(
                    onTap: () => _showDeleteConfirmDialog(media),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.red.withValues(alpha: 0.9),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.delete,
                        size: 16,
                        color: Colors.white,
                      ),
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
}
