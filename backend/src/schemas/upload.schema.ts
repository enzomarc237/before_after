import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema()
export class ImageMetadata {
  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  format: string;
}

const ImageMetadataSchema = SchemaFactory.createForClass(ImageMetadata);

@Schema({ timestamps: true })
export class Upload {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: ['image', 'code'] })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ enum: ['current', 'target'] })
  imageType?: string;

  @Prop()
  language?: string;

  @Prop({ type: ImageMetadataSchema })
  metadata?: ImageMetadata;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);