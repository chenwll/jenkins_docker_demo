import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import remoteLinkAddress, {GLOBAL_URL} from '@/utils/ip'

export async function getUserList(params) {
  return request(createTheURL(Config.API.USER, 'page'), {
    method: 'GET',
    body:params
  });
}
export async function changeInfo(params) {
  return request(`${remoteLinkAddress()}${Config.API.USER}`, {
    method: 'PUT',
    body: params,
  });
}
export async function addUser(params) {
  return request(`${remoteLinkAddress()}${Config.API.USER}`, {
    method: 'POST',
    body: params,
  });
}
export async function delUser(params) {
  return request(createTheURL(Config.API.USER, `${params}`), {
    method: 'DELETE',
    body: params,
  });
}
export async function getUser(params) {
  return request(createTheURL(Config.API.USER, `${params.id}`), {
    method: 'GET',
    body: params,
  });
}

export async function resetPassWord(params) {
  return request(createTheURL(Config.API.USER,'resetPsw'), {
    method: 'PUT',
    body: params,
  });
}
export async function getAllRole(params) {
  return request(createTheURL(Config.API.ROLE,'list'), {
    method: 'GET',
    body: params,
  });
};

export async function getAllUser(params) {
  return request(createTheURL(Config.API.USER, 'all'), {
    method: 'GET',
    body: params,
  });
}

