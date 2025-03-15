// Imports
import { Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type GooglePlacesDocument = GooglePlaces & Document;

@Schema()
export class GooglePlaces {
  @Prop()
  searchText: string;

  @Prop()
  response: any[];
}

export const GooglePlacesSchema = SchemaFactory.createForClass(GooglePlaces);
