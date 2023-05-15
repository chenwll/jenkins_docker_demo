import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getDetail(params) {
  return request(createTheURL(Config.API.EXPERTDISTRIBUTION, 'get'), {
    method: 'GET',
    body:params
  });
};

export async function set(params) {
  return request(createTheURL(Config.API.EXPERTDISTRIBUTION, 'set'), {
    method: 'POST',
    body:params
  });
};

export async function submit(params) {
  return request(createTheURL(Config.API.EXPERTDISTRIBUTION, 'submit'), {
    method: 'PUT',
    body:params
  });
};

export async function processProject(params) {
  return request(createTheURL(Config.API.EXPGUIDE, 'refs'), {
    method: 'GET',
    body:params
  });
};

export async function selfProject(params) {
  return request(createTheURL(Config.API.EXPGUIDE, 'refs'), {
    method: 'GET',
    body:params
  });
};

export async function guideFetch(params) {
  return request(createTheURL(Config.API.EXPGUIDE, 'guide'), {
    method: 'GET',
    body:params
  });
};

export async function guideFetchScore(params) {
  return request(createTheURL(Config.API.EXPGUIDE, 'score'), {
    method: 'GET',
    body:params
  });
};

export async function projectGet(params) {
  return request(createTheURL(Config.API.EXPERTPROJECT, 'prj'), {
    method: 'GET',
    body:params
  });
};

export async function editGrade(param){
  return request(createTheURL(Config.API.EXPGUIDE, 'score/editGrade'), {
    method: 'PUT',
    body:param,
  });
}

export async function muchSubmitScore(param){
  return request(createTheURL(Config.API.EXPGUIDE, 'score/batchCommit'), {
    method: 'PUT',
    body:param,
  });
}


