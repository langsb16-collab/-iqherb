import 'package:hive/hive.dart';

part 'company_info.g.dart';

@HiveType(typeId: 1)
class CompanyInfo extends HiveObject {
  @HiveField(0)
  String id;

  @HiveField(1)
  String companyName;

  @HiveField(2)
  String description;

  @HiveField(3)
  List<String> teamMembers;

  @HiveField(4)
  List<String> developmentScope;

  @HiveField(5)
  String youtubeLink;

  @HiveField(6)
  String contactTelegram;

  @HiveField(7)
  String contactEmail;

  @HiveField(8)
  List<String> imageUrls;

  @HiveField(9)
  DateTime updatedAt;

  CompanyInfo({
    required this.id,
    required this.companyName,
    required this.description,
    required this.teamMembers,
    required this.developmentScope,
    required this.youtubeLink,
    required this.contactTelegram,
    this.contactEmail = '',
    this.imageUrls = const [],
    DateTime? updatedAt,
  }) : updatedAt = updatedAt ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'companyName': companyName,
      'description': description,
      'teamMembers': teamMembers,
      'developmentScope': developmentScope,
      'youtubeLink': youtubeLink,
      'contactTelegram': contactTelegram,
      'contactEmail': contactEmail,
      'imageUrls': imageUrls,
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory CompanyInfo.fromJson(Map<String, dynamic> json) {
    return CompanyInfo(
      id: json['id'] as String,
      companyName: json['companyName'] as String,
      description: json['description'] as String,
      teamMembers: List<String>.from(json['teamMembers'] as List),
      developmentScope: List<String>.from(json['developmentScope'] as List),
      youtubeLink: json['youtubeLink'] as String,
      contactTelegram: json['contactTelegram'] as String,
      contactEmail: json['contactEmail'] as String? ?? '',
      imageUrls: List<String>.from(json['imageUrls'] as List? ?? []),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }
}
