import 'package:hive/hive.dart';

part 'portfolio_item.g.dart';

@HiveType(typeId: 0)
class PortfolioItem extends HiveObject {
  @HiveField(0)
  String id;

  @HiveField(1)
  String title;

  @HiveField(2)
  String subtitle;

  @HiveField(3)
  String description;

  @HiveField(4)
  String siteMap;

  @HiveField(5)
  List<String> languages;

  @HiveField(6)
  List<String> imageUrls;

  @HiveField(7)
  List<String> youtubeLinks;

  @HiveField(8)
  int order;

  @HiveField(9)
  DateTime createdAt;

  @HiveField(10)
  DateTime updatedAt;

  @HiveField(11)
  String? category; // 투자, 대출, 수익분배

  @HiveField(12)
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
