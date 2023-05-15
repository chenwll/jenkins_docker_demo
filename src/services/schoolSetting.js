import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getSchoolList(params) {
  return request(createTheURL(Config.API.SCHOOL, 'list'), {
    method: 'GET',
    body:params
  });
};
export async function getSchoolType(params) {
  return request(createTheURL(Config.API.DICT, 'list'), {
    method: 'GET',
    body:params
  });
};
export async function getDepartment() {
  return request(createTheURL(Config.API.EDEPARTMENT, 'all'), {
    method: 'GET',
  });
};

export async function getSchoolDetail(params) {
  return request(createTheURL(Config.API.SCHOOL, 'get'), {
    method: 'GET',
    body:params
  });
};

export async function editSchool(params) {
  return request(createTheURL(Config.API.SCHOOL, 'edit'), {
    method: 'PUT',
    body:params
  });
};


export async function addSchool(params) {
  return request(createTheURL(Config.API.SCHOOL, 'add'), {
    method: 'POST',
    body:params
  });
};

export async function delSchool(params) {
  return request(createTheURL(Config.API.SCHOOL, 'del'), {
    method: 'DELETE',
    body:params
  });
};


//个人中心需要使用
export async function getAll(params) {
  return request(createTheURL(Config.API.SCHOOL, 'all'), {
    method: 'GET',
    body:params
  });
};
