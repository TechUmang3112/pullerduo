// Imports
import { MongoService } from 'src/db/mongo';
import { FileService } from 'src/utils/file.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { HTTPError, raiseNotFound } from 'src/configs/error';

@Injectable()
export class UserService {
  constructor(
    private readonly fileService: FileService,
    private readonly mongo: MongoService,
  ) {}

  async profile(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }

    const userData = await this.mongo.findOne('User', { _id: userId });
    if (!userData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User data not found',
      });
    }

    let isDocVerificationPending = false;
    if (userData.type != -1 && userData.type != '2') {
      if (
        userData.isAadhaarApproved == false &&
        userData.isDriverLicenceApproved == false
      ) {
        isDocVerificationPending = true;
      }
    }

    return {
      gender: userData.gender,
      dob: userData.dob,
      email: userData.email,
      name: userData.name,
      type: userData.type,
      isDocVerificationPending,
      isAadhaarApproved: userData.isAadhaarApproved,
      isDriverLicenceApproved: userData.isDriverLicenceApproved,
    };
  }

  async updateProfile(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const name = reqData.name;
    if (!name) {
      throw HTTPError({ parameter: 'name' });
    }
    const type = reqData.type;
    if (type == null || type == undefined) {
      throw HTTPError({ parameter: 'type' });
    }
    if (type != '0' && type != '1') {
      throw HTTPError({ value: 'type' });
    }
    const gender = reqData.gender;
    if (gender == null || type == undefined) {
      throw HTTPError({ parameter: 'gender' });
    }
    if (gender != '1' && gender != '0') {
      throw HTTPError({ value: 'gender' });
    }
    const dob = reqData.dob;
    if (!dob) {
      throw HTTPError({ parameter: 'dob' });
    }

    const userData = await this.mongo.findOne('User', { _id: userId });
    if (!userData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User data not found',
      });
    }

    const file = reqData.file;
    const filename = file.filename;
    const base64Str = await this.fileService.filePathToBase64(filename);

    const createdData = await this.mongo.insert('FileDoc', {
      content: base64Str,
      type,
      userId: userData._id,
    });
    const fileDocId = createdData._id;

    await this.mongo.updateOne(
      'User',
      { _id: userId },
      { dob, gender, fileDocId, name, type },
    );

    return {};
  }

  async totalrides(reqData) {
    const totalrides = reqData.totalrides;
    if (!totalrides) {
      throw HTTPError({ parameter: 'Totalrides' });
    }
    return {};
  }

  async upcomingrides(reqData) {
    const upcomingrides = reqData.upcomingride;
    if (!upcomingrides) {
      throw HTTPError({ parameter: 'upcomingrides' });
    }
    return {};
  }

  async currentride(reqData) {
    const currentride = reqData.currentride;
    if (!currentride) {
      throw HTTPError({ parameter: 'currentride' });
    }
    return {};
  }

  async completedrides(reqData) {
    const completedrides = reqData.completedrides;
    if (!completedrides) {
      throw HTTPError({ parameter: 'completedridess' });
    }
    return {};
  }

  async getRideCounts(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }

    const existingData = await this.mongo.findOne('User', { _id: userId });
    if (!existingData) {
      raiseNotFound('User Data');
    }

    const isDriver = existingData.type == '1';
    const options: any = {};
    if (isDriver) {
      options.driverId = userId;
    } else {
      options.riderId = userId;
    }
    const allRideList = await this.mongo.findAll('Ride', options, ['status']);

    let total = 0;
    let current = 0;
    let upcoming = 0;
    let completed = 0;

    allRideList.forEach((el) => {
      total++;

      if (el.status == -1 || el.status == -2) {
        upcoming++;
      }

      if (el.status == 0) {
        current++;
      }

      if (el.status == 5) {
        completed++;
      }
    });

    return { count: { total, current, upcoming, completed } };
  }

  async upcomingRideList(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }

    const existingData = await this.mongo.findOne('User', { _id: userId });
    if (!existingData) {
      raiseNotFound('User Data');
    }

    const isDriver = existingData.type == '1';
    const options: any = { status: { $in: ['-1', '-2'] } };
    if (isDriver) {
      options.driverId = userId;
    } else {
      options.riderId = userId;
    }
    const allRideList = await this.mongo.findAll('Ride', options, [
      'startPlace',
      'endPlace',
      'rideTime',
      'total_payment',
    ]);

    allRideList.sort((b, a) => a.rideTime.getTime() - b.rideTime.getTime());

    return { list: allRideList };
  }

  async allRidesList(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }

    const existingData = await this.mongo.findOne('User', { _id: userId });
    if (!existingData) {
      raiseNotFound('User Data');
    }

    const isDriver = existingData.type == '1';
    const options: any = { status: { $in: ['-1', '-2'] } };
    if (isDriver) {
      options.driverId = userId;
    } else {
      options.riderId = userId;
    }
    const allRideList = await this.mongo.findAll('Ride', options, [
      'startPlace',
      'endPlace',
      'rideTime',
      'total_payment',
      'status',
    ]);

    allRideList.sort((b, a) => a.rideTime.getTime() - b.rideTime.getTime());

    return { list: allRideList };
  }
}
