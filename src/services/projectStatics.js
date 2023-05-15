import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'

export async function queryList(param) {
  return request(createTheURL(Config.API.PROJECTSTATICS, 'guide'), {
    method: 'GET',
    body:param,
  });
}
export async function queryProjectList(param) {
  return request(createTheURL(Config.API.PROJECTSTATICS, 'process'), {
    method: 'GET',
    body:param,
  });
}

export async function queryGuideProjectList(param) {
  return request(createTheURL(Config.API.PROJECTSTATICS, 'guideProject'), {
    method: 'GET',
    body:param,
  });
}

export async function projectGet(param) {
  return request(createTheURL(Config.API.EDUCATION, 'get'), {
    method: 'GET',
    body:param,
  });
}

export async function getSelfProject(param) {
  return request(createTheURL(Config.API.PROJECTSTATICS, 'selfProject'), {
    method: 'GET',
    body:param,
  });
}
