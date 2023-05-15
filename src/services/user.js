import request from '@/utils/request/request';
import remoteLinkAddress, { GLOBAL_URL } from '@/utils/ip';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getUserList(params) {
  return request(createTheURL(Config.API.USER, 'list'), {
    method: 'GET',
    body: params,
  });
}

export async function getAllrole(params) {
  return request(`${GLOBAL_URL}/api/roles/allrole`, {
      method: 'GET',
      body: params,
    },
  );
}

export async function updateUser(params) {
  return request(`${GLOBAL_URL}/api/users/edit`, {
      method: 'POST',
      body: params,
    },
  );
}

export async function getDepartmentList() {
  return request(createTheURL(Config.API.DEPT,'tree'), {
      method: 'GET',
    },
  );
}

export async function getUser(params) {
  return request(createTheURL(Config.API.USER, 'get'), {
    method: 'GET',
    body: params,
  });
}

export async function deleteUser(params) {
  return request(createTheURL(Config.API.USER, 'del'), {
    method: 'GET',
    body: params,
  });
}


export async function addUser(params) {
  return request(createTheURL(Config.API.USER, 'add'), {
    method: 'POST',
    body: params,
  });
}

export async function getCurrentUser() {
  return request(remoteLinkAddress() + Config.API.USERINFO, {
    method: 'GET',
  });
}


export async function editUser(params){
  return request(remoteLinkAddress() + Config.API.USER, {
    method: 'PUT',
    body: params,
  });
}

export async function editPassword(params){
  return request(createTheURL(Config.API.USER, 'changePsw'), {
    method: 'PUT',
    body: params,
  });
}

