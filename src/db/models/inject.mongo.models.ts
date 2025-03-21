// Imports
import { User, UserSchema } from './user.model';
import { Ride, RideSchema } from './ride.model';
import { MongooseModule } from '@nestjs/mongoose';
import { FileDoc, FileDocSchema } from './file.model';
import { GooglePlaces, GooglePlacesSchema } from './google.places.model';
import { GoogleMeasure, GoogleMeasureSchema } from './google.measure.model';

export const mongoModels = [
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: FileDoc.name, schema: FileDocSchema }]),
  MongooseModule.forFeature([
    { name: GooglePlaces.name, schema: GooglePlacesSchema },
  ]),
  MongooseModule.forFeature([
    { name: GoogleMeasure.name, schema: GoogleMeasureSchema },
  ]),

  MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]),
];
