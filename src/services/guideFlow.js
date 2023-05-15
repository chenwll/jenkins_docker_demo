import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'

export async function queryList(param) {
  return request(createTheURL(Config.API.GUIDEFLOW, 'list'), {
    method: 'GET',
    body:param,
  });
}

export async function getDetail(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'get'), {
    method: 'GET',
    body:param,
  });
}
export async function editGuide(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'edit'), {
    method: 'PUT',
    body:param,
  });
}
export async function addGuide(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'add'), {
    method: 'POST',
    body:param,
  });
}
export async function guideAddAll(param) {
  return request(createTheURL(Config.API.GUIDEFLOW, 'addAll'), {
    method: 'POST',
    body:param,
  });
}
export async function deleteGuide(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'del'), {
    method: 'DELETE',
    body:param,
  });
}
export async function nextState(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'nextState'), {
    method: 'PUT',
    body:param,
  });
}
export async function revoke(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'revoke'), {
    method: 'PUT',
    body:param,
  });
}

export async function getState(params) {
  return request(createTheURL(Config.API.DICT, 'all'), {
    method: 'GET',
    body: params
  });
}

export async function allRule(param) {
  return request(createTheURL(Config.API.ERULES, 'all'), {
    method: 'GET',
    body:param,
  });
}

export async function getProviderList() {
  return request();
}
