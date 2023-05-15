import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';


export async function getAnnexList(param) {
  return request(createTheURL(Config.API.ANNEX, 'list'), {
    method: 'GET',
    body:param,
  });
}


export async function addAnnex(param) {
  return request(createTheURL(Config.API.ANNEX, 'add'), {
    method: 'POST',
    body:param,
  });
}


export async function submitAnnex(param) {
  return request(createTheURL(Config.API.ANNEX, 'submit'), {
    method: 'POST',
    body: param,
    params:param,
  });
}



export async function editAnnex(param) {
  return request(createTheURL(Config.API.ANNEX, 'edit'), {
    method: 'POST',
    body:param,
  });
}


export async function deleteAnnex(param) {
  return request(createTheURL(Config.API.ANNEX, 'del'), {
    method: 'POST',
    body:param,
  });
}

