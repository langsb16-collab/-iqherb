class PortfolioItem {
  String id;
  String title;
  String subtitle;
  String description;
  String siteMap;
  List<String> languages;
  List<String> imageUrls;
  List<String> youtubeLinks;
  int order;
  DateTime createdAt;
  DateTime updatedAt;
  String? category; // 투자, 대출, 수익분배
  int? amount; // 금액 (단위: 만원)

  PortfolioItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.siteMap,
    required this.languages,
    this.imageUrls = const [],
    this.youtubeLinks = const [],
    required this.order,
    DateTime? createdAt,
    DateTime? updatedAt,
    this.category,
    this.amount,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'subtitle': subtitle,
      'description': description,
      'siteMap': siteMap,
      'languages': languages,
      'imageUrls': imageUrls,
      'youtubeLinks': youtubeLinks,
      'order': order,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'category': category,
      'amount': amount,
    };
  }

  factory PortfolioItem.fromJson(Map<String, dynamic> json) {
    return PortfolioItem(
      id: json['id'] as String,
      title: json['title'] as String,
      subtitle: json['subtitle'] as String,
      description: json['description'] as String,
      siteMap: json['siteMap'] as String,
      languages: List<String>.from(json['languages'] as List),
      imageUrls: List<String>.from(json['imageUrls'] as List? ?? []),
      youtubeLinks: List<String>.from(json['youtubeLinks'] as List? ?? []),
      order: json['order'] as int,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      category: json['category'] as String?,
      amount: json['amount'] as int?,
    );
  }
}
