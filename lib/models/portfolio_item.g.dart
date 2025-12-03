// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'portfolio_item.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class PortfolioItemAdapter extends TypeAdapter<PortfolioItem> {
  @override
  final int typeId = 0;

  @override
  PortfolioItem read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return PortfolioItem(
      id: fields[0] as String,
      title: fields[1] as String,
      subtitle: fields[2] as String,
      description: fields[3] as String,
      siteMap: fields[4] as String,
      languages: (fields[5] as List).cast<String>(),
      imageUrls: (fields[6] as List?)?.cast<String>() ?? [],
      youtubeLinks: (fields[7] as List?)?.cast<String>() ?? [],
      order: fields[8] as int,
      createdAt: fields[9] as DateTime?,
      updatedAt: fields[10] as DateTime?,
      category: fields[11] as String?,
      amount: fields[12] as int?,
    );
  }

  @override
  void write(BinaryWriter writer, PortfolioItem obj) {
    writer
      ..writeByte(13)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.subtitle)
      ..writeByte(3)
      ..write(obj.description)
      ..writeByte(4)
      ..write(obj.siteMap)
      ..writeByte(5)
      ..write(obj.languages)
      ..writeByte(6)
      ..write(obj.imageUrls)
      ..writeByte(7)
      ..write(obj.youtubeLinks)
      ..writeByte(8)
      ..write(obj.order)
      ..writeByte(9)
      ..write(obj.createdAt)
      ..writeByte(10)
      ..write(obj.updatedAt)
      ..writeByte(11)
      ..write(obj.category)
      ..writeByte(12)
      ..write(obj.amount);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PortfolioItemAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
