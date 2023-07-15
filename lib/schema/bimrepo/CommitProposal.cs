// <auto-generated>
//  automatically generated by the FlatBuffers compiler, do not modify
// </auto-generated>

namespace bimrepo
{

using global::System;
using global::System.Collections.Generic;
using global::Google.FlatBuffers;

public struct CommitProposal : IFlatbufferObject
{
  private Table __p;
  public ByteBuffer ByteBuffer { get { return __p.bb; } }
  public static void ValidateVersion() { FlatBufferConstants.FLATBUFFERS_23_5_26(); }
  public static CommitProposal GetRootAsCommitProposal(ByteBuffer _bb) { return GetRootAsCommitProposal(_bb, new CommitProposal()); }
  public static CommitProposal GetRootAsCommitProposal(ByteBuffer _bb, CommitProposal obj) { return (obj.__assign(_bb.GetInt(_bb.Position) + _bb.Position, _bb)); }
  public static bool VerifyCommitProposal(ByteBuffer _bb) {Google.FlatBuffers.Verifier verifier = new Google.FlatBuffers.Verifier(_bb); return verifier.VerifyBuffer("", false, CommitProposalVerify.Verify); }
  public void __init(int _i, ByteBuffer _bb) { __p = new Table(_i, _bb); }
  public CommitProposal __assign(int _i, ByteBuffer _bb) { __init(_i, _bb); return this; }

  public string Author { get { int o = __p.__offset(4); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetAuthorBytes() { return __p.__vector_as_span<byte>(4, 1); }
#else
  public ArraySegment<byte>? GetAuthorBytes() { return __p.__vector_as_arraysegment(4); }
#endif
  public byte[] GetAuthorArray() { return __p.__vector_as_array<byte>(4); }
  public string Message { get { int o = __p.__offset(6); return o != 0 ? __p.__string(o + __p.bb_pos) : null; } }
#if ENABLE_SPAN_T
  public Span<byte> GetMessageBytes() { return __p.__vector_as_span<byte>(6, 1); }
#else
  public ArraySegment<byte>? GetMessageBytes() { return __p.__vector_as_arraysegment(6); }
#endif
  public byte[] GetMessageArray() { return __p.__vector_as_array<byte>(6); }
  public bimrepo.CommitDiff? Diff { get { int o = __p.__offset(8); return o != 0 ? (bimrepo.CommitDiff?)(new bimrepo.CommitDiff()).__assign(__p.__indirect(o + __p.bb_pos), __p.bb) : null; } }

  public static Offset<bimrepo.CommitProposal> CreateCommitProposal(FlatBufferBuilder builder,
      StringOffset authorOffset = default(StringOffset),
      StringOffset messageOffset = default(StringOffset),
      Offset<bimrepo.CommitDiff> diffOffset = default(Offset<bimrepo.CommitDiff>)) {
    builder.StartTable(3);
    CommitProposal.AddDiff(builder, diffOffset);
    CommitProposal.AddMessage(builder, messageOffset);
    CommitProposal.AddAuthor(builder, authorOffset);
    return CommitProposal.EndCommitProposal(builder);
  }

  public static void StartCommitProposal(FlatBufferBuilder builder) { builder.StartTable(3); }
  public static void AddAuthor(FlatBufferBuilder builder, StringOffset authorOffset) { builder.AddOffset(0, authorOffset.Value, 0); }
  public static void AddMessage(FlatBufferBuilder builder, StringOffset messageOffset) { builder.AddOffset(1, messageOffset.Value, 0); }
  public static void AddDiff(FlatBufferBuilder builder, Offset<bimrepo.CommitDiff> diffOffset) { builder.AddOffset(2, diffOffset.Value, 0); }
  public static Offset<bimrepo.CommitProposal> EndCommitProposal(FlatBufferBuilder builder) {
    int o = builder.EndTable();
    return new Offset<bimrepo.CommitProposal>(o);
  }
  public static void FinishCommitProposalBuffer(FlatBufferBuilder builder, Offset<bimrepo.CommitProposal> offset) { builder.Finish(offset.Value); }
  public static void FinishSizePrefixedCommitProposalBuffer(FlatBufferBuilder builder, Offset<bimrepo.CommitProposal> offset) { builder.FinishSizePrefixed(offset.Value); }
  public CommitProposalT UnPack() {
    var _o = new CommitProposalT();
    this.UnPackTo(_o);
    return _o;
  }
  public void UnPackTo(CommitProposalT _o) {
    _o.Author = this.Author;
    _o.Message = this.Message;
    _o.Diff = this.Diff.HasValue ? this.Diff.Value.UnPack() : null;
  }
  public static Offset<bimrepo.CommitProposal> Pack(FlatBufferBuilder builder, CommitProposalT _o) {
    if (_o == null) return default(Offset<bimrepo.CommitProposal>);
    var _author = _o.Author == null ? default(StringOffset) : builder.CreateString(_o.Author);
    var _message = _o.Message == null ? default(StringOffset) : builder.CreateString(_o.Message);
    var _diff = _o.Diff == null ? default(Offset<bimrepo.CommitDiff>) : bimrepo.CommitDiff.Pack(builder, _o.Diff);
    return CreateCommitProposal(
      builder,
      _author,
      _message,
      _diff);
  }
}

public class CommitProposalT
{
  public string Author { get; set; }
  public string Message { get; set; }
  public bimrepo.CommitDiffT Diff { get; set; }

  public CommitProposalT() {
    this.Author = null;
    this.Message = null;
    this.Diff = null;
  }
  public static CommitProposalT DeserializeFromBinary(byte[] fbBuffer) {
    return CommitProposal.GetRootAsCommitProposal(new ByteBuffer(fbBuffer)).UnPack();
  }
  public byte[] SerializeToBinary() {
    var fbb = new FlatBufferBuilder(0x10000);
    CommitProposal.FinishCommitProposalBuffer(fbb, CommitProposal.Pack(fbb, this));
    return fbb.DataBuffer.ToSizedArray();
  }
}


static public class CommitProposalVerify
{
  static public bool Verify(Google.FlatBuffers.Verifier verifier, uint tablePos)
  {
    return verifier.VerifyTableStart(tablePos)
      && verifier.VerifyString(tablePos, 4 /*Author*/, false)
      && verifier.VerifyString(tablePos, 6 /*Message*/, false)
      && verifier.VerifyTable(tablePos, 8 /*Diff*/, bimrepo.CommitDiffVerify.Verify, false)
      && verifier.VerifyTableEnd(tablePos);
  }
}

}