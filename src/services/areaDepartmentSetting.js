import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import { REQUEST_HEADER_LIST } from '../utils/request/requestHeader';

export async function regUserList(param) {
  return request(createTheURL(Config.API.REGUSER, 'list'), {
    method: 'GET',
    body:param,
  });
}

export async function getDepartDicts(param) {
  return request(createTheURL(Config.API.DATADICT, 'all'), {
    method: 'GET',
    body:param,
  });
}

export async function examine(param) {
  return request(createTheURL(Config.API.REGUSER, 'examine'), {
    method: 'PUT',
    body:param,
  });
}

export async function getUser(param) {
  return request(createTheURL(Config.API.USER, 'get'), {
    method: 'get',
    body:param,
  });
}

export async function getDepart(params) {
  return request(createTheURL(Config.API.EDEPARTMENT,'get'), {
    method: 'GET',
    body:params,
  });
}

export async function getDepartAll(params) {
  return request(createTheURL(Config.API.EDEPARTMENT,'all'), {
    method: 'GET',
    body:params,
  });
}

export async function getSchool(params) {
  return request(createTheURL(Config.API.SCHOOL,'get'), {
    method: 'GET',
    body:params,
  });
}

