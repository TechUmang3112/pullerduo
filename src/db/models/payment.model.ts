// Imports
import { Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop()
  rideId: string;

  @Prop()
  riderId: string;

  @Prop()
  paymentId: string;

  @Prop()
  dateTime: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
