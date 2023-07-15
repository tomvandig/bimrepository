// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

namespace bimrepo
{

using global::System;
using global::System.Collections.Generic;
using global::Google.FlatBuffers;

public struct property : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static void ValidateVersion() { FlatBufferConstants.FLATBUFFERS_23_5_26(); }
  public static property GetRootAsproperty(ByteBuffer _bb) { return GetRootAsproperty(_bb, new property()); }
  public static property GetRootAsproperty(ByteBuffer _bb, property obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p = new Table(_i, _bb); }
  public property __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public string Name { get { int o = __p.__offset(4); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetNameBytes() { return __p.__vector_as_span<byte>(4, 1); }
#else
  public ArraySegment<byte>? GetNameBytes() { return __p.__vector_as_arraysegment(4); }
#endif
  public byte[] GetNameArray() { return __p.__vector_as_array<byte>(4); }
  public bimrepo.PropertyType Type { get { int o = __p.__offset(6); return o != 0 ? (bimrepo.PropertyType)__p.bb.GetSbyte(o + __p.bb_pos) : bimrepo.PropertyType.Number; } }
  public bimrepo.Items? Items { get { int o = __p.__offset(8); return o != 0 ? (bimrepo.Items?)(new bimrepo.Items()).__assign(__p.__indirect(o + __p.bb_pos), __p.bb) : null; } }

  public static Offset<bimrepo.property> Createproperty(FlatBufferBuilder builder,
      StringOffset nameOffset = default(StringOffset),
      bimrepo.PropertyType type = bimrepo.PropertyType.Number,
      Offset<bimrepo.Items> itemsOffset = default(Offset<bimrepo.Items>)) {
    builder.StartTable(3);
    property.AddItems(builder, itemsOffset);
    property.AddName(builder, nameOffset);
    property.AddType(builder, type);
    return property.Endproperty(builder);
  }

  public static void Startproperty(FlatBufferBuilder builder) { builder.StartTable(3); }
  public static void AddName(FlatBufferBuilder builder, StringOffset nameOffset) { builder.AddOffset(0, nameOffset.Value, 0); }
  public static void AddType(FlatBufferBuilder builder, bimrepo.PropertyType type) { builder.AddSbyte(1, (sbyte)type, 1); }
  public static void AddItems(FlatBufferBuilder builder, Offset<bimrepo.Items> itemsOffset) { builder.AddOffset(2, itemsOffset.Value, 0); }
  public static Offset<bimrepo.property> Endproperty(FlatBufferBuilder builder) {
    int o = builder.EndTable();
    return new Offset<bimrepo.property>(o);
  }
  public propertyT UnPack() {
    var _o = new propertyT();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(propertyT _o) {
    _o.Name = this.Name;
    _o.Type = this.Type;
    _o.Items = this.Items.HasValue ? this.Items.Value.UnPack() : null;
  }
  public static Offset<bimrepo.property> Pack(FlatBufferBuilder builder, propertyT _o) {
    if (_o == null) return default(Offset<bimrepo.property>);
    var _name = _o.Name == null ? default(StringOffset) : builder.CreateString(_o.Name);
    var _items = _o.Items == null ? default(Offset<bimrepo.Items>) : bimrepo.Items.Pack(builder, _o.Items);
    return Createproperty(
      builder,
      _name,
      _o.Type,
      _items);
  }
}

public class propertyT
{
  public string Name { get; set; }
  public bimrepo.PropertyType Type { get; set; }
  public bimrepo.ItemsT Items { get; set; }

  public propertyT() {
    this.Name = null;
    this.Type = bimrepo.PropertyType.Number;
    this.Items = null;
  }
}


static public class propertyVerify
{
  static public bool Verify(Google.FlatBuffers.Verifier verifier, uint tablePos)
  {
    return verifier.VerifyTableStart(tablePos)
      && verifier.VerifyString(tablePos, 4 /*Name*/, false)
      && verifier.VerifyField(tablePos, 6 /*Type*/, 1 /*bimrepo.PropertyType*/, 1, false)
      && verifier.VerifyTable(tablePos, 8 /*Items*/, bimrepo.ItemsVerify.Verify, false)
      && verifier.VerifyTableEnd(tablePos);
  }
}

}