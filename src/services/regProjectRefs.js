import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'

export async function queryList(param) {
  return request(createTheURL(Config.API.REGPROJECTREF, 'list'), {
    method: 'GET',
    body:param,
  });
}

export async function getDetail(param) {
  return request(createTheURL(Config.API.REGPROJECTREF, 'get'), {
    method: 'GET',
    body:param,
  });
}

export async function add(param) {
  return request(createTheURL(Config.API.REGPROJECTREF, 'add'), {
    method: 'POST',
    body:param,
  });
}

export async function edit(param) {
  return request(createTheURL(Config.API.REGPROJECTREF, 'edit'), {
    method: 'PUT',
    body:param,
  });
}

export async function submit(param) {
  return request(createTheURL(Config.API.REGPROJECTREF, 'submit'), {
    method: 'PUT',
    body:param,
  });
}

export async function set(param) {
  return request(createTheURL(Config.API.REGPROJECTREF, 'set'), {
    method: 'POST',
    body:param,
  });
}

export async function getScore(param) {
  return request(createTheURL(Config.API.REGSCORE, 'get'), {
    method: 'GET',
    body:param,
  });
}

export async function setScore(param) {
  return request(createTheURL(Config.API.REGSCORE, 'set'), {
      method: 'PUT',
    body:param,
  });
}

export async function processProject(param) {
  return request(createTheURL(Config.API.REGSTATICS, 'processProject'), {
    method: 'GET',
    body:param,
  });
}

export async function selfProject(param) {
  return request(createTheURL(Config.API.REGSTATICS, 'selfProject'), {
    method: 'GET',
    body:param,
  });
}
