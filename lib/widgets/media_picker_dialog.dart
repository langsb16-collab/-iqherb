import 'package:flutter/material.dart';
import '../screens/admin_media_manager_screen.dart';

class MediaPickerDialog extends StatefulWidget {
  final List<MediaItem> mediaItems;
  final bool allowMultiple;
  final String? mediaType; // 'image' or 'video' or null for both

  const MediaPickerDialog({
    super.key,
    required this.mediaItems,
    this.allowMultiple = false,
    this.mediaType,
  });

  @override
  State<MediaPickerDialog> createState() => _MediaPickerDialogState();
}

class _MediaPickerDialogState extends State<MediaPickerDialog> {
  final Set<String> _selectedIds = {};

  List<MediaItem> get _filteredItems {
    if (widget.mediaType == null) {
      return widget.mediaItems;
    }
    return widget.mediaItems.where((item) => item.type == widget.mediaType).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filteredItems = _filteredItems;

    return Dialog(
      child: Container(
        width: MediaQuery.of(context).size.width * 0.7,
        height: MediaQuery.of(context).size.height * 0.7,
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 헤더
            Row(
              children: [
                Icon(Icons.perm_media, size: 28, color: Colors.blue.shade700),
                const SizedBox(width: 12),
                Text(
                  widget.mediaType == 'image'
                      ? '이미지 선택'
                      : widget.mediaType == 'video'
                          ? '동영상 선택'
                          : '미디어 선택',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                  tooltip: '닫기',
                ),
              ],
            ),
            const Divider(height: 24),

            // 선택 정보
            if (widget.allowMultiple && _selectedIds.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Chip(
                  label: Text('${_selectedIds.length}개 선택됨'),
                  deleteIcon: const Icon(Icons.clear, size: 18),
                  onDeleted: () {
                    setState(() {
                      _selectedIds.clear();
                    });
                  },
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
                            '사용 가능한 미디어가 없습니다',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    )
                  : GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 4,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 1,
                      ),
                      itemCount: filteredItems.length,
                      itemBuilder: (context, index) {
                        final media = filteredItems[index];
                        final isSelected = _selectedIds.contains(media.id);

                        return InkWell(
                          onTap: () {
                            if (widget.allowMultiple) {
                              setState(() {
                                if (isSelected) {
                                  _selectedIds.remove(media.id);
                                } else {
                                  _selectedIds.add(media.id);
                                }
                              });
                            } else {
                              Navigator.pop(context, [media]);
                            }
                          },
                          child: Card(
                            clipBehavior: Clip.antiAlias,
                            elevation: isSelected ? 4 : 1,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                              side: BorderSide(
                                color: isSelected ? Colors.blue : Colors.transparent,
                                width: 3,
                              ),
                            ),
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

                                // 선택 표시
                                if (isSelected)
                                  Container(
                                    color: Colors.blue.withValues(alpha: 0.3),
                                    child: const Center(
                                      child: Icon(
                                        Icons.check_circle,
                                        size: 48,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),

                                // 파일 이름 오버레이
                                Positioned(
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
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
                                    child: Text(
                                      media.name,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),

            // 액션 버튼 (다중 선택 모드일 때만)
            if (widget.allowMultiple) ...[
              const Divider(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('취소'),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _selectedIds.isEmpty
                        ? null
                        : () {
                            final selectedItems = filteredItems
                                .where((item) => _selectedIds.contains(item.id))
                                .toList();
                            Navigator.pop(context, selectedItems);
                          },
                    child: Text('선택 (${_selectedIds.length})'),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
