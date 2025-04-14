// Imports
import { Injectable } from '@nestjs/common';
import { HTTPError, raiseNotFound } from 'src/configs/error';
import { MongoService } from 'src/db/mongo';

@Injectable()
export class AdminService {
  constructor(private readonly mongo: MongoService) {}

  async users() {
    const users = await this.mongo.findAll(
      'User',
      {
        type: { $nin: [2] },
      },
      ['name', 'email', 'isAadhaarApproved', 'isDriverLicenceApproved'],
    );

    return { list: users };
  }

  async drivers() {
    const users = await this.mongo.findAll(
      'User',
      {
        type: '1',
      },
      ['name', 'email', 'isDriverLicenceApproved'],
    );

    return { list: users };
  }

  async riders() {
    const users = await this.mongo.findAll(
      'User',
      {
        type: '0',
      },
      ['name', 'email', 'isAadhaarApproved'],
    );

    return { list: users };
  }

  async updateUserStatus(reqData) {
    const userId = reqData.userId;
    if (!userId) {
      throw HTTPError({ parameter: 'userId' });
    }
    if (userId.length != 24) {
      throw HTTPError({ value: 'userId' });
    }
    const isActive = reqData.isActive;

    const existingData = await this.mongo.findOne('User', { _id: userId });
    if (!existingData) {
      raiseNotFound('User Data');
    }

    await this.mongo.updateOne('User', { _id: existingData._id }, { isActive });

    return {
      success: true,
      successMsg: `${existingData.name} is ${isActive ? 'activated' : 'deactivated'} Successfully !`,
    };
  }
}
