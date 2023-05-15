import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import {REQUEST_HEADER_LIST} from "../utils/request/requestHeader";

export async function getGuideList(params){
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'list'), {
    method: 'GET',
    body:params
  });
};

export async function getAllProjectList(params){
  return request(createTheURL(Config.API.EDUCATION, 'list'), {
    method: 'GET',
    body:params
  });
};

export async function getAllProjectDetail(params) {
  return request(createTheURL(Config.API.EDUCATION, 'get'), {
    method: 'GET',
    body:params
  });
};

export async function getProjectRecommendInfo(params) {
  return request(createTheURL(Config.API.PRJEVALUATE, 'get'), {
    method: 'GET',
    body:params
  });
};
export async function excelProjectRecommendInfo(params) {
  return request(createTheURL(Config.API.PRJEVALUATE, 'excelAll'), {
    method: 'GET',
    body:params
  },REQUEST_HEADER_LIST.EXPORT_TYPE);
};

export async function getAllGuide() {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'all'), {
    method: 'GET',
  });
}

export async function forceRecommend(params) {
  return request(createTheURL(Config.API.EDUCATION, 'setup'), {
    method: 'GET',
    body:params
  });
}
export async function withDraw(params) {
  return request(createTheURL(Config.API.WITHDRAW, 'withDraw'), {
    method: 'PUT',
    body:params
  });
}
export async function setEnd(params){
  return request(createTheURL(Config.API.RANK, 'setEnd'), {
    method: 'PUT',
    body:params
  });
};
export async function getProcess(params) {
  return request(createTheURL(Config.API.STATIS, 'process'), {
    method: 'GET',
    body:params,
  });
}

export async function getScoreTree(params) {
  return request(createTheURL(Config.API.STATIS, 'scoreTree'), {
    method: 'GET',
    body:params,
  });
}

export async function getStage(params) {
  return request(createTheURL(Config.API.STATIS, 'stage'), {
    method: 'GET',
    body:params,
  });
}

export async function getClassicCaseList(params){
  return request(createTheURL(Config.API.EDUANNEX, 'list'), {
    method: 'GET',
    body:params
  });
};

export async function exportClassicCase(params){
  return request(createTheURL(Config.API.EDUANNEX, 'excelAll'), {
    method: 'GET',
    body:params
  },REQUEST_HEADER_LIST.EXPORT_TYPE);
};


