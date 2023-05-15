import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getProcess(params) {
  return request(createTheURL(Config.API.PROJECTSTATICS, 'process'), {
    method: 'GET',
    body:params
  });
};

export async function guideFetch(params) {
  return request(createTheURL(Config.API.PROJECTSTATICS, 'guide'), {
    method: 'GET',
    body:params
  });
};

export async function getProcessProject(params) {
  return request(createTheURL(Config.API.PROJECTSTATICS, 'selfProject'), {
    method: 'GET',
    body:params
  });
};

export async function submitRecommend(params) {
  return request(createTheURL(Config.API.PROJECTREFS, 'submit'), {
    method: 'PUT',
    body:params
  });
};

export async function getSubmitDetail(params) {
  return request(createTheURL(Config.API.PROJECTREFS, 'get'), {
    method: 'GET',
    body:params
  });
};

export async function setRecommend(params) {
  return request(createTheURL(Config.API.PROJECTREFS, 'set'), {
    method: 'POST',
    body:params
  });
};
