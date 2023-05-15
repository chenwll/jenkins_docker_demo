import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'

export async function guideScoreRuleAll(param) {
  return request(createTheURL(Config.API.ESRULES, 'all'), {
    method: 'GET',
    body:param,
  });
}

export async function guideScoreRuleList(param) {
  return request(createTheURL(Config.API.ESRULES, 'list'), {
    method: 'GET',
    body:param,
  });
}

export async function guideScoreRuleCopy(param) {
  return request(createTheURL(Config.API.ESRULES, 'copyRules'), {
    method: 'POST',
    body:param,
  });
}

export async function guideScoreRuleDel(param) {
  return request(createTheURL(Config.API.ESRULES, 'del'), {
    method: 'DELETE',
    body:param,
  });
}

export async function guideScoreRuleTree(param) {
  return request(createTheURL(Config.API.ESRULES, 'getTree'), {
    method: 'GET',
    body:param,
  });
}

export async function guideScoreRuleGet(param) {
  return request(createTheURL(Config.API.ESRULES, 'get'), {
    method: 'GET',
    body:param,
  });
}

export async function guideScoreRuleEdit(param) {
  return request(createTheURL(Config.API.ESRULES, 'edit'), {
    method: 'PUT',
    body:param,
  });
}
