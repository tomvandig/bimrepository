// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

namespace bimrepo
{

using global::System;
using global::System.Collections.Generic;
using global::Google.FlatBuffers;

public struct Component : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static void ValidateVersion() { FlatBufferConstants.FLATBUFFERS_23_5_26(); }
  public static Component GetRootAsComponent(ByteBuffer _bb) { return GetRootAsComponent(_bb, new Component()); }
  public static Component GetRootAsComponent(ByteBuffer _bb, Component obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public static bool VerifyComponent(ByteBuffer _bb) {Google.FlatBuffers.Verifier verifier = new Google.FlatBuffers.Verifier(_bb); return verifier.VerifyBuffer("", false, ComponentVerify.Verify); }
  public void __init(int _i, ByteBuffer _bb) { __p = new Table(_i, _bb); }
  public Component __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public uint Entity { get { int o = __p.__offset(4); return o != 0 ? __p.bb.GetUint(o + __p.bb_pos) : (uint)0; } }
  public string Type(int j) { int o = __p.__offset(6); return o != 0 ? __p.__string(__p.__vector(o) + j * 4) : null; }
  public int TypeLength { get { int o = __p.__offset(6); return o != 0 ? __p.__vector_len(o) : 0; } }
  public bimrepo.ComponentData? Data(int j) { int o = __p.__offset(8); return o != 0 ? (bimrepo.ComponentData?)(new bimrepo.ComponentData()).__assign(__p.__indirect(__p.__vector(o) + j * 4), __p.bb) : null; }
  public int DataLength { get { int o = __p.__offset(8); return o != 0 ? __p.__vector_len(o) : 0; } }

  public static Offset<bimrepo.Component> CreateComponent(FlatBufferBuilder builder,
      uint entity = 0,
      VectorOffset typeOffset = default(VectorOffset),
      VectorOffset dataOffset = default(VectorOffset)) {
    builder.StartTable(3);
    Component.AddData(builder, dataOffset);
    Component.AddType(builder, typeOffset);
    Component.AddEntity(builder, entity);
    return Component.EndComponent(builder);
  }

  public static void StartComponent(FlatBufferBuilder builder) { builder.StartTable(3); }
  public static void AddEntity(FlatBufferBuilder builder, uint entity) { builder.AddUint(0, entity, 0); }
  public static void AddType(FlatBufferBuilder builder, VectorOffset typeOffset) { builder.AddOffset(1, typeOffset.Value, 0); }
  public static VectorOffset CreateTypeVector(FlatBufferBuilder builder, StringOffset[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddOffset(data[i].Value); return builder.EndVector(); }
  public static VectorOffset CreateTypeVectorBlock(FlatBufferBuilder builder, StringOffset[] data) { builder.StartVector(4, data.Length, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreateTypeVectorBlock(FlatBufferBuilder builder, ArraySegment<StringOffset> data) { builder.StartVector(4, data.Count, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreateTypeVectorBlock(FlatBufferBuilder builder, IntPtr dataPtr, int sizeInBytes) { builder.StartVector(1, sizeInBytes, 1); builder.Add<StringOffset>(dataPtr, sizeInBytes); return builder.EndVector(); }
  public static void StartTypeVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static void AddData(FlatBufferBuilder builder, VectorOffset dataOffset) { builder.AddOffset(2, dataOffset.Value, 0); }
  public static VectorOffset CreateDataVector(FlatBufferBuilder builder, Offset<bimrepo.ComponentData>[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddOffset(data[i].Value); return builder.EndVector(); }
  public static VectorOffset CreateDataVectorBlock(FlatBufferBuilder builder, Offset<bimrepo.ComponentData>[] data) { builder.StartVector(4, data.Length, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreateDataVectorBlock(FlatBufferBuilder builder, ArraySegment<Offset<bimrepo.ComponentData>> data) { builder.StartVector(4, data.Count, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreateDataVectorBlock(FlatBufferBuilder builder, IntPtr dataPtr, int sizeInBytes) { builder.StartVector(1, sizeInBytes, 1); builder.Add<Offset<bimrepo.ComponentData>>(dataPtr, sizeInBytes); return builder.EndVector(); }
  public static void StartDataVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static Offset<bimrepo.Component> EndComponent(FlatBufferBuilder builder) {
    int o = builder.EndTable();
    return new Offset<bimrepo.Component>(o);
  }
  public static void FinishComponentBuffer(FlatBufferBuilder builder, Offset<bimrepo.Component> offset) { builder.Finish(offset.Value); }
  public static void FinishSizePrefixedComponentBuffer(FlatBufferBuilder builder, Offset<bimrepo.Component> offset) { builder.FinishSizePrefixed(offset.Value); }
  public ComponentT UnPack() {
    var _o = new ComponentT();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(ComponentT _o) {
    _o.Entity = this.Entity;
    _o.Type = new List<string>();
    for (var _j = 0; _j < this.TypeLength; ++_j) {_o.Type.Add(this.Type(_j));}
    _o.Data = new List<bimrepo.ComponentDataT>();
    for (var _j = 0; _j < this.DataLength; ++_j) {_o.Data.Add(this.Data(_j).HasValue ? this.Data(_j).Value.UnPack() : null);}
  }
  public static Offset<bimrepo.Component> Pack(FlatBufferBuilder builder, ComponentT _o) {
    if (_o == null) return default(Offset<bimrepo.Component>);
    var _type = default(VectorOffset);
    if (_o.Type != null) {
      var __type = new StringOffset[_o.Type.Count];
      for (var _j = 0; _j < __type.Length; ++_j) { __type[_j] = builder.CreateString(_o.Type[_j]); }
      _type = CreateTypeVector(builder, __type);
    }
    var _data = default(VectorOffset);
    if (_o.Data != null) {
      var __data = new Offset<bimrepo.ComponentData>[_o.Data.Count];
      for (var _j = 0; _j < __data.Length; ++_j) { __data[_j] = bimrepo.ComponentData.Pack(builder, _o.Data[_j]); }
      _data = CreateDataVector(builder, __data);
    }
    return CreateComponent(
      builder,
      _o.Entity,
      _type,
      _data);
  }
}

public class ComponentT
{
  public uint Entity { get; set; }
  public List<string> Type { get; set; }
  public List<bimrepo.ComponentDataT> Data { get; set; }

  public ComponentT() {
    this.Entity = 0;
    this.Type = null;
    this.Data = null;
  }
  public static ComponentT DeserializeFromBinary(byte[] fbBuffer) {
    return Component.GetRootAsComponent(new ByteBuffer(fbBuffer)).UnPack();
  }
  public byte[] SerializeToBinary() {
    var fbb = new FlatBufferBuilder(0x10000);
    Component.FinishComponentBuffer(fbb, Component.Pack(fbb, this));
    return fbb.DataBuffer.ToSizedArray();
  }
}


static public class ComponentVerify
{
  static public bool Verify(Google.FlatBuffers.Verifier verifier, uint tablePos)
  {
    return verifier.VerifyTableStart(tablePos)
      && verifier.VerifyField(tablePos, 4 /*Entity*/, 4 /*uint*/, 4, false)
      && verifier.VerifyVectorOfStrings(tablePos, 6 /*Type*/, false)
      && verifier.VerifyVectorOfTables(tablePos, 8 /*Data*/, bimrepo.ComponentDataVerify.Verify, false)
      && verifier.VerifyTableEnd(tablePos);
  }
}

}