import dotenv from 'dotenv';

import {
  upload as uploadImage,
} from './src/images';
import {
  upload as uploadSong,
} from './src/songs';
import {
  upload as uploadDocument,
} from './src/documents';

dotenv.config();

export const uploadImageFunction = uploadImage;
export const uploadSongFunction = uploadSong;
export const uploadDocumentFunction = uploadDocument;
