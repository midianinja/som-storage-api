import base64Img from 'base64-img';
import imagemin from 'imagemin';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';
import fs from 'fs';
import s3 from './aws.repository';
/**
  * @function upload
  *
  * That function delete an credit card on wirecard api.
  * That action is irreversible.
  * For use that function make a GET request to
  *   /delete-credit-card?wirecardId=CRC-5TUWT121PNZY,
  *   the wirecardId in query, is the credit card id in Wirecard
  *
  * @method GET
  * @param {string} wirecardId
  */
export const upload = async (event) => {
  const { file, id } = JSON.parse(event.body);
  const filename = `${new Date().getTime()}`;
  const data = file.replace(/^data:image\/\w+;base64,/, '');
  const base64Data = Buffer.from(data, 'base64');
  const rootDir = '/tmp';
  const originalTmpPath = `${rootDir}/originals/`;
  const mimifiedTmpPath = `${rootDir}/mimifieds/`;
  const thumbnailTmpPath = `${rootDir}/thumbnails/`;
  const key = type => `images/${id}/jpg/${type}/${filename}`;

  const filepath = await base64Img.imgSync(
    `data:image/jpg;base64,${data}`,
    originalTmpPath,
    filename,
  );
  try {
    await imagemin([filepath], mimifiedTmpPath, {
      plugins: [
        imageminJpegRecompress({
          loops: 4,
          quality: 'high',
        }),
      ],
    });

    await imagemin([filepath], thumbnailTmpPath, {
      plugins: [
        imageminJpegRecompress({
          loops: 4,
          quality: 'low',
        }),
      ],
    });

  } catch (err) {
    console.log('Orifinal image error', err);
    return ({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: {
          type: 'upload_original_image',
          info: err,
        },
      }),
    });
  }

  const urls = {};
  console.log('urls: ', urls);

  try {
    const originalResponse = await s3.upload(base64Data, `${key('originals')}.jpg`, 'image/jpeg', undefined);
    urls.original = originalResponse.Location;
  } catch (err) {
    console.log('Orifinal image error', err);
    return ({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: {
          type: 'upload_original_image',
          info: err,
        },
      }),
    });
  }

  try {
    const mimifiedBuffer = await fs.readFileSync(`${mimifiedTmpPath + filename}.jpg`);
    const mimifiedResponse = await s3.upload(mimifiedBuffer, `${key('mimifieds')}.jpg`, 'image/jpeg', undefined);
    urls.mimified = mimifiedResponse.Location;
  } catch (err) {
    console.log('mimified image error', err);
    return ({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: {
          type: 'process_mimified_image',
          info: err,
        },
      }),
    });
  }

  try {
    const thumbnailBuffer = await fs.readFileSync(`${thumbnailTmpPath + filename}.jpg`);
    const thumbnailResponse = await s3.upload(thumbnailBuffer, `${key('thumbnails')}.jpg`, 'image/jpeg', undefined);
    urls.thumbnail = thumbnailResponse.Location;
  } catch (err) {
    console.log('upload image error', err);
    return ({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: {
          type: 'process_thumbnail_image',
          info: err,
        },
      }),
    });
  }

  console.log('urls: ', urls);
  return ({
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urls,
    }),
  });
};

export const remove = (event) => {
  console.log('here', event);
};

// export const upload = (event) => {
// const multipartData = await multipart.parse(event);
//   if (multipartData.error) {
//     return ({
//       statusCode: 500,
//       body: JSON.stringify({
//         error: true,
//         msg: 'Internal Server Error',
//         info: 'internal_server_error',
//       }),
//     });
//   }

//   const { file, info } = multipartData;
//   let fileData, filePath;

//   if(types.findIndex(type => type === info.ext) === -1) {
//     return ({
//       statusCode: 401,
//       body: JSON.stringify({
//         error: true,
//         msg: 'not_support',
//         info: 'Image extension not supported',
//       }),
//     });
//   }

//   const rootDir = process.cwd();
// await imagemin([file.path], rootDir+'/tmp', {
//   plugins: [
//     imageminJpegRecompress(),
//     imageminPngquant({ quality: '50-70' })
//   ]
// });

//   filePath = rootDir + file.path;
//   fileData = await fileSystem.read(filePath);
//   const key = `image/${id}/${info.ext}/${fileId}.${info.ext}`;

//   const result =
// await s3.upload(fileData, key, info.contentType, event.stageVariables.bucketName);
//   fileSystem.delete(filePath);
// }
