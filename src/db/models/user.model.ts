// Imports
import { Document } from 'mongoose';
import { DataType } from 'sequelize-typescript';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ comment: '0 -> Male, 1 -> Female' })
  gender: number;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  otp: string;

  @Prop()
  dob: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({
    comment: '-1 -> Not selected, 0 -> Passenger, 1 -> Driver',
    default: -1,
    type: DataType.SMALLINT,
  })
  type: number;

  @Prop({ default: false })
  isAadhaarApproved: boolean;

  @Prop({ default: false })
  isDriverLicenceApproved: boolean;

  @Prop()
  fileDocId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
