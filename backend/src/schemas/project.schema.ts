import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class TechStack {
  @Prop({ required: true })
  framework: string;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true, enum: ['web', 'mobile', 'desktop'] })
  platform: string;

  @Prop({ default: false })
  autoDetected: boolean;

  @Prop()
  confidence?: number;
}

const TechStackSchema = SchemaFactory.createForClass(TechStack);

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: TechStackSchema })
  techStack?: TechStack;

  @Prop({ default: 'active', enum: ['active', 'completed', 'archived'] })
  status: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// Transform _id to id and remove __v
ProjectSchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

ProjectSchema.set('toObject', {
  transform: function(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});