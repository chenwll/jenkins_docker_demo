import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function addPicture(param) {
  return request(createTheURL(Config.API.PICTURE, 'add'), {
    method: 'POST',
    body:param,
  });
}
export async function deletePicture(param) {
  return request(createTheURL(Config.API.PICTURE, 'del'), {
    method: 'DELETE',
    body:param,
  });
}
export async function delAllPicture(param) {
  return request(createTheURL(Config.API.PICTURE, 'delall'), {
    method: 'DELETE',
    body:param,
  });
}
export async function getPicture(param) {
  return request(createTheURL(Config.API.PICTURE, 'get'), {
    method: 'GET',
    body:param,
  });
}
export async function listPicture(param) {
  return request(createTheURL(Config.API.PICTURE, 'list'), {
    method: 'GET',
    body:param,
  });
}
