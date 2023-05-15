import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getRule(param) {
  return request(createTheURL(Config.API.EXPGUIDE, 'score/get'), {
    method: 'GET',
    body:param,
  });
}

export async function setScore(param) {
  return request(createTheURL(Config.API.EXPGUIDE, 'score/set'), {
    method: 'PUT',
    body:param,
  });
}

export async function setSubmit(param) {
  return request(createTheURL(Config.API.EXPGUIDE, 'score/commit'), {
    method: 'PUT',
    body:param,
  });
}

