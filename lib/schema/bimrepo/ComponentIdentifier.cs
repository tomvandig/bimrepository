// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

namespace bimrepo
{

using global::System;
using global::System.Collections.Generic;
using global::Google.FlatBuffers;

public struct ComponentIdentifier : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static void ValidateVersion() { FlatBufferConstants.FLATBUFFERS_23_5_26(); }
  public static ComponentIdentifier GetRootAsComponentIdentifier(ByteBuffer _bb) { return GetRootAsComponentIdentifier(_bb, new ComponentIdentifier()); }
  public static ComponentIdentifier GetRootAsComponentIdentifier(ByteBuffer _bb, ComponentIdentifier obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public void __init(int _i, ByteBuffer _bb) { __p = new Table(_i, _bb); }
  public ComponentIdentifier __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public bimrepo.uuidv4? Entity { get { int o = __p.__offset(4); return o != 0 ? (bimrepo.uuidv4?)(new bimrepo.uuidv4()).__assign(o + __p.bb_pos, __p.bb) : null; } }
  public ushort ComponentType { get { int o = __p.__offset(6); return o != 0 ? __p.bb.GetUshort(o + __p.bb_pos) : (ushort)0; } }
  public ushort ComponentIndex { get { int o = __p.__offset(8); return o != 0 ? __p.bb.GetUshort(o + __p.bb_pos) : (ushort)0; } }

  public static Offset<bimrepo.ComponentIdentifier> CreateComponentIdentifier(FlatBufferBuilder builder,
      bimrepo.uuidv4T entity = null,
      ushort component_type = 0,
      ushort component_index = 0) {
    builder.StartTable(3);
    ComponentIdentifier.AddEntity(builder, bimrepo.uuidv4.Pack(builder, entity));
    ComponentIdentifier.AddComponentIndex(builder, component_index);
    ComponentIdentifier.AddComponentType(builder, component_type);
    return ComponentIdentifier.EndComponentIdentifier(builder);
  }

  public static void StartComponentIdentifier(FlatBufferBuilder builder) { builder.StartTable(3); }
  public static void AddEntity(FlatBufferBuilder builder, Offset<bimrepo.uuidv4> entityOffset) { builder.AddStruct(0, entityOffset.Value, 0); }
  public static void AddComponentType(FlatBufferBuilder builder, ushort componentType) { builder.AddUshort(1, componentType, 0); }
  public static void AddComponentIndex(FlatBufferBuilder builder, ushort componentIndex) { builder.AddUshort(2, componentIndex, 0); }
  public static Offset<bimrepo.ComponentIdentifier> EndComponentIdentifier(FlatBufferBuilder builder) {
    int o = builder.EndTable();
    return new Offset<bimrepo.ComponentIdentifier>(o);
  }
  public ComponentIdentifierT UnPack() {
    var _o = new ComponentIdentifierT();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(ComponentIdentifierT _o) {
    _o.Entity = this.Entity.HasValue ? this.Entity.Value.UnPack() : null;
    _o.ComponentType = this.ComponentType;
    _o.ComponentIndex = this.ComponentIndex;
  }
  public static Offset<bimrepo.ComponentIdentifier> Pack(FlatBufferBuilder builder, ComponentIdentifierT _o) {
    if (_o == null) return default(Offset<bimrepo.ComponentIdentifier>);
    return CreateComponentIdentifier(
      builder,
      _o.Entity,
      _o.ComponentType,
      _o.ComponentIndex);
  }
}

public class ComponentIdentifierT
{
  public bimrepo.uuidv4T Entity { get; set; }
  public ushort ComponentType { get; set; }
  public ushort ComponentIndex { get; set; }

  public ComponentIdentifierT() {
    this.Entity = new bimrepo.uuidv4T();
    this.ComponentType = 0;
    this.ComponentIndex = 0;
  }
}


static public class ComponentIdentifierVerify
{
  static public bool Verify(Google.FlatBuffers.Verifier verifier, uint tablePos)
  {
    return verifier.VerifyTableStart(tablePos)
      && verifier.VerifyField(tablePos, 4 /*Entity*/, 16 /*bimrepo.uuidv4*/, 1, false)
      && verifier.VerifyField(tablePos, 6 /*ComponentType*/, 2 /*ushort*/, 2, false)
      && verifier.VerifyField(tablePos, 8 /*ComponentIndex*/, 2 /*ushort*/, 2, false)
      && verifier.VerifyTableEnd(tablePos);
  }
}

}