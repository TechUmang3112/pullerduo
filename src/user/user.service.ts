// Imports
import { MongoService } from 'src/db/mongo';
import { HttpStatus, Injectable } from '@nestjs/common';
import { HTTPError } from 'src/configs/error';
import { FileService } from 'src/utils/file.service';

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
    if (userData.type != -1) {
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
}
