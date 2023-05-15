import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function queryList(param) {
  return request(createTheURL(Config.API.COMMIT, 'rule'), {
    method: 'GET',
    body:param,
  });
}

export async function getRuleTask(param) {
  return request(createTheURL(Config.API.COMMIT,'task'), {
    method: 'GET',
    body:param,
  });
}

export async function uploadFile(param) {
  return request(createTheURL(Config.API.FILE,'upload'), {
    method: 'POST',
    body:param,
  });
}

export async function commitTask(param) {
  return request(createTheURL(Config.API.COMMIT,'save'), {
    method: 'PUT',
    body:param,
  });
}

export async function removeUploadFile(param) {
  return request(createTheURL(Config.API.FILE,`del?fileName=${  param.fileName}`), {
    method: 'DELETE',
  });
}

export async function getCommitDetail(param) {
  return request(createTheURL(Config.API.COMMIT,'detail'), {
    method: 'GET',
    body:param
  });
}

export async function bindFileAndTaskCommit(param) {
  return request(createTheURL(Config.API.COMMIT,'add'), {
    method:'PUT',
    body:param
  });
}

export async function changeReportStateToCommit(param) {
  return request(createTheURL(Config.API.COMMIT,`submit?commitReportId=${  param.commitReportId}`), {
    method:'PUT',
    body:param
  });
}

export async function unbindFileAndTaskCommit(param) {
  return request(createTheURL(Config.API.COMMIT,`delete?commitInfoId=${  param.commitInfoId}`), {
    method:'DELETE',
  });
}

export async function getFileMessageById(param) {
  console.log('server',param);
  return request(createTheURL(Config.API.FILE,'fileIds'), {
    method: 'GET',
    body:param
  });
}

export async function queryAll(param) {
  return request(createTheURL(Config.API.APPLICANTGUIDE, 'all'), {
    method: 'GET',
    body:param,
  });
}

export async function getDetail(param) {
  return request(createTheURL(Config.API.APPLICANTGUIDE, 'get'), {
    method: 'GET',
    body:param,
  });
}
export async function editGuide(param) {
  return request(createTheURL(Config.API.APPLICANTGUIDE, 'edit'), {
    method: 'PUT',
    body:param,
  });
}
export async function addGuide(param) {
  return request(createTheURL(Config.API.APPLICANTGUIDE, 'add'), {
    method: 'POST',
    body:param,
  });
}
export async function deleteGuide(param) {
  return request(createTheURL(Config.API.APPLICANTGUIDE, 'del'), {
    method: 'DELETE',
    body:param,
  });
}
export async function nextState(param) {
  return request(createTheURL(Config.API.APPLICANTGUIDE, 'nextState'), {
    method: 'PUT',
    body:param,
  });
}
export async function revoke(param) {
  return request(createTheURL(Config.API.APPLICANTGUIDE, 'revoke'), {
    method: 'PUT',
    body:param,
  });
}

export async function getState(params) {
  return request(createTheURL(Config.API.DICT, 'all'), {
    method: 'GET',
    body: params
  });
}

export async function allRule(param) {
  return request(createTheURL(Config.API.ERULES, 'all'), {
    method: 'GET',
    body:param,
  });
}

export async function getProviderList() {
  return request();
}
