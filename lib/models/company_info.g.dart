// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'company_info.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class CompanyInfoAdapter extends TypeAdapter<CompanyInfo> {
  @override
  final int typeId = 1;

  @override
  CompanyInfo read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return CompanyInfo(
      id: fields[0] as String,
      companyName: fields[1] as String,
      description: fields[2] as String,
      teamMembers: (fields[3] as List).cast<String>(),
      developmentScope: (fields[4] as List).cast<String>(),
      youtubeLink: fields[5] as String,
      contactTelegram: fields[6] as String,
      contactEmail: fields[7] as String? ?? '',
      imageUrls: (fields[8] as List?)?.cast<String>() ?? [],
      updatedAt: fields[9] as DateTime?,
    );
  }

  @override
  void write(BinaryWriter writer, CompanyInfo obj) {
    writer
      ..writeByte(10)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.companyName)
      ..writeByte(2)
      ..write(obj.description)
      ..writeByte(3)
      ..write(obj.teamMembers)
      ..writeByte(4)
      ..write(obj.developmentScope)
      ..writeByte(5)
      ..write(obj.youtubeLink)
      ..writeByte(6)
      ..write(obj.contactTelegram)
      ..writeByte(7)
      ..write(obj.contactEmail)
      ..writeByte(8)
      ..write(obj.imageUrls)
      ..writeByte(9)
      ..write(obj.updatedAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CompanyInfoAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
