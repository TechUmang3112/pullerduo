// Imports
import { MongoService } from 'src/db/mongo';
import { HTTPError } from 'src/configs/error';
import { HttpStatus, Injectable } from '@nestjs/common';
import { GoogleService } from 'src/thirdParty/google/google.service';

@Injectable()
export class DriverService {
  constructor(
    private readonly mongo: MongoService,
    private readonly google: GoogleService,
  ) {}

  async offerRide(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    let rideTime: Date = reqData.rideTime;
    if (!rideTime) {
      throw HTTPError({ parameter: 'rideTime' });
    }
    rideTime = new Date(rideTime);
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
    const startLat = reqData.startLat;
    if (!startLat) {
      throw HTTPError({ parameter: 'startLat' });
    }
    const startLong = reqData.startLong;
    if (!startLong) {
      throw HTTPError({ parameter: 'startLong' });
    }
    const endLat = reqData.endLat;
    if (!endLat) {
      throw HTTPError({ parameter: 'endLat' });
    }
    const endLong = reqData.endLong;
    if (!endLong) {
      throw HTTPError({ parameter: 'endLong' });
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

    const measureData = await this.google.measureDistance({
      latC: startLat,
      longC: startLong,
      latD: endLat,
      longD: endLong,
    });
    if (measureData.distanceInKm > 100) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Maximum kilometers allowed is 100',
      });
    } else if (measureData.durationInMinutes > 240) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Maximum hours allowed is 4, Trip is too long',
      });
    }

    const rideEndTime = new Date(rideTime);
    rideEndTime.setMinutes(
      rideEndTime.getMinutes() + measureData.durationInMinutes,
    );

    // Check conflict
    let conflictedData = await this.mongo.findOne('Ride', {
      driverId: userId,
      rideEndTime: { $lte: rideEndTime, $gte: rideTime },
      status: -1,
    });
    if (conflictedData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `You already have an active ride from ${conflictedData.startPlace} to ${conflictedData.endPlace}`,
      });
    } else {
      conflictedData = await this.mongo.findOne('Ride', {
        driverId: userId,
        rideTime: { $gte: rideTime, $lte: rideEndTime },
        status: -1,
      });
    }
    if (conflictedData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `You already have an active ride from ${conflictedData.startPlace} to ${conflictedData.endPlace}`,
      });
    }

    const creationData = {
      driverId: userId,
      rideTime,
      rideEndTime,
      totalPassengersAvailable,
      amountPerRider,
      startPlace,
      endPlace,
      startLat,
      startLong,
      endLat,
      endLong,
      timeInMinutes: measureData.durationInMinutes,
      distanceInKm: measureData.distanceInKm,
      status: -1,
      paymentStatus: false,
      total_payment: amountPerRider * totalPassengersAvailable,
    };
    await this.mongo.insert('Ride', creationData);

    return {};
  }

  async cancelRide(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const rideId = reqData.rideId;
    if (rideId.length != 24) {
      throw HTTPError({ value: 'rideId' });
    }
    if (!rideId) {
      throw HTTPError({ parameter: 'rideId' });
    }

    const userData = await this.mongo.findOne('User', { _id: userId });
    if (!userData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User not found',
      });
    }

    const rideData = await this.mongo.findOne('Ride', { _id: rideId });
    if (!rideData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Ride not found',
      });
    }
    if (rideData.driverId != userId) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Ride is not associated with you.',
      });
    }
    if (rideData.status != -1) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'You can not reject ride at this point !',
      });
    }

    await this.mongo.updateOne('Ride', { _id: rideId }, { status: 3 });

    return { message: 'Ride is cancelled successfully !' };
  }

  async myRides(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const page = reqData.page;
    if (!page) {
      throw HTTPError({ parameter: 'page' });
    }
    const pageSize = reqData.pageSize;
    if (!pageSize) {
      throw HTTPError({ parameter: 'pageSize' });
    }
    const skip = (+page - 1) * +pageSize;
    const options = { limit: +pageSize, skip };

    const attributes = [
      '_id',
      'rideTime',
      'rideEndTime',
      'amountPerRider',
      'startPlace',
      'endPlace',
      'timeInMinutes',
      'distanceInKm',
      'status',
    ];
    const rideList = await this.mongo.findAll(
      'Ride',
      { driverId: userId },
      attributes,
      options,
    );

    const count = await this.mongo.count('Ride', { driverId: userId });

    return { count, rows: rideList };
  }
}
