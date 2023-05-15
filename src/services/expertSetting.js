import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import { REQUEST_HEADER_LIST } from '../utils/request/requestHeader';

export async function fetch(params) {
  return request(createTheURL(Config.API.EXPERT, 'list'), {
    method: 'GET',
    body:params
  });
}
export async function fetchAll(params) {
  return request(createTheURL(Config.API.EXPERT, 'all'), {
    method: 'GET',
    body:params
  });
}

export async function getExpertGroup(params){
  return request(createTheURL(Config.API.EXPERTGROUP, 'list'), {
    method: 'GET',
    body:params
  });
}

export async function addExpertGroup(params){
  return request(createTheURL(Config.API.EXPERTGROUP, 'add'), {
    method: 'POST',
    body:params
  });
}

export async function getExpertGroupById(params) {
  return request(createTheURL(Config.API.EXPERTGROUP, 'get'), {
    method: 'GET',
    body:params
  });
}

export async function editExpertGroup(params){
  return request(createTheURL(Config.API.EXPERTGROUP, 'edit'), {
    method: 'PUT',
    body:params
  });
}

export async function deleteExpertGroup(params){
  return request(createTheURL(Config.API.EXPERTGROUP, 'del'), {
    method: 'DELETE',
    body:params
  });
}

export async function getExpertDetail(params) {
  return request(createTheURL(Config.API.EXPERT, 'get'), {
    method: 'GET',
    body:params
  });
}

export async function changeInfo(params) {
  return request(createTheURL(Config.API.EXPERT, 'edit'), {
    method: 'PUT',
    body:params
  });
}

export async function addExpert(params) {
  return request(createTheURL(Config.API.EXPERT, 'add'), {
    method: 'POST',
    body:params
  });
}

export async function delExpert(params) {
  return request(createTheURL(Config.API.EXPERT, 'del'), {
    method: 'DELETE',
    body:params
  });
}

export async function getAllUser(params) {
  return request(createTheURL(Config.API.USER, 'all'), {
    method: 'GET',
    body:params
  });
}

export async function exportExperts(params){
  return request(createTheURL(Config.API.EXPERT, 'excelAll'), {
    method: 'GET',
    body:params
  },REQUEST_HEADER_LIST.EXPORT_TYPE);
}

export async function exportSomeExperts(params){
  return request(createTheURL(Config.API.EXPERT, 'excel'), {
    method: 'GET',
    body:params
  },REQUEST_HEADER_LIST.EXPORT_TYPE);
}
