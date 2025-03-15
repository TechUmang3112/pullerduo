// Imports
import { MongoService } from 'src/db/mongo';
import { HTTPError } from 'src/configs/error';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class DriverService {
  constructor(private readonly mongo: MongoService) {}

  async offerRide(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const rideTime = reqData.rideTime;
    if (!rideTime) {
      throw HTTPError({ parameter: 'rideTime' });
    }
    const totalPassengersAvailable = reqData.totalPassengersAvailable;
    if (!totalPassengersAvailable) {
      throw HTTPError({ parameter: 'totalPassengersAvailable' });
    }
    const amountPerRider = reqData.amountPerRider;
    if (!amountPerRider) {
      throw HTTPError({ parameter: 'amountPerRider' });
    }
    if (amountPerRider <= 0) {
      throw HTTPError({ value: 'amountPerRider' });
    }
    if (amountPerRider > 10000) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Cost per passanger can not be more than 10,000 Rs.',
      });
    }
    const startPlace = reqData.startPlace;
    if (!startPlace) {
      throw HTTPError({ parameter: 'startPlace' });
    }
    const endPlace = reqData.endPlace;
    if (!endPlace) {
      throw HTTPError({ parameter: 'endPlace' });
    }

    const userData = await this.mongo.findOne('User', { _id: userId });
    if (!userData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User not found',
      });
    }
    if (!userData.fileDocId || !userData.isDriverLicenceApproved) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Driver licence apporval is pending',
      });
    }
    console.log({ userData });

    return {};
  }
}
