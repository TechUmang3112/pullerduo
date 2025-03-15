// Imports
import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  async post(url, body = {}, headers = {}) {
    const response = await axios.post(url, body, { headers });
    return response.data;
  }
}
