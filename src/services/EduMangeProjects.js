import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function fetch(params) {
  return request(createTheURL(Config.API.STATIS, 'stage'), {
    method: 'GET',
    body:params
  });
};

export async function getProcess(params) {
  return request(createTheURL(Config.API.STATIS, 'process'), {
    method: 'GET',
    // body:params
  });
};

export async function addProjects(params) {
  return request(createTheURL(Config.API.WITHDRAW, 'newProject'), {
    method: 'POST',
    body:params
  });
};

export async function getProcessAll(params) {
  return request(createTheURL(Config.API.GUIDEFLOW, 'all'), {
    method: 'GET',
    body:params
  });
};


export async function addPerson(params) {
  return request(createTheURL(Config.API.WITHDRAW, 'addPerson'), {
    method: 'POST',
    body:params
  });
};


export async function getProjectDetail(param) {
  return request(createTheURL(Config.API.WITHDRAW,'getProject'),{
    method: 'GET',
    body:param,
  })
}

export async function getProjectContact(param) {
  return request(createTheURL(Config.API.PROJECTPERSON,'prj'),{
    method: 'GET',
    body:param,
  })
};

export async function editProject(param) {
  console.log(param);
  return request(createTheURL(Config.API.WITHDRAW,'editProject'),{
    method: 'POST',
    body:param,
  })
}
