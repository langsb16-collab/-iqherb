// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'investment_notice.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class InvestmentNoticeAdapter extends TypeAdapter<InvestmentNotice> {
  @override
  final int typeId = 2;

  @override
  InvestmentNotice read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return InvestmentNotice(
      id: fields[0] as String,
      title: fields[1] as String,
      content: fields[2] as String,
      imageUrls: (fields[3] as List).cast<String>(),
      videoUrls: (fields[4] as List).cast<String>(),
      youtubeLinks: (fields[5] as List).cast<String>(),
      createdAt: fields[6] as DateTime,
      updatedAt: fields[7] as DateTime,
      isActive: fields[8] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, InvestmentNotice obj) {
    writer
      ..writeByte(9)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.content)
      ..writeByte(3)
      ..write(obj.imageUrls)
      ..writeByte(4)
      ..write(obj.videoUrls)
      ..writeByte(5)
      ..write(obj.youtubeLinks)
      ..writeByte(6)
      ..write(obj.createdAt)
      ..writeByte(7)
      ..write(obj.updatedAt)
      ..writeByte(8)
      ..write(obj.isActive);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is InvestmentNoticeAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
