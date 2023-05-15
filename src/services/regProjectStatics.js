import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'

export async function queryList(param) {
  return request(createTheURL(Config.API.REGSTATICS, 'guide'), {
    method: 'GET',
    body:param,
  });
}
export async function queryProjectList(param) {
  return request(createTheURL(Config.API.REGSTATICS, 'process'), {
    method: 'GET',
    body:param,
  });
}

export async function queryGuideProjectList(param) {
  return request(createTheURL(Config.API.REGSTATICS, 'guideProject'), {
    method: 'GET',
    body:param,
  });
}

export async function projectGet(param) {
  return request(createTheURL(Config.API.REG, 'get'), {
    method: 'GET',
    body:param,
  });
}

