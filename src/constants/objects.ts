// Imports
import { extname } from 'path';
import { diskStorage } from 'multer';

export const kUploadFileObj = (path = './') => {
  return {
    storage: diskStorage({
      destination: path,
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}${extname(file.originalname)}`);
      },
    }),
  };
};
