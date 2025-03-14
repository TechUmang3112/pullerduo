// Imports
import { Document } from 'mongoose';
import { DataType } from 'sequelize-typescript';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  otp: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({
    comment: '-1 -> Not selected, 0 -> Passenger, 1 -> Driver',
    default: -1,
    type: DataType.SMALLINT,
  })
  type: number;

  @Prop({ default: false })
  isDriverLicenceApproved: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
