import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function queryList(param) {
  return request(createTheURL(Config.API.PROJECTREFS, 'list'), {
    method: 'GET',
    body:param,
  });
}

export async function getDetail(param) {
  return request(createTheURL(Config.API.PROJECTREFS, 'get'), {
    method: 'GET',
    body:param,
  });
}

export async function add(param) {
  return request(createTheURL(Config.API.PROJECTREFS, 'add'), {
    method: 'POST',
    body:param,
  });
}

export async function edit(param) {
  return request(createTheURL(Config.API.PROJECTREFS, 'edit'), {
    method: 'PUT',
    body:param,
  });
}

export async function submit(param) {
  return request(createTheURL(Config.API.PROJECTREFS, 'submit'), {
    method: 'PUT',
    body:param,
  });
}

export async function set(param) {
  return request(createTheURL(Config.API.PROJECTREFS, 'set'), {
    method: 'POST',
    body:param,
  });
}

export async function getScore(param) {
  return request(createTheURL(Config.API.SCORE, 'get'), {
    method: 'GET',
    body:param,
  });
}

export async function setScore(param) {
  return request(createTheURL(Config.API.SCORE, 'set'), {
    method: 'PUT',
    body:param,
  });
}

export async function processProject(param) {
  return request(createTheURL(Config.API.PROJECTSTATICS, 'processProject'), {
    method: 'GET',
    body:param,
  });
}

export async function selfProject(param) {
  return request(createTheURL(Config.API.PROJECTSTATICS, 'selfProject'), {
    method: 'GET',
    body:param,
  });
}


