// automatically generated by the FlatBuffers compiler, do not modify

import { ComponentDataType } from '../bimrepo/component-data-type.js';
import { ComponentIdentifier, ComponentIdentifierT } from '../bimrepo/component-identifier.js';


export class ComponentData implements flatbuffers.IUnpackableObject<ComponentDataT> {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):ComponentData {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsComponentData(bb:flatbuffers.ByteBuffer, obj?:ComponentData):ComponentData {
  return (obj || new ComponentData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsComponentData(bb:flatbuffers.ByteBuffer, obj?:ComponentData):ComponentData {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new ComponentData()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

type():ComponentDataType {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readInt8(this.bb_pos + offset) : ComponentDataType.Int32;
}

arrayLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readInt32(this.bb_pos + offset) : 0;
}

blob(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

blobLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

blobArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

uint8():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : 0;
}

uint16():number {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.readUint16(this.bb_pos + offset) : 0;
}

uint32():number {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.readUint32(this.bb_pos + offset) : 0;
}

uint64():bigint {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.readUint64(this.bb_pos + offset) : BigInt('0');
}

int8():number {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.readInt8(this.bb_pos + offset) : 0;
}

int16():number {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.readInt16(this.bb_pos + offset) : 0;
}

int32():number {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? this.bb!.readInt32(this.bb_pos + offset) : 0;
}

int64():bigint {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? this.bb!.readInt64(this.bb_pos + offset) : BigInt('0');
}

float32():number {
  const offset = this.bb!.__offset(this.bb_pos, 26);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

float64():number {
  const offset = this.bb!.__offset(this.bb_pos, 28);
  return offset ? this.bb!.readFloat64(this.bb_pos + offset) : 0.0;
}

str():string|null
str(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
str(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 30);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

boolean():boolean {
  const offset = this.bb!.__offset(this.bb_pos, 32);
  return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false;
}

ref(obj?:ComponentIdentifier):ComponentIdentifier|null {
  const offset = this.bb!.__offset(this.bb_pos, 34);
  return offset ? (obj || new ComponentIdentifier()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

static startComponentData(builder:flatbuffers.Builder) {
  builder.startObject(16);
}

static addType(builder:flatbuffers.Builder, type:ComponentDataType) {
  builder.addFieldInt8(0, type, ComponentDataType.Int32);
}

static addArrayLength(builder:flatbuffers.Builder, arrayLength:number) {
  builder.addFieldInt32(1, arrayLength, 0);
}

static addBlob(builder:flatbuffers.Builder, blobOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, blobOffset, 0);
}

static createBlobVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startBlobVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addUint8(builder:flatbuffers.Builder, uint8:number) {
  builder.addFieldInt8(3, uint8, 0);
}

static addUint16(builder:flatbuffers.Builder, uint16:number) {
  builder.addFieldInt16(4, uint16, 0);
}

static addUint32(builder:flatbuffers.Builder, uint32:number) {
  builder.addFieldInt32(5, uint32, 0);
}

static addUint64(builder:flatbuffers.Builder, uint64:bigint) {
  builder.addFieldInt64(6, uint64, BigInt('0'));
}

static addInt8(builder:flatbuffers.Builder, int8:number) {
  builder.addFieldInt8(7, int8, 0);
}

static addInt16(builder:flatbuffers.Builder, int16:number) {
  builder.addFieldInt16(8, int16, 0);
}

static addInt32(builder:flatbuffers.Builder, int32:number) {
  builder.addFieldInt32(9, int32, 0);
}

static addInt64(builder:flatbuffers.Builder, int64:bigint) {
  builder.addFieldInt64(10, int64, BigInt('0'));
}

static addFloat32(builder:flatbuffers.Builder, float32:number) {
  builder.addFieldFloat32(11, float32, 0.0);
}

static addFloat64(builder:flatbuffers.Builder, float64:number) {
  builder.addFieldFloat64(12, float64, 0.0);
}

static addStr(builder:flatbuffers.Builder, strOffset:flatbuffers.Offset) {
  builder.addFieldOffset(13, strOffset, 0);
}

static addBoolean(builder:flatbuffers.Builder, boolean:boolean) {
  builder.addFieldInt8(14, +boolean, +false);
}

static addRef(builder:flatbuffers.Builder, refOffset:flatbuffers.Offset) {
  builder.addFieldOffset(15, refOffset, 0);
}

static endComponentData(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}


unpack(): ComponentDataT {
  return new ComponentDataT(
    this.type(),
    this.arrayLength(),
    this.bb!.createScalarList<number>(this.blob.bind(this), this.blobLength()),
    this.uint8(),
    this.uint16(),
    this.uint32(),
    this.uint64(),
    this.int8(),
    this.int16(),
    this.int32(),
    this.int64(),
    this.float32(),
    this.float64(),
    this.str(),
    this.boolean(),
    (this.ref() !== null ? this.ref()!.unpack() : null)
  );
}


unpackTo(_o: ComponentDataT): void {
  _o.type = this.type();
  _o.arrayLength = this.arrayLength();
  _o.blob = this.bb!.createScalarList<number>(this.blob.bind(this), this.blobLength());
  _o.uint8 = this.uint8();
  _o.uint16 = this.uint16();
  _o.uint32 = this.uint32();
  _o.uint64 = this.uint64();
  _o.int8 = this.int8();
  _o.int16 = this.int16();
  _o.int32 = this.int32();
  _o.int64 = this.int64();
  _o.float32 = this.float32();
  _o.float64 = this.float64();
  _o.str = this.str();
  _o.boolean = this.boolean();
  _o.ref = (this.ref() !== null ? this.ref()!.unpack() : null);
}
}

export class ComponentDataT implements flatbuffers.IGeneratedObject {
constructor(
  public type: ComponentDataType = ComponentDataType.Int32,
  public arrayLength: number = 0,
  public blob: (number)[] = [],
  public uint8: number = 0,
  public uint16: number = 0,
  public uint32: number = 0,
  public uint64: bigint = BigInt('0'),
  public int8: number = 0,
  public int16: number = 0,
  public int32: number = 0,
  public int64: bigint = BigInt('0'),
  public float32: number = 0.0,
  public float64: number = 0.0,
  public str: string|Uint8Array|null = null,
  public boolean: boolean = false,
  public ref: ComponentIdentifierT|null = null
){}


pack(builder:flatbuffers.Builder): flatbuffers.Offset {
  const blob = ComponentData.createBlobVector(builder, this.blob);
  const str = (this.str !== null ? builder.createString(this.str!) : 0);
  const ref = (this.ref !== null ? this.ref!.pack(builder) : 0);

  ComponentData.startComponentData(builder);
  ComponentData.addType(builder, this.type);
  ComponentData.addArrayLength(builder, this.arrayLength);
  ComponentData.addBlob(builder, blob);
  ComponentData.addUint8(builder, this.uint8);
  ComponentData.addUint16(builder, this.uint16);
  ComponentData.addUint32(builder, this.uint32);
  ComponentData.addUint64(builder, this.uint64);
  ComponentData.addInt8(builder, this.int8);
  ComponentData.addInt16(builder, this.int16);
  ComponentData.addInt32(builder, this.int32);
  ComponentData.addInt64(builder, this.int64);
  ComponentData.addFloat32(builder, this.float32);
  ComponentData.addFloat64(builder, this.float64);
  ComponentData.addStr(builder, str);
  ComponentData.addBoolean(builder, this.boolean);
  ComponentData.addRef(builder, ref);

  return ComponentData.endComponentData(builder);
}
}
