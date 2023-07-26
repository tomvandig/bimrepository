// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

namespace bimrepo
{

using global::System;
using global::System.Collections.Generic;
using global::Google.FlatBuffers;

public struct Schema : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static void ValidateVersion() { FlatBufferConstants.FLATBUFFERS_23_5_26(); }
  public static Schema GetRootAsSchema(ByteBuffer _bb) { return GetRootAsSchema(_bb, new Schema()); }
  public static Schema GetRootAsSchema(ByteBuffer _bb, Schema obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public static bool VerifySchema(ByteBuffer _bb) {Google.FlatBuffers.Verifier verifier = new Google.FlatBuffers.Verifier(_bb); return verifier.VerifyBuffer("", false, SchemaVerify.Verify); }
  public void __init(int _i, ByteBuffer _bb) { __p = new Table(_i, _bb); }
  public Schema __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public string Id(int j) { int o = __p.__offset(4); return o != 0 ? __p.__string(__p.__vector(o) + j * 4) : null; }
  public int IdLength { get { int o = __p.__offset(4); return o != 0 ? __p.__vector_len(o) : 0; } }
  public string Hash { get { int o = __p.__offset(6); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetHashBytes() { return __p.__vector_as_span<byte>(6, 1); }
#else
  public ArraySegment<byte>? GetHashBytes() { return __p.__vector_as_arraysegment(6); }
#endif
  public byte[] GetHashArray() { return __p.__vector_as_array<byte>(6); }
  public string Schemaversion { get { int o = __p.__offset(8); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetSchemaversionBytes() { return __p.__vector_as_span<byte>(8, 1); }
#else
  public ArraySegment<byte>? GetSchemaversionBytes() { return __p.__vector_as_arraysegment(8); }
#endif
  public byte[] GetSchemaversionArray() { return __p.__vector_as_array<byte>(8); }
  public string Comment { get { int o = __p.__offset(10); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetCommentBytes() { return __p.__vector_as_span<byte>(10, 1); }
#else
  public ArraySegment<byte>? GetCommentBytes() { return __p.__vector_as_arraysegment(10); }
#endif
  public byte[] GetCommentArray() { return __p.__vector_as_array<byte>(10); }
  public string Description { get { int o = __p.__offset(12); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetDescriptionBytes() { return __p.__vector_as_span<byte>(12, 1); }
#else
  public ArraySegment<byte>? GetDescriptionBytes() { return __p.__vector_as_arraysegment(12); }
#endif
  public byte[] GetDescriptionArray() { return __p.__vector_as_array<byte>(12); }
  public bimrepo.shape? SchemaShape { get { int o = __p.__offset(14); return o != 0 ? (bimrepo.shape?)(new bimrepo.shape()).__assign(__p.__indirect(o + __p.bb_pos), __p.bb) : null; } }

  public static Offset<bimrepo.Schema> CreateSchema(FlatBufferBuilder builder,
      VectorOffset idOffset = default(VectorOffset),
      StringOffset hashOffset = default(StringOffset),
      StringOffset schemaversionOffset = default(StringOffset),
      StringOffset commentOffset = default(StringOffset),
      StringOffset descriptionOffset = default(StringOffset),
      Offset<bimrepo.shape> schema_shapeOffset = default(Offset<bimrepo.shape>)) {
    builder.StartTable(6);
    Schema.AddSchemaShape(builder, schema_shapeOffset);
    Schema.AddDescription(builder, descriptionOffset);
    Schema.AddComment(builder, commentOffset);
    Schema.AddSchemaversion(builder, schemaversionOffset);
    Schema.AddHash(builder, hashOffset);
    Schema.AddId(builder, idOffset);
    return Schema.EndSchema(builder);
  }

  public static void StartSchema(FlatBufferBuilder builder) { builder.StartTable(6); }
  public static void AddId(FlatBufferBuilder builder, VectorOffset idOffset) { builder.AddOffset(0, idOffset.Value, 0); }
  public static VectorOffset CreateIdVector(FlatBufferBuilder builder, StringOffset[] data) { builder.StartVector(4, data.Length, 4); for (int i = data.Length - 1; i >= 0; i--) builder.AddOffset(data[i].Value); return builder.EndVector(); }
  public static VectorOffset CreateIdVectorBlock(FlatBufferBuilder builder, StringOffset[] data) { builder.StartVector(4, data.Length, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreateIdVectorBlock(FlatBufferBuilder builder, ArraySegment<StringOffset> data) { builder.StartVector(4, data.Count, 4); builder.Add(data); return builder.EndVector(); }
  public static VectorOffset CreateIdVectorBlock(FlatBufferBuilder builder, IntPtr dataPtr, int sizeInBytes) { builder.StartVector(1, sizeInBytes, 1); builder.Add<StringOffset>(dataPtr, sizeInBytes); return builder.EndVector(); }
  public static void StartIdVector(FlatBufferBuilder builder, int numElems) { builder.StartVector(4, numElems, 4); }
  public static void AddHash(FlatBufferBuilder builder, StringOffset hashOffset) { builder.AddOffset(1, hashOffset.Value, 0); }
  public static void AddSchemaversion(FlatBufferBuilder builder, StringOffset schemaversionOffset) { builder.AddOffset(2, schemaversionOffset.Value, 0); }
  public static void AddComment(FlatBufferBuilder builder, StringOffset commentOffset) { builder.AddOffset(3, commentOffset.Value, 0); }
  public static void AddDescription(FlatBufferBuilder builder, StringOffset descriptionOffset) { builder.AddOffset(4, descriptionOffset.Value, 0); }
  public static void AddSchemaShape(FlatBufferBuilder builder, Offset<bimrepo.shape> schemaShapeOffset) { builder.AddOffset(5, schemaShapeOffset.Value, 0); }
  public static Offset<bimrepo.Schema> EndSchema(FlatBufferBuilder builder) {
    int o = builder.EndTable();
    return new Offset<bimrepo.Schema>(o);
  }
  public static void FinishSchemaBuffer(FlatBufferBuilder builder, Offset<bimrepo.Schema> offset) { builder.Finish(offset.Value); }
  public static void FinishSizePrefixedSchemaBuffer(FlatBufferBuilder builder, Offset<bimrepo.Schema> offset) { builder.FinishSizePrefixed(offset.Value); }
  public SchemaT UnPack() {
    var _o = new SchemaT();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(SchemaT _o) {
    _o.Id = new List<string>();
    for (var _j = 0; _j < this.IdLength; ++_j) {_o.Id.Add(this.Id(_j));}
    _o.Hash = this.Hash;
    _o.Schemaversion = this.Schemaversion;
    _o.Comment = this.Comment;
    _o.Description = this.Description;
    _o.SchemaShape = this.SchemaShape.HasValue ? this.SchemaShape.Value.UnPack() : null;
  }
  public static Offset<bimrepo.Schema> Pack(FlatBufferBuilder builder, SchemaT _o) {
    if (_o == null) return default(Offset<bimrepo.Schema>);
    var _id = default(VectorOffset);
    if (_o.Id != null) {
      var __id = new StringOffset[_o.Id.Count];
      for (var _j = 0; _j < __id.Length; ++_j) { __id[_j] = builder.CreateString(_o.Id[_j]); }
      _id = CreateIdVector(builder, __id);
    }
    var _hash = _o.Hash == null ? default(StringOffset) : builder.CreateString(_o.Hash);
    var _schemaversion = _o.Schemaversion == null ? default(StringOffset) : builder.CreateString(_o.Schemaversion);
    var _comment = _o.Comment == null ? default(StringOffset) : builder.CreateString(_o.Comment);
    var _description = _o.Description == null ? default(StringOffset) : builder.CreateString(_o.Description);
    var _schema_shape = _o.SchemaShape == null ? default(Offset<bimrepo.shape>) : bimrepo.shape.Pack(builder, _o.SchemaShape);
    return CreateSchema(
      builder,
      _id,
      _hash,
      _schemaversion,
      _comment,
      _description,
      _schema_shape);
  }
}

public class SchemaT
{
  public List<string> Id { get; set; }
  public string Hash { get; set; }
  public string Schemaversion { get; set; }
  public string Comment { get; set; }
  public string Description { get; set; }
  public bimrepo.shapeT SchemaShape { get; set; }

  public SchemaT() {
    this.Id = null;
    this.Hash = null;
    this.Schemaversion = null;
    this.Comment = null;
    this.Description = null;
    this.SchemaShape = null;
  }
  public static SchemaT DeserializeFromBinary(byte[] fbBuffer) {
    return Schema.GetRootAsSchema(new ByteBuffer(fbBuffer)).UnPack();
  }
  public byte[] SerializeToBinary() {
    var fbb = new FlatBufferBuilder(0x10000);
    Schema.FinishSchemaBuffer(fbb, Schema.Pack(fbb, this));
    return fbb.DataBuffer.ToSizedArray();
  }
}


static public class SchemaVerify
{
  static public bool Verify(Google.FlatBuffers.Verifier verifier, uint tablePos)
  {
    return verifier.VerifyTableStart(tablePos)
      && verifier.VerifyVectorOfStrings(tablePos, 4 /*Id*/, false)
      && verifier.VerifyString(tablePos, 6 /*Hash*/, false)
      && verifier.VerifyString(tablePos, 8 /*Schemaversion*/, false)
      && verifier.VerifyString(tablePos, 10 /*Comment*/, false)
      && verifier.VerifyString(tablePos, 12 /*Description*/, false)
      && verifier.VerifyTable(tablePos, 14 /*SchemaShape*/, bimrepo.shapeVerify.Verify, false)
      && verifier.VerifyTableEnd(tablePos);
  }
}

}
