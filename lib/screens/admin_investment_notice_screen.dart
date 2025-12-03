import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:typed_data';
import '../models/investment_notice.dart';
import '../services/data_service.dart';

class AdminInvestmentNoticeScreen extends StatefulWidget {
  const AdminInvestmentNoticeScreen({super.key});

  @override
  State<AdminInvestmentNoticeScreen> createState() => _AdminInvestmentNoticeScreenState();
}

class _AdminInvestmentNoticeScreenState extends State<AdminInvestmentNoticeScreen> {
  List<InvestmentNotice> _notices = [];

  @override
  void initState() {
    super.initState();
    _loadNotices();
  }

  void _loadNotices() {
    setState(() {
      _notices = DataService.getAllInvestmentNotices();
    });
  }

  void _showAddEditDialog({InvestmentNotice? notice, int? index}) {
    final isEdit = notice != null;
    
    final titleController = TextEditingController(text: notice?.title ?? '');
    final contentController = TextEditingController(text: notice?.content ?? '');
    final youtubeLinksController = TextEditingController(
      text: notice?.youtubeLinks.join('\n') ?? '',
    );
    
    List<String> uploadedImagePaths = List<String>.from(notice?.imageUrls ?? []);
    List<Uint8List> uploadedImageBytes = [];
    
    List<String> uploadedVideoPaths = List<String>.from(notice?.videoUrls ?? []);
    List<Uint8List> uploadedVideoBytes = [];
    
    bool isActive = notice?.isActive ?? true;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text(isEdit ? '투자 안내 수정' : '새 투자 안내 작성'),
          content: SizedBox(
            width: 700,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 제목
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(
                      labelText: '제목 *',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.title),
                    ),
                    maxLines: 1,
                  ),
                  const SizedBox(height: 16),

                  // 내용
                  TextField(
                    controller: contentController,
                    decoration: const InputDecoration(
                      labelText: '내용 *',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.article),
                      hintText: '투자 관련 주요 안내 내용을 작성하세요',
                    ),
                    maxLines: 10,
                  ),
                  const SizedBox(height: 16),

                  // 이미지 업로드
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.image, color: Colors.blue),
                          const SizedBox(width: 8),
                          const Text(
                            '이미지',
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

                                if (result != null) {
                                  setDialogState(() {
                                    for (var file in result.files) {
                                      if (kIsWeb && file.bytes != null) {
                                        uploadedImageBytes.add(file.bytes!);
                                        uploadedImagePaths.add('uploaded_${file.name}');
                                      } else if (file.path != null) {
                                        uploadedImagePaths.add(file.path!);
                                      }
                                    }
                                  });
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('${result.files.length}개의 이미지가 추가되었습니다.'),
                                      backgroundColor: Colors.green,
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
                            icon: const Icon(Icons.add_photo_alternate, size: 18),
                            label: const Text('PC에서 이미지 업로드'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              foregroundColor: Colors.white,
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
                                  padding: EdgeInsets.all(16),
                                  child: Text('업로드된 이미지가 없습니다'),
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
                                          child: i < uploadedImageBytes.length
                                              ? Image.memory(
                                                  uploadedImageBytes[i],
                                                  fit: BoxFit.cover,
                                                )
                                              : const Center(
                                                  child: Icon(Icons.image, size: 32),
                                                ),
                                        ),
                                      ),
                                      Positioned(
                                        top: 4,
                                        right: 4,
                                        child: InkWell(
                                          onTap: () {
                                            setDialogState(() {
                                              if (i < uploadedImageBytes.length) {
                                                uploadedImageBytes.removeAt(i);
                                              }
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
                    ],
                  ),
                  const SizedBox(height: 16),

                  // 동영상 업로드
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.videocam, color: Colors.purple),
                          const SizedBox(width: 8),
                          const Text(
                            '동영상',
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
                                  allowedExtensions: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
                                  allowMultiple: true,
                                  withData: kIsWeb,
                                );

                                if (result != null) {
                                  setDialogState(() {
                                    for (var file in result.files) {
                                      if (kIsWeb && file.bytes != null) {
                                        uploadedVideoBytes.add(file.bytes!);
                                        uploadedVideoPaths.add('uploaded_${file.name}');
                                      } else if (file.path != null) {
                                        uploadedVideoPaths.add(file.path!);
                                      }
                                    }
                                  });
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('${result.files.length}개의 동영상이 추가되었습니다.'),
                                      backgroundColor: Colors.green,
                                    ),
                                  );
                                }
                              } catch (e) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('동영상 업로드 실패: $e'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              }
                            },
                            icon: const Icon(Icons.video_file, size: 18),
                            label: const Text('PC에서 동영상 업로드'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.purple,
                              foregroundColor: Colors.white,
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
                        child: uploadedVideoPaths.isEmpty
                            ? const Center(
                                child: Padding(
                                  padding: EdgeInsets.all(16),
                                  child: Text('업로드된 동영상이 없습니다'),
                                ),
                              )
                            : Column(
                                children: List.generate(
                                  uploadedVideoPaths.length,
                                  (i) => Container(
                                    margin: const EdgeInsets.only(bottom: 8),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.grey.shade100,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.video_file, color: Colors.purple),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Text(
                                            uploadedVideoPaths[i],
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.delete, color: Colors.red),
                                          onPressed: () {
                                            setDialogState(() {
                                              if (i < uploadedVideoBytes.length) {
                                                uploadedVideoBytes.removeAt(i);
                                              }
                                              uploadedVideoPaths.removeAt(i);
                                            });
                                          },
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // 유튜브 링크
                  TextField(
                    controller: youtubeLinksController,
                    decoration: const InputDecoration(
                      labelText: '유튜브 링크 (한 줄에 하나씩)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.video_library, color: Colors.red),
                      hintText: 'https://youtu.be/...',
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 16),

                  // 활성화 상태
                  SwitchListTile(
                    title: const Text('활성화'),
                    subtitle: const Text('홈 화면에 표시'),
                    value: isActive,
                    onChanged: (value) {
                      setDialogState(() {
                        isActive = value;
                      });
                    },
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
              onPressed: () async {
                if (titleController.text.isEmpty || contentController.text.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('제목과 내용을 입력해주세요.')),
                  );
                  return;
                }

                final newNotice = InvestmentNotice(
                  id: notice?.id ?? 'notice_${DateTime.now().millisecondsSinceEpoch}',
                  title: titleController.text,
                  content: contentController.text,
                  imageUrls: uploadedImagePaths,
                  videoUrls: uploadedVideoPaths,
                  youtubeLinks: youtubeLinksController.text.isEmpty
                      ? []
                      : youtubeLinksController.text.split('\n').where((e) => e.trim().isNotEmpty).toList(),
                  isActive: isActive,
                  createdAt: notice?.createdAt ?? DateTime.now(),
                  updatedAt: DateTime.now(),
                );

                if (isEdit && index != null) {
                  await DataService.updateInvestmentNotice(index, newNotice);
                } else {
                  await DataService.addInvestmentNotice(newNotice);
                }

                _loadNotices();
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(isEdit ? '투자 안내가 수정되었습니다.' : '투자 안내가 추가되었습니다.'),
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

  void _showDeleteDialog(int index) {
    final notice = _notices[index];
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('투자 안내 삭제'),
        content: Text('${notice.title}\n\n이 안내를 삭제하시겠습니까?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          ElevatedButton(
            onPressed: () async {
              await DataService.deleteInvestmentNotice(index);
              _loadNotices();
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('투자 안내가 삭제되었습니다.')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('삭제'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('투자 안내 관리'),
        centerTitle: true,
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // 헤더
          Container(
            padding: const EdgeInsets.all(20),
            color: Colors.orange.shade50,
            child: Row(
              children: [
                const Icon(Icons.campaign, size: 32, color: Colors.orange),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '투자 관련 주요 안내 관리',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '총 ${_notices.length}개의 안내',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () => _showAddEditDialog(),
                  icon: const Icon(Icons.add),
                  label: const Text('새 안내 작성'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          ),

          // 리스트
          Expanded(
            child: _notices.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.campaign, size: 64, color: Colors.grey),
                        SizedBox(height: 16),
                        Text(
                          '등록된 투자 안내가 없습니다',
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _notices.length,
                    itemBuilder: (context, index) {
                      final notice = _notices[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: notice.isActive
                                ? Colors.orange.shade100
                                : Colors.grey.shade200,
                            child: Icon(
                              Icons.campaign,
                              color: notice.isActive ? Colors.orange : Colors.grey,
                            ),
                          ),
                          title: Text(
                            notice.title,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 4),
                              Text(
                                notice.content,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  if (notice.imageUrls.isNotEmpty)
                                    Chip(
                                      label: Text('이미지 ${notice.imageUrls.length}'),
                                      avatar: const Icon(Icons.image, size: 16),
                                      visualDensity: VisualDensity.compact,
                                    ),
                                  if (notice.videoUrls.isNotEmpty) ...[
                                    const SizedBox(width: 4),
                                    Chip(
                                      label: Text('동영상 ${notice.videoUrls.length}'),
                                      avatar: const Icon(Icons.videocam, size: 16),
                                      visualDensity: VisualDensity.compact,
                                    ),
                                  ],
                                  if (notice.youtubeLinks.isNotEmpty) ...[
                                    const SizedBox(width: 4),
                                    Chip(
                                      label: Text('유튜브 ${notice.youtubeLinks.length}'),
                                      avatar: const Icon(Icons.video_library, size: 16),
                                      visualDensity: VisualDensity.compact,
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (!notice.isActive)
                                const Chip(
                                  label: Text('비활성'),
                                  backgroundColor: Colors.grey,
                                  labelStyle: TextStyle(color: Colors.white, fontSize: 12),
                                ),
                              IconButton(
                                icon: const Icon(Icons.edit, color: Colors.blue),
                                onPressed: () => _showAddEditDialog(notice: notice, index: index),
                              ),
                              IconButton(
                                icon: const Icon(Icons.delete, color: Colors.red),
                                onPressed: () => _showDeleteDialog(index),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
