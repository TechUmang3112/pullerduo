// Imports
import { HttpStatus, Injectable } from '@nestjs/common';
import { HTTPError } from 'src/configs/error';
import { nGoogle } from 'src/constants/network';
import { MongoService } from 'src/db/mongo';
import { ApiService } from 'src/utils/api.service';

@Injectable()
export class GoogleService {
  constructor(
    private readonly api: ApiService,
    private readonly mongo: MongoService,
  ) {}

  async searchPlaces(reqData) {
    let searchText: string = reqData.searchText;
    if (!searchText) {
      throw HTTPError({ parameter: 'searchText' });
    }
    searchText = searchText.trim();
    if (!searchText) {
      throw HTTPError({ parameter: 'searchText' });
    }
    searchText = searchText.toLowerCase();

    const existingResult = await this.mongo.findOne('GooglePlace', {
      searchText,
    });
    if (existingResult) {
      existingResult.response.forEach((el) => {
        el.isCached = true;
      });
      return existingResult.response;
    }

    const body = { textQuery: searchText };
    const headers = {
      'X-Goog-FieldMask': 'places.displayName,places.location',
    };
    const response = await this.api.post(nGoogle.placesSearch, body, headers);
    const places = response.places;

    const finalizedList: any = [];
    places.forEach((el) => {
      finalizedList.push({
        name: el.displayName?.text,
        lat: el.location?.latitude,
        long: el.location?.longitude,
      });
    });

    await this.mongo.insert('GooglePlace', {
      searchText,
      response: finalizedList,
    });

    return finalizedList;
  }

  async measureDistance(reqData) {
    const latC = reqData.latC;
    if (!latC) {
      throw HTTPError({ parameter: 'latC' });
    }
    const longC = reqData.longC;
    if (!longC) {
      throw HTTPError({ parameter: 'longC' });
    }
    const latD = reqData.latD;
    if (!latD) {
      throw HTTPError({ parameter: 'latD' });
    }
    const longD = reqData.longD;
    if (!longD) {
      throw HTTPError({ parameter: 'longD' });
    }
    if (latC == latD && longC == longD) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Current location and destination are same !',
      });
    }

    const uniqueStr = `${latC}${longC}${latD}${longD}`;
    const existingData = await this.mongo.findOne('googleMeasure', {
      uniqueStr,
    });
    if (existingData) {
      existingData.response.isCached = true;
      return existingData.response;
    }

    const body = {
      origin: {
        location: {
          latLng: {
            latitude: latC,
            longitude: longC,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: latD,
            longitude: longD,
          },
        },
      },
      travelMode: 'DRIVE',
    };
    const headers = {
      'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
    };
    const response = await this.api.post(
      nGoogle.measureDistance,
      body,
      headers,
    );
    const routes = response.routes ?? [];
    const targetRoute = { distanceInKm: 0, durationInMinutes: 0 };
    targetRoute.distanceInKm = +(routes[0].distanceMeters / 1000).toFixed(2);
    targetRoute.durationInMinutes = Math.floor(
      +routes[0].duration.replace('s', '') / 60,
    );

    await this.mongo.insert('googleMeasure', {
      response: targetRoute,
      uniqueStr,
    });

    return targetRoute;
  }
}
