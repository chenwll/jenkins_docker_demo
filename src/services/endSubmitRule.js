import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import remoteLinkAddress from '@/utils/ip';

export async function getRule(param) {
  return request(createTheURL(Config.API.ERULES, 'tree'), {
    method: 'GET',
    body:param,
  });
}

export async function addRule(param) {
  return request(createTheURL('/evaluation', 'rule'), {
    method: 'POST',
    body:param,
  });
}

export async function editRule(param) {
  return request(createTheURL('/evaluation', 'rule'), {
    method: 'PUT',
    body:param,
  });
}

export async function deleteRule(param) {
  return request(createTheURL(Config.API.ERULES, `delete?ruleId=${param.ruleId}`), {
    method: 'DELETE',
    body:param,
  });
}

export async function deleteRuleSystem(param) {
  return request(remoteLinkAddress() + `/evaluation?rootRule=${param.rootRule}`, {
    method: 'DELETE',
    // body:param,
  });
}

export async function allRule() {
  return request(createTheURL(Config.API.EVALUATION, 'all'), {
    method: 'GET',
  });
}

export async function getItem(param) {
  return request(createTheURL(Config.API.ERULES, 'get'), {
    method: 'GET',
    body:param
  });
}

export async function getItemTree(param) {
  return request(createTheURL(Config.API.ERULES, 'tree'), {
    method: 'GET',
    body:param,
  });
}

export async function getRulesPage(param) {
  return request(createTheURL(Config.API.ERULES, 'page'), {
    method: 'GET',
    body:param,
  });
}

export async function copyTreeNode(param) {
  return request(createTheURL(Config.API.ERULES, 'tree/cp'), {
    method: 'GET',
    body:param,
  });
}
