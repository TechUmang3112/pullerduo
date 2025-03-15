// Imports
import { Document } from 'mongoose';
import { DataType } from 'sequelize-typescript';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type GoogleMeasureDocument = GoogleMeasure & Document;

@Schema()
export class GoogleMeasure {
  @Prop()
  uniqueStr: string;

  @Prop({ type: DataType.JSONB })
  response: any;
}

export const GoogleMeasureSchema = SchemaFactory.createForClass(GoogleMeasure);
