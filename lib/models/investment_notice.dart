class InvestmentNotice {
  String id;
  String title;
  String content;
  List<String> imageUrls;
  List<String> videoUrls;
  List<String> youtubeLinks;
  DateTime createdAt;
  DateTime updatedAt;
  bool isActive;

  InvestmentNotice({
    required this.id,
    required this.title,
    required this.content,
    this.imageUrls = const [],
    this.videoUrls = const [],
    this.youtubeLinks = const [],
    DateTime? createdAt,
    DateTime? updatedAt,
    this.isActive = true,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'imageUrls': imageUrls,
      'videoUrls': videoUrls,
      'youtubeLinks': youtubeLinks,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isActive': isActive,
    };
  }

  factory InvestmentNotice.fromJson(Map<String, dynamic> json) {
    return InvestmentNotice(
      id: json['id'] as String,
      title: json['title'] as String,
      content: json['content'] as String,
      imageUrls: List<String>.from(json['imageUrls'] as List? ?? []),
      videoUrls: List<String>.from(json['videoUrls'] as List? ?? []),
      youtubeLinks: List<String>.from(json['youtubeLinks'] as List? ?? []),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
    );
  }
}
