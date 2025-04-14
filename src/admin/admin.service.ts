// Imports
import { Injectable } from '@nestjs/common';
import { MongoService } from 'src/db/mongo';
import { HTTPError, raiseNotFound } from 'src/configs/error';

@Injectable()
export class AdminService {
  constructor(private readonly mongo: MongoService) {}

  async users() {
    const users = await this.mongo.findAll(
      'User',
      {
        type: { $nin: [2] },
      },
      [
        'isActive',
        'name',
        'email',
        'isAadhaarApproved',
        'isDriverLicenceApproved',
      ],
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

  async pendingApprovals() {
    const user_list = await this.mongo.findAll(
      'User',
      {
        fileDocId: { $ne: null },
        isAadhaarApproved: false,
        isDriverLicenceApproved: false,
      },
      ['name', 'type', 'fileDocId'],
    );

    const fileDocIds = user_list.map((el) => el.fileDocId);
    const file_list = await this.mongo.findAll('FileDoc', {
      _id: { $in: fileDocIds },
    });

    const target_list: any = [];
    user_list.forEach((el) => {
      const fileData = file_list.find((subEl) => subEl._id == el.fileDocId);
      target_list.push({
        name: el.name,
        _id: el._id,
        base64Content: fileData.content,
      });
    });

    return { list: target_list };
  }
}
