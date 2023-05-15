import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getStatis(params) {
  return request(createTheURL(Config.API.STATIS, 'stage'), {
    method: 'GET',
    body:params
  });
};

export async function getProcessAndSchoolStatis(params) {
  return request(createTheURL(Config.API.STATIS, 'process'), {
    method: 'GET',
    body:params
  });
};

export async function getAllNews(params) {
  // return request(createTheURL(Config.API.ENEWS, 'all'), {
  //   method: 'GET',
  //   body:params
  // });
};

export async function getStaticsGuide(params) {
  // return request(createTheURL(Config.API.PROJECTSTATICS, 'guide'), {
  //   method: 'GET',
  //   body:params
  // });
};

export async function getRegstaticsGuide(params) {
  return request(createTheURL(Config.API.REGSTATICS, 'guide'), {
    method: 'GET',
    body:params
  });
};

export async function getDeclareGuide(params) {
  return request(createTheURL(Config.API.GUIDEEDU, 'list'), {
    method: 'GET',
    body:params
  });
};

export async function getDeclarePrj() {
  return request(createTheURL(Config.API.APPLICATION, 'all'), {
    method: 'GET',
  });
};

export async function getSchool() {
  return request(createTheURL(Config.API.SCHOOL, 'all'), {
    method: 'GET',
  });
};

export async function getScore(params) {
  return request(createTheURL(Config.API.EXPGUIDE, 'score'), {
    method: 'GET',
    body:params
  });
};

export async function getReguser() {
  return request(createTheURL(Config.API.REGUSER, 'list'), {
    method: 'GET',
  });
};
