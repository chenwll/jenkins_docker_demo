import tokenHandler from '../tokenHandler';

export const REQUEST_HEADER_LIST = {
  WITH_OUT_TOKEN_TYPE: 'WITH_OUT_TOKEN_TYPE',
  FILE_DOWN_TYPE: 'FILE_DOWN_TYPE',
  IMAGE_TYPE: 'IMAGE_TYPE',
  FILE_UPLOAD_TYPE: 'FILE_UPLOAD_TYPE',
  EXPORT_TYPE: 'EXPORT_TYPE',
  DEFAULT: 'DEFAULT',
};

export function getHeaderObject(typeStr) {
  let config = {};
  switch (typeStr) {
    case 'WITH_OUT_TOKEN_TYPE':
      config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
      };
      break;
    case 'FILE_DOWN_TYPE':
      config = {
        // headers : {
        //   token : tokenHandler.getSessionByKey('token'),
        // },
        responseType: 'blob',
      };
      break;
    case 'EXPORT_TYPE':
      config = {
        headers: {
          Authorization: tokenHandler.getSessionByKey('token'),
        },
        responseType: 'blob',
      };
      break;
    case 'IMAGE_TYPE':
      config = {
        headers: {
          Authorization: tokenHandler.getSessionByKey('token'),
          Accept: 'image/png',
        },
        responseType: 'arraybuffer',
      };
      break;
    case 'FILE_UPLOAD_TYPE':
      config = {
        headers: {
          Authorization: tokenHandler.getSessionByKey('token'),
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'json',
      };
      break;
    default:
      config = {
        headers: {
          Authorization: tokenHandler.getSessionByKey('token'),
          //token: '4500fe68-4d7a-4777-9f5f-b5025d6a72cc',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
      };
  }
  return config;
}
