import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import { REQUEST_HEADER_LIST } from '@/utils/request/requestHeader';
import remoteLinkAddress from '@/utils/ip';

export async function getPointsList(param) {
  return request(createTheURL(Config.API.SITE, 'page'), {
    method: 'GET',
    body:param,
  });
}

export async function addPoint(param) {
  return request(createTheURL(Config.API.SITE), {
    method: 'POST',
    body:param,
  });
}

export async function deletePoint(param) {
  return request(createTheURL(Config.API.SITE,'delete'), {
    method: 'DELETE',
    body:param,
  });
}

export async function getPoint(param) {
  return request(createTheURL(Config.API.SITE,'get'), {
    method: 'GET',
    body:param,
  });
}

export async function savePointInfo(param) {
  return request(createTheURL(Config.API.SITE), {
    method: 'PUT',
    body:param,
  });
}

export async function getAllPoints() {
  return request(createTheURL(Config.API.SITE,'getAll'), {
    method: 'GET',
  });
}

export async function getRolesList() {
  return request(createTheURL(Config.API.SITE,'userInfo'), {
    method: 'GET',
  });
}


export async function getPointInfoById(params) {
  return request(createTheURL(Config.API.SITE,'get'), {
    method: 'GET',
    body:params,
  });
}

export async function uploadMiniPicture(params) {
  return request(createTheURL(Config.API.FILE,'upload'),{
    method: 'POST',
    body:params,
  },REQUEST_HEADER_LIST.FILE_UPLOAD_TYPE)
}

export async function getMiniPicture(params) {
  return request(createTheURL(Config.API.FILE,'getImg'),{
    method: 'GET',
    body:params,
  })
}

export async function deleteMiniPicture(params) {
  return request(createTheURL(Config.API.FILE,'del'),{
    method: 'DELETE',
    body:params,
  })
}

export async function getDepartments(params) {
  return request(createTheURL(Config.API.DEPT,'tree'),{
    method: 'GET',
    body:params,
  })
}


export async function getHomePoint(params) {
  return request(createTheURL(Config.API.HOMESITE,'get'),{
    method: 'GET',
    body:params,
  })
}


