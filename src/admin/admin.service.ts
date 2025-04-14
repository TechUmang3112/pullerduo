// Imports
import { Injectable } from '@nestjs/common';
import { MongoService } from 'src/db/mongo';
import { HTTPError, raiseNotFound } from 'src/configs/error';
import { MailJetService } from 'src/thirdParty/mailjet/mail.jet.service';
import { DOC_APPEROVE, DOC_DECLINE } from 'src/constants/strings';

@Injectable()
export class AdminService {
  constructor(
    private readonly mongo: MongoService,
    private readonly mailJet: MailJetService,
  ) {}

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
        type: el.type,
        _id: el._id,
        base64Content: fileData.content,
      });
    });

    return { list: target_list };
  }

  async updateDocStatus(reqData) {
    const action = reqData.action;
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

    await this.mailJet.sendMail({
      subject: `Document is ${action == 'approve' ? 'Approved' : 'Declined'}`,
      email: existingData.email,
      htmlContent: (action == 'approve' ? DOC_APPEROVE : DOC_DECLINE).replace(
        'USER_NAME',
        existingData.name,
      ),
    });

    const updatedData: any = {};
    if (action == 'approve') {
      if (existingData.type == '0') {
        updatedData.isAadhaarApproved = true;
      } else {
        updatedData.isDriverLicenceApproved = true;
      }
    } else {
      updatedData.fileDocId = null;
    }

    await this.mongo.updateOne('User', { _id: existingData._id }, updatedData);

    return {
      success: true,
      successMsg: `Document is ${action == 'approve' ? 'Approved' : 'Declined'}`,
    };
  }

  async totalRides() {
    const list = await this.mongo.findAll('Ride', {}, [
      'startPlace',
      'endPlace',
      'rideTime',
      'status',
      'total_payment',
    ]);

    list.sort((b, a) => a.rideTime.getTime() - b.rideTime.getTime());

    return { list };
  }
}
