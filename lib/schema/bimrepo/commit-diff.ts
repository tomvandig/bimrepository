// automatically generated by the FlatBuffers compiler, do not modify

import { Component, ComponentT } from '../bimrepo/component.js';
import { Schema, SchemaT } from '../bimrepo/schema.js';


export class CommitDiff implements flatbuffers.IUnpackableObject<CommitDiffT> {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):CommitDiff {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsCommitDiff(bb:flatbuffers.ByteBuffer, obj?:CommitDiff):CommitDiff {
  return (obj || new CommitDiff()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsCommitDiff(bb:flatbuffers.ByteBuffer, obj?:CommitDiff):CommitDiff {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new CommitDiff()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

updatedComponents(index: number, obj?:Component):Component|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new Component()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

updatedComponentsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

updatedSchemas(index: number, obj?:Schema):Schema|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new Schema()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

updatedSchemasLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startCommitDiff(builder:flatbuffers.Builder) {
  builder.startObject(2);
}

static addUpdatedComponents(builder:flatbuffers.Builder, updatedComponentsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, updatedComponentsOffset, 0);
}

static createUpdatedComponentsVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startUpdatedComponentsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addUpdatedSchemas(builder:flatbuffers.Builder, updatedSchemasOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, updatedSchemasOffset, 0);
}

static createUpdatedSchemasVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startUpdatedSchemasVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endCommitDiff(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createCommitDiff(builder:flatbuffers.Builder, updatedComponentsOffset:flatbuffers.Offset, updatedSchemasOffset:flatbuffers.Offset):flatbuffers.Offset {
  CommitDiff.startCommitDiff(builder);
  CommitDiff.addUpdatedComponents(builder, updatedComponentsOffset);
  CommitDiff.addUpdatedSchemas(builder, updatedSchemasOffset);
  return CommitDiff.endCommitDiff(builder);
}

unpack(): CommitDiffT {
  return new CommitDiffT(
    this.bb!.createObjList<Component, ComponentT>(this.updatedComponents.bind(this), this.updatedComponentsLength()),
    this.bb!.createObjList<Schema, SchemaT>(this.updatedSchemas.bind(this), this.updatedSchemasLength())
  );
}


unpackTo(_o: CommitDiffT): void {
  _o.updatedComponents = this.bb!.createObjList<Component, ComponentT>(this.updatedComponents.bind(this), this.updatedComponentsLength());
  _o.updatedSchemas = this.bb!.createObjList<Schema, SchemaT>(this.updatedSchemas.bind(this), this.updatedSchemasLength());
}
}

export class CommitDiffT implements flatbuffers.IGeneratedObject {
constructor(
  public updatedComponents: (ComponentT)[] = [],
  public updatedSchemas: (SchemaT)[] = []
){}


pack(builder:flatbuffers.Builder): flatbuffers.Offset {
  const updatedComponents = CommitDiff.createUpdatedComponentsVector(builder, builder.createObjectOffsetList(this.updatedComponents));
  const updatedSchemas = CommitDiff.createUpdatedSchemasVector(builder, builder.createObjectOffsetList(this.updatedSchemas));

  return CommitDiff.createCommitDiff(builder,
    updatedComponents,
    updatedSchemas
  );
}
}
