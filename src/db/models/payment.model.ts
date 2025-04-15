// Imports
import { Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop()
  amount: string;

  @Prop()
  rideId: string;

  @Prop()
  riderId: string;

  @Prop()
  driverId: string;

  @Prop()
  paymentId: string;

  @Prop()
  paidId: string;

  @Prop({ default: false })
  paymentStatus: boolean;

  @Prop()
  dateTime: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
