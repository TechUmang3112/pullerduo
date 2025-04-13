// Imports
import { HttpStatusCode } from 'axios';
import { MongoService } from 'src/db/mongo';
import { Injectable } from '@nestjs/common';
import { HTTPError } from 'src/configs/error';

@Injectable()
export class RiderService {
  constructor(private readonly mongo: MongoService) {}

  async findRide(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const startPlace = reqData.startPlace;
    if (!startPlace) {
      throw HTTPError({ parameter: 'startPlace' });
    }
    const endPlace = reqData.endPlace;
    if (!endPlace) {
      throw HTTPError({ parameter: 'endPlace' });
    }
    const rideTime: string = reqData.rideTime;
    if (!rideTime) {
      throw HTTPError({ parameter: 'rideTime' });
    }

    const userData = await this.mongo.findOne('User', { _id: userId });
    if (!userData) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Rider data not found',
      });
    }
    if (!userData.isAadhaarApproved) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Aadhaar verification is pending !',
      });
    }

    const approximate_start_ride_time =
      rideTime.substring(0, 10) + 'T00:00:00.000Z';
    const approximate_end_ride_time =
      rideTime.substring(0, 10) + 'T23:59:59.000Z';

    const rideList = await this.mongo.findAll('Ride', {
      gender: userData.gender,
      status: -1,
      $or: [{ startPlace: startPlace }, { endPlace: endPlace }],
      rideTime: {
        $gte: approximate_start_ride_time,
        $lte: approximate_end_ride_time,
      },
    });

    return { list: rideList };
  }

  async acceptRide(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const rideId = reqData.rideId;
    if (!rideId) {
      throw HTTPError({ parameter: 'rideId' });
    }

    const rideData = await this.mongo.findOne('Ride', { _id: rideId });
    if (!rideData) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'No ride data found',
      });
    }
    if (rideData.status != -1) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Ride is no longer available to accept',
      });
    }

    await this.mongo.updateOne(
      'Ride',
      { _id: rideId },
      { riderId: userId, status: -2 },
    );

    await this.mongo.insert('Notification', {
      dateTime: new Date(),
      userId,
      content: `Your ride from ${rideData.startPlace} to ${rideData.endPlace} has been accepted !`,
    });

    await this.mongo.insert('Notification', {
      dateTime: new Date(),
      userId: rideData.driverId,
      content: `Your ride from ${rideData.startPlace} to ${rideData.endPlace} has been accepted by the rider !`,
    });

    return { success: true, successMsg: 'Ride has been accepted !' };
  }

  async myRides(reqData: { userId: any; page: any; pageSize: any }) {
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
      { riderId: userId },
      attributes,
      options,
    );

    const count = await this.mongo.count('Ride', { riderId: userId });

    return { count, rows: rideList };
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
    if (!rideId) {
      throw HTTPError({ parameter: 'rideId' });
    }

    const rideData = await this.mongo.findOne('Ride', { _id: rideId });
    if (!rideData) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'No ride data found',
      });
    }
    if (rideData.riderId != userId) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Ride is not associated with you',
      });
    }
    if (rideData.status != -2 && rideData.status != 0) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Ride can not be cancelled at this time !',
      });
    }
    const status = rideData.status == -2 ? -1 : 4;
    await this.mongo.updateOne(
      'Ride',
      { _id: rideId },
      { riderId: null, status },
    );

    return { message: 'Ride is cancelled successfully !' };
  }

  async payForRide(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const rideId = reqData.rideId;
    if (!rideId) {
      throw HTTPError({ parameter: 'rideId' });
    }

    const rideData = await this.mongo.findOne('Ride', { _id: rideId });
    if (!rideData) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'No ride data found',
      });
    }
    if (rideData.riderId != userId) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Ride is not associated with you',
      });
    }
    if (rideData.status != 0) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Ride is not started by driver yet !',
      });
    }

    await this.mongo.updateOne(
      'Ride',
      { _id: rideId },
      { paymentStatus: true, status: 5 },
    );

    return { message: 'Payment has been completed !' };
  }

  async rateRide(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const rideId = reqData.rideId;
    if (!rideId) {
      throw HTTPError({ parameter: 'rideId' });
    }
    const rating = reqData.rating;
    if (!rating) {
      throw HTTPError({ parameter: 'rating' });
    }
    if (![1, 2, 3, 4, 5].includes(rating)) {
      throw HTTPError({ value: 'rating' });
    }

    const rideData = await this.mongo.findOne('Ride', { _id: rideId });
    if (!rideData) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'No ride data found',
      });
    }
    if (rideData.riderId != userId) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Ride is not associated with you',
      });
    }

    if (rideData.status != 5 && rideData.status != 4) {
      throw HTTPError({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Ride is not eligible for rating',
      });
    }

    await this.mongo.updateOne('Ride', { _id: rideId }, { rating });

    return { message: 'Rating is done, Thanks !' };
  }
}
