// Imports
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.model';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async insert(model: string, document: any) {
    let selectedModel;
    switch (model) {
      case 'User':
        selectedModel = this.userModel;
        break;
      // Add more cases for other models if needed
      default:
        throw new Error(`Model ${model} not found`);
    }
    return await selectedModel.create(document);
  }


  async findOne(model: string, filter: any) {
    let selectedModel;
    switch (model) {
      case 'User':
        selectedModel = this.userModel;
        break;
      // Add more cases for other models if needed
      default:
        throw new Error(`Model ${model} not found`);
    }
    return await selectedModel.findOne(filter).exec();
  }

  async updateOne(model: string, filter: any, update: any) {
    let selectedModel;
    switch (model) {
      case 'User':
        selectedModel = this.userModel;
        break;
      // Add more cases for other models if needed
      default:
        throw new Error(`Model ${model} not found`);
    }
    return await selectedModel.updateOne(filter, update).exec();
  }
}
