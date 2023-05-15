import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'

export async function queryList(param) {
  return request(createTheURL(Config.API.GOODS, 'list'), {
    method: 'GET',
    body:param,
  });
}

export async function getDetail(param) {
  return request(createTheURL(Config.API.GOODS, 'get'), {
    method: 'GET',
    body:param,
  });
}
export async function editDetail(param) {
  return request(createTheURL(Config.API.GOODS, 'edit'), {
    method: 'POST',
    body:param,
  });
}
export async function addDetail(param) {
  return request(createTheURL(Config.API.GOODS, 'add'), {
    method: 'POST',
    body:param,
  });
}
export async function deleteDetail(param) {
  return request(createTheURL(Config.API.GOODS, 'del'), {
    method: 'GET',
    body:param,
  });
}

export async function getProviderList() {
  return request();
}

