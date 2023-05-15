import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'

export async function getGuideList(param) {
  return request(createTheURL(Config.API.APPLICANTGUIDE, 'list'), {
    method: 'GET',
    body:param,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}

export async function getNewsList(param) {
  return request(createTheURL(Config.API.NEWS,'list'), {
    method: 'GET',
    body:param,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}

export async function getGuideDetail(param) {
  return request(createTheURL(Config.API.APPLICANTGUIDE, 'get'), {
    method: 'GET',
    body:param,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}

export async function getNewsDetail(param) {
  return request(createTheURL(Config.API.NEWS,'get'), {
    method: 'GET',
    body:param,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}

export async function getLikeNewsNum(param) {
  return request(createTheURL(Config.API.NEWSEDU,'approve'), {
    method: 'POST',
    body:param,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}

export async function getLikeGudieNum(param) {
  return request(createTheURL(Config.API.GUIDEEDU,'approve'), {
    method: 'POST',
    body:param,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}
export async function getImg(param) {
  return request(createTheURL(Config.API.IMG,'list'), {
    method: 'GET',
    body:param,
  },REQUEST_HEADER_LIST.WITH_OUT_TOKEN_TYPE);
}
