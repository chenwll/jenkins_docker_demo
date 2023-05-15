import request from '@/utils/request/request';
import { createTheURL } from '@/utils/utils';
import Config from '../../../config/api';
import { REQUEST_HEADER_LIST } from '@/utils/request/requestHeader';
import tokenHandler from '@/utils/tokenHandler';

export const TYPE = {
  'PICTURE':0,
  'FILE':1,
}

export const defaultConfig = {
  [TYPE.PICTURE]:{
    "showUploadList":true,
    "listType":'picture-card',
    "accept":'.jpg,.png',
  },
  [TYPE.FILE]:{
    "showUploadList":false,
    "listType":'text',
    "accept":'.txt,.docx,.pdf,.csv,.xls,.doc,.xlsx',
  }
}

export const EXTENDS_REG = {
  [TYPE.PICTURE]: /\.(png|jpg)$/,
  [TYPE.FILE]:   /\.(txt|docx|pdf|csv|xls|doc|xlsx)$/,
}

export const fileNameRegular = {
  reg: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,50}.*$/,
  msg: '文件名只能由数字，字母和中文构成,且长度不超过50',
};

export const splitFileName = {
  reg: /(.*\/)*([^.]+).*/ig,
  msg: '截取文件名称',
};

export const FileSizeLimit = {
  [TYPE.PICTURE]:{
    UPPER_LIMIT: {
      number: 10 * 1024 * 1024,
      description: '10MB',
    },
    LOWER_LIMIT: {
      number:  1024,
      description: '1KB',
    },
  },
  [TYPE.FILE]:{
    UPPER_LIMIT: {
      number: 20 * 1024 * 1024,
      description: '20MB',
    },
    LOWER_LIMIT: {
      number: 10 * 1024,
      description: '10KB',
    },
  }
}

export const uploadOptions = {
  "headers": {
    "Authorization": tokenHandler.getSessionByKey('token'),
    "Content-Type": "multipart/form-data"
  },
  "responseType": "json",
  "method": "POST",
  "url": "/api/admin/sys-file/upload",
}

export const removeOptions = {
  "headers": {
    "Authorization": tokenHandler.getSessionByKey('token'),
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  "responseType": "json",
  "method": "DELETE",
  "url": "/api/admin/sys-file/del",
}

// export const requestOnUpload = (params) => {
//   return request(createTheURL(Config.API.FILE,'upload'),{
//     method: 'POST',
//     body:params,
//   },REQUEST_HEADER_LIST.FILE_UPLOAD_TYPE)
// }
//
// export const requestOnRemove = (params) => {
//   return request(createTheURL(Config.API.FILE,'del'),{
//     method: 'DELETE',
//     body:params,
//   })
// }
