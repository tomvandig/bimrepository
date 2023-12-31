// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

namespace bimrepo
{

using global::System;
using global::System.Collections.Generic;
using global::Google.FlatBuffers;

public struct shape : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static void ValidateVersion() { FlatBufferConstants.FLATBUFFERS_23_5_26(); }
  public static shape GetRootAsshape(ByteBuffer _bb) { return GetRootAsshape(_bb, new shape()); }
  public static shape GetRootAsshape(ByteBuffer _bb, shape obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p = new Table(_i, _bb); }
  public shape __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public bimrepo.property? Properties(int j) { int o = __p.__offset(4); return o != 0 ? (bimrepo.property?)(new bimrepo.property()).__assign(__p.__indirect(__p.__vector(o) + j * 4), __p.bb) : null; }
  public int PropertiesLength { get { int o = __p.__offset(4); return o != 0 ? __p.__vector_len(o) : 0; } }

  public static Offset<bimrepo.shape> Createshape(FlatBufferBuilder builder,
      VectorOffset propertiesOffset = default(VectorOffset)) {
    builder.StartTable(1);
    shape.AddProperties(builder, propertiesOffset);
    return shape.Endshape(builder);
  }

  public static void Startshape(FlatBufferBuilder builder) { builder.StartTable(1); }
  public static void AddProperties(FlatBufferBuilder builder, VectorOffset propertiesOffset) { builder.AddOffset(0, propertiesOffset.Value, 0); }
  public static VectorOffset CreatePropertiesVector(FlatBufferBuilder builder, Offset<bimrepo.property>[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddOffset(data[i].Value); return builder.EndVector(); }
  public static VectorOffset CreatePropertiesVectorBlock(FlatBufferBuilder builder, Offset<bimrepo.property>[] data) { builder.StartVector(4, data.Length, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreatePropertiesVectorBlock(FlatBufferBuilder builder, ArraySegment<Offset<bimrepo.property>> data) { builder.StartVector(4, data.Count, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreatePropertiesVectorBlock(FlatBufferBuilder builder, IntPtr dataPtr, int sizeInBytes) { builder.StartVector(1, sizeInBytes, 1); builder.Add<Offset<bimrepo.property>>(dataPtr, sizeInBytes); return builder.EndVector(); }
  public static void StartPropertiesVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static Offset<bimrepo.shape> Endshape(FlatBufferBuilder builder) {
    int o = builder.EndTable();
    return new Offset<bimrepo.shape>(o);
  }
  public shapeT UnPack() {
    var _o = new shapeT();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(shapeT _o) {
    _o.Properties = new List<bimrepo.propertyT>();
    for (var _j = 0; _j < this.PropertiesLength; ++_j) {_o.Properties.Add(this.Properties(_j).HasValue ? this.Properties(_j).Value.UnPack() : null);}
  }
  public static Offset<bimrepo.shape> Pack(FlatBufferBuilder builder, shapeT _o) {
    if (_o == null) return default(Offset<bimrepo.shape>);
    var _properties = default(VectorOffset);
    if (_o.Properties != null) {
      var __properties = new Offset<bimrepo.property>[_o.Properties.Count];
      for (var _j = 0; _j < __properties.Length; ++_j) { __properties[_j] = bimrepo.property.Pack(builder, _o.Properties[_j]); }
      _properties = CreatePropertiesVector(builder, __properties);
    }
    return Createshape(
      builder,
      _properties);
  }
}

public class shapeT
{
  public List<bimrepo.propertyT> Properties { get; set; }

  public shapeT() {
    this.Properties = null;
  }
}


static public class shapeVerify
{
  static public bool Verify(Google.FlatBuffers.Verifier verifier, uint tablePos)
  {
    return verifier.VerifyTableStart(tablePos)
      && verifier.VerifyVectorOfTables(tablePos, 4 /*Properties*/, bimrepo.propertyVerify.Verify, false)
      && verifier.VerifyTableEnd(tablePos);
  }
}

}
