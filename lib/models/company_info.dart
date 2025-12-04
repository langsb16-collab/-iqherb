class CompanyInfo {
  String id;
  String companyName;
  String description;
  List<String> teamMembers;
  List<String> developmentScope;
  String youtubeLink;
  String contactTelegram;
  String contactEmail;
  List<String> imageUrls;
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
