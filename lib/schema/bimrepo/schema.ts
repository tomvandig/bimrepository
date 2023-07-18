// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { shape, shapeT } from '../bimrepo/shape.js';


export class Schema implements flatbuffers.IUnpackableObject<SchemaT> {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Schema {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsSchema(bb:flatbuffers.ByteBuffer, obj?:Schema):Schema {
  return (obj || new Schema()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsSchema(bb:flatbuffers.ByteBuffer, obj?:Schema):Schema {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Schema()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

id(index: number):string
id(index: number,optionalEncoding:flatbuffers.Encoding):string|Uint8Array
id(index: number,optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb!.__vector(this.bb_pos + offset) + index * 4, optionalEncoding) : null;
}

idLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

referenceId():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readUint16(this.bb_pos + offset) : 0;
}

hash():string|null
hash(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
hash(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

schemaversion():string|null
schemaversion(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
schemaversion(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

comment():string|null
comment(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
comment(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

description():string|null
description(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
description(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

schemaShape(obj?:shape):shape|null {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? (obj || new shape()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

static startSchema(builder:flatbuffers.Builder) {
  builder.startObject(7);
}

static addId(builder:flatbuffers.Builder, idOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, idOffset, 0);
}

static createIdVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startIdVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addReferenceId(builder:flatbuffers.Builder, referenceId:number) {
  builder.addFieldInt16(1, referenceId, 0);
}

static addHash(builder:flatbuffers.Builder, hashOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, hashOffset, 0);
}

static addSchemaversion(builder:flatbuffers.Builder, schemaversionOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, schemaversionOffset, 0);
}

static addComment(builder:flatbuffers.Builder, commentOffset:flatbuffers.Offset) {
  builder.addFieldOffset(4, commentOffset, 0);
}

static addDescription(builder:flatbuffers.Builder, descriptionOffset:flatbuffers.Offset) {
  builder.addFieldOffset(5, descriptionOffset, 0);
}

static addSchemaShape(builder:flatbuffers.Builder, schemaShapeOffset:flatbuffers.Offset) {
  builder.addFieldOffset(6, schemaShapeOffset, 0);
}

static endSchema(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static finishSchemaBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedSchemaBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}


unpack(): SchemaT {
  return new SchemaT(
    this.bb!.createScalarList<string>(this.id.bind(this), this.idLength()),
    this.referenceId(),
    this.hash(),
    this.schemaversion(),
    this.comment(),
    this.description(),
    (this.schemaShape() !== null ? this.schemaShape()!.unpack() : null)
  );
}


unpackTo(_o: SchemaT): void {
  _o.id = this.bb!.createScalarList<string>(this.id.bind(this), this.idLength());
  _o.referenceId = this.referenceId();
  _o.hash = this.hash();
  _o.schemaversion = this.schemaversion();
  _o.comment = this.comment();
  _o.description = this.description();
  _o.schemaShape = (this.schemaShape() !== null ? this.schemaShape()!.unpack() : null);
}
}

export class SchemaT implements flatbuffers.IGeneratedObject {
constructor(
  public id: (string)[] = [],
  public referenceId: number = 0,
  public hash: string|Uint8Array|null = null,
  public schemaversion: string|Uint8Array|null = null,
  public comment: string|Uint8Array|null = null,
  public description: string|Uint8Array|null = null,
  public schemaShape: shapeT|null = null
){}


pack(builder:flatbuffers.Builder): flatbuffers.Offset {
  const id = Schema.createIdVector(builder, builder.createObjectOffsetList(this.id));
  const hash = (this.hash !== null ? builder.createString(this.hash!) : 0);
  const schemaversion = (this.schemaversion !== null ? builder.createString(this.schemaversion!) : 0);
  const comment = (this.comment !== null ? builder.createString(this.comment!) : 0);
  const description = (this.description !== null ? builder.createString(this.description!) : 0);
  const schemaShape = (this.schemaShape !== null ? this.schemaShape!.pack(builder) : 0);

  Schema.startSchema(builder);
  Schema.addId(builder, id);
  Schema.addReferenceId(builder, this.referenceId);
  Schema.addHash(builder, hash);
  Schema.addSchemaversion(builder, schemaversion);
  Schema.addComment(builder, comment);
  Schema.addDescription(builder, description);
  Schema.addSchemaShape(builder, schemaShape);

  return Schema.endSchema(builder);
}
}
