import 'package:hive/hive.dart';

part 'project.g.dart';

@HiveType(typeId: 0)
class Project extends HiveObject {
  @HiveField(0)
  String id;

  @HiveField(1)
  String name;

  @HiveField(2)
  String type; // 'SELF-HOSTED' or 'SAAS'

  @HiveField(3)
  String url;

  @HiveField(4)
  String status; // 'Active', 'In Progress', 'Offline'

  @HiveField(5)
  DateTime lastUpdated;

  @HiveField(6)
  String? description;

  @HiveField(7)
  bool isSecure;

  Project({
    required this.id,
    required this.name,
    required this.type,
    required this.url,
    required this.status,
    required this.lastUpdated,
    this.description,
    this.isSecure = false,
  });

  // Factory constructor for creating a new Project instance from a map
  factory Project.fromMap(Map<String, dynamic> map) {
    return Project(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      type: map['type'] ?? 'SELF-HOSTED',
      url: map['url'] ?? '',
      status: map['status'] ?? 'Active',
      lastUpdated: map['lastUpdated'] is DateTime 
          ? map['lastUpdated'] 
          : DateTime.parse(map['lastUpdated']),
      description: map['description'],
      isSecure: map['isSecure'] ?? false,
    );
  }

  // Convert Project instance to a map
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'url': url,
      'status': status,
      'lastUpdated': lastUpdated.toIso8601String(),
      'description': description,
      'isSecure': isSecure,
    };
  }

  // Copy with method for immutability
  Project copyWith({
    String? id,
    String? name,
    String? type,
    String? url,
    String? status,
    DateTime? lastUpdated,
    String? description,
    bool? isSecure,
  }) {
    return Project(
      id: id ?? this.id,
      name: name ?? this.name,
      type: type ?? this.type,
      url: url ?? this.url,
      status: status ?? this.status,
      lastUpdated: lastUpdated ?? this.lastUpdated,
      description: description ?? this.description,
      isSecure: isSecure ?? this.isSecure,
    );
  }
}
