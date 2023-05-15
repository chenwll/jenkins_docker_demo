import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';


export async function getAnnualList(param) {
  return request(createTheURL(Config.API.ANNUAL, 'list'), {
    method: 'GET',
    body:param,
  });
}

export async function getAnnualDetail(param) {
  return request(createTheURL(Config.API.ANNUAL, 'get'), {
    method: 'GET',
    body:param,
  });
}


export async function addAnnual(param) {
  return request(createTheURL(Config.API.ANNUAL, 'add'), {
    method: 'POST',
    body:param,
  });
}


export async function commitAnnual(param) {
  return request(createTheURL(Config.API.ANNUAL, 'commit'), {
    method: 'PUT',
    body: param,
    params:param,
  });
}

export async function commitAnnualall(param) {
  return request(createTheURL(Config.API.ANNUAL, 'commitall'), {
    method: 'PUT',
    body:param,
    params:param,
  });
}

export async function editAnnual(param) {
  return request(createTheURL(Config.API.ANNUAL, 'edit'), {
    method: 'PUT',
    body:param,
  });
}


export async function deleteAnnual(param) {
  return request(createTheURL(Config.API.ANNUAL, 'del'), {
    method: 'DELETE',
    body:param,
  });
}

