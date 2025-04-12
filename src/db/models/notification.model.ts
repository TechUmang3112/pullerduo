// Imports
import { Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop()
  content: string;

  @Prop()
  userId: string;

  @Prop()
  dateTime: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
