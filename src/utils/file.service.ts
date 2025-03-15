// Imports
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  async filePathToBase64(filePath) {
    try {
      const fileBuffer = await fs.promises.readFile(filePath);
      await this.removeFile(filePath);
      return fileBuffer.toString('base64');
    } catch (error) {
      throw new Error(`Failed to read or encode file: ${error.message}`);
    }
  }

  async removeFile(filePath) {
    // Delete the file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
