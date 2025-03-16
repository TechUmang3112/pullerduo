// Imports
import { Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type RideDocument = Ride & Document;

@Schema()
export class Ride {
  @Prop()
  driverId: string;

  @Prop()
  riderId: string;

  @Prop({ comment: '0 -> Male, 1 -> Female' })
  gender: number;

  @Prop()
  rideTime: Date;

  @Prop()
  rideEndTime: Date;

  @Prop()
  totalPassengersAvailable: number;

  @Prop()
  amountPerRider: number;

  @Prop()
  startPlace: string;

  @Prop()
  endPlace: string;

  @Prop()
  startLat: number;

  @Prop()
  startLong: number;

  @Prop()
  endLat: number;

  @Prop()
  endLong: number;

  @Prop()
  timeInMinutes: number;

  @Prop()
  distanceInKm: number;

  @Prop({
    comment: `-1 -> Offered by driver, 
      -2 -> Ride accepted by rider,
      0 -> Ride started by driver, 
      1 -> Ride Rejected by admin,
      2 -> Ride Rejected by system due to no passenger available,
      3 -> Ride cancelled by driver,
      4 -> Ride is cancelled by all passengers,
      5 -> Ride is completed`,
    defaultValue: -1,
  })
  status: number;

  @Prop()
  paymentStatus: boolean;

  @Prop()
  total_payment: number;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
