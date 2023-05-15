import request from '@/utils/request/request';
import { createTheURL } from '@/utils/utils';
import Config from '../../config/api';

export async function getAdminGuide(param) {
  return request(createTheURL(Config.API.REGGUIDE, 'page'), {
    method: 'GET',
    body:param,
  });
}

export async function getUserGuide(param) {
  return request(createTheURL(Config.API.REGGUIDE, '/user/page'), {
    method: 'GET',
    body:param,
  });
}

export async function getDepartments(params) {
  return request(createTheURL(Config.API.COMMIT,'review/dept'),{
    method: 'GET',
    body:params,
  })
}


export async function getAdminRules(params) {
  return request(createTheURL(Config.API.COMMIT,'review/all'),{
    method: 'GET',
    body:params,
  })
}


export async function getTaskDetail(params) {
  return request(createTheURL(Config.API.COMMIT,'review/report'),{
    method: 'GET',
    body:params,
  })
}

export async function submitReview(params) {
  return request(createTheURL(Config.API.COMMIT,'review'),{
    method: 'PUT',
    body:params,
  })
}

export async function getCommit(params) {
  return request(createTheURL(Config.API.COMMIT,'review/report'),{
    method: 'PUT',
    body:params,
  })
}



