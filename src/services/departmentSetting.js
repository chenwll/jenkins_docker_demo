import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

// export async function getDepartmentList(params) {
//   return request(createTheURL(Config.API.EDEPARTMENT, 'list'), {
//     method: 'GET',
//     body:params
//   });
// };

export async function getDepartmentDetail(params) {
  return request(createTheURL(Config.API.DEPT, 'get'), {
    method: 'GET',
    body:params
  });
};

export async function editDepartment(params) {
  return request(createTheURL(Config.API.DEPT, 'edit'), {
    method: 'PUT',
    body:params
  });
};

export async function getDepartmentByType(params) {
  return request(createTheURL(Config.API.DEPT, 'tree/type'), {
    method: 'GET',
    body: params
  });
};

export async function getAllDepartment() {
  return request(createTheURL(Config.API.DEPT, 'tree'), {
    method: 'GET',
  });
};
export async function addDepartment(params) {
  return request(createTheURL(Config.API.DEPT, 'add'), {
    method: 'POST',
    body:params
  });
};

export async function delDepartment(params) {
  return request(createTheURL(Config.API.DEPT, `del?departId=${params.departId}`), {
    method: 'DELETE',
    // body:params
  });
};


export async function getAllUser() {
  return request(createTheURL(Config.API.USER,'list'),{
    method: 'GET',
  })
};

//regProjectApprovalModal中需要使用
export async function getAllData() {
  return request(createTheURL(Config.API.DEPT, 'all'), {
    method: 'GET',
  });
};
