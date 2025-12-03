import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class DragDropUploadZone extends StatefulWidget {
  final VoidCallback onUploadTap;
  final bool isUploading;

  const DragDropUploadZone({
    super.key,
    required this.onUploadTap,
    this.isUploading = false,
  });

  @override
  State<DragDropUploadZone> createState() => _DragDropUploadZoneState();
}

class _DragDropUploadZoneState extends State<DragDropUploadZone> {
  bool _isDragging = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: widget.isUploading ? SystemMouseCursors.wait : SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.isUploading ? null : widget.onUploadTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          height: 200,
          decoration: BoxDecoration(
            color: _isDragging
                ? Colors.blue.shade50
                : Colors.grey.shade100,
            border: Border.all(
              color: _isDragging
                  ? Colors.blue
                  : Colors.grey.shade300,
              width: 2,
              strokeAlign: BorderSide.strokeAlignInside,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (widget.isUploading)
                  const CircularProgressIndicator()
                else
                  Icon(
                    _isDragging ? Icons.cloud_upload : Icons.cloud_upload_outlined,
                    size: 64,
                    color: _isDragging ? Colors.blue : Colors.grey.shade600,
                  ),
                const SizedBox(height: 16),
                Text(
                  widget.isUploading
                      ? '업로드 중...'
                      : _isDragging
                          ? '파일을 여기에 놓으세요'
                          : kIsWeb
                              ? '클릭하여 파일 선택 또는 드래그 앤 드롭'
                              : '클릭하여 파일 선택',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: _isDragging ? Colors.blue : Colors.grey.shade700,
                  ),
                ),
                const SizedBox(height: 8),
                if (!widget.isUploading)
                  Text(
                    '이미지 (JPG, PNG, GIF) 또는 동영상 (MP4, MOV, AVI)',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
