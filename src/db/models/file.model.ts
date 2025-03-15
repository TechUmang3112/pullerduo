// Imports
import { Document } from 'mongoose';
import { DataType } from 'sequelize-typescript';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type FileDocDocument = FileDoc & Document;

@Schema()
export class FileDoc {
  @Prop()
  userId: string;

  @Prop()
  content: string;

  @Prop({
    comment: '0 -> Aadhaar Card, 1 -> Driving license',
    type: DataType.SMALLINT,
  })
  type: number;
}

export const FileDocSchema = SchemaFactory.createForClass(FileDoc);
