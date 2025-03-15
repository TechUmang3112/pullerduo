// Imports
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.model';
import { FileDoc, FileDocDocument } from './models/file.model';
import {
  GooglePlaces,
  GooglePlacesDocument,
} from './models/google.places.model';
import {
  GoogleMeasure,
  GoogleMeasureDocument,
} from './models/google.measure.model';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(FileDoc.name)
    private readonly fileDocModel: Model<FileDocDocument>,
    @InjectModel(GooglePlaces.name)
    private readonly googlePlacesModel: Model<GooglePlacesDocument>,
    @InjectModel(GoogleMeasure.name)
    private readonly googleMeasureModel: Model<GoogleMeasureDocument>,
  ) {}

  async insert(model: string, document: any) {
    const selectedModel = this.getModel(model);
    return await selectedModel.create(document);
  }

  async findOne(model: string, filter: any) {
    const selectedModel = this.getModel(model);
    return await selectedModel.findOne(filter).exec();
  }

  async updateOne(model: string, filter: any, update: any) {
    const selectedModel = this.getModel(model);
    return await selectedModel.updateOne(filter, update).exec();
  }

  private getModel(model) {
    let selectedModel;
    if (model == 'User') {
      return (selectedModel = this.userModel);
    } else if (model == 'FileDoc') {
      return (selectedModel = this.fileDocModel);
    } else if (model == 'googlePlace') {
      return (selectedModel = this.googlePlacesModel);
    } else if (model == 'googleMeasure') {
      return (selectedModel = this.googleMeasureModel);
    }

    return selectedModel;
  }
}
