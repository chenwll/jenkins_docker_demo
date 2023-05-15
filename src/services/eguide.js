import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import  {REQUEST_HEADER_LIST} from '../utils/request/requestHeader'
import remoteLinkAddress, {GLOBAL_URL} from '@/utils/ip'
import { TASK_COMMMIT_TYPE } from '@/utils/Enum';

export async function queryList(param) {
  return request(createTheURL(Config.API.REGGUIDE, 'page'), {
    method: 'GET',
    body:param,
  });
}

export async function queryList_USER(param) {
  return request(createTheURL(Config.API.REGGUIDE, 'user/page'), {
    method: 'GET',
    body:param,
  });
}

export async function getGuideById(param) {
  return request(createTheURL(Config.API.GUIDE, 'get'), {
    method: 'GET',
    body:param,
  });
}

export async function queryUserList(param) {
  return request(createTheURL(Config.API.REGGUIDE, 'user/page'), {
    method: 'GET',
    body:param,
  });
}

export async function queryAll(param) {
  // return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'all'), {
  //   method: 'GET',
  //   body:param,
  // });
}

export async function queryRegAll(param) {
  return request(createTheURL(Config.API.REGGUIDE, 'all'), {
    method: 'GET',
    body:param,
  });
}

export async function getDetail(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'get'), {
    method: 'GET',
    body:param,
  });
}
export async function editGuide(param) {
  return request(`${remoteLinkAddress()}${Config.API.GUIDE}`, {
    method: 'PUT',
    body:param,
  });
}
export async function addGuide(param) {
  return request(`${remoteLinkAddress()}${Config.API.GUIDE}`, {
    method: 'POST',
    body:param,
  });
}
export async function deleteGuide(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE,  `${param.guideId}`), {
    method: 'DELETE',
    body:param,
  });
}
export async function nextState(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'nextState'), {
    method: 'PUT',
    body:param,
  });
}
export async function revoke(param) {
  return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE, 'revoke'), {
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

export async function getAllTasks_ADMIN(param) {
  return request(createTheURL(Config.API.EVALUATIONDEPT, 'admin/list'), {
    method: 'GET',
    body:param,
  });
}

export async function getAllTasks(param) {
  return request(createTheURL(Config.API.EVALUATIONDEPT, 'list/info/user'), {
    method: 'GET',
    body:param,
  });
}

export async function editTaskDetail(param){
  return request(createTheURL(Config.API.EVALUATIONDEPT,'task'),{
    method:'PUT',
    body:param,
  })
}

export async function getAllDepartment(param) {
  return request(createTheURL(Config.API.DEPT, 'tree'), {
    method: 'GET',
  });
}

export async function getEvaluationDept_ADMIN(param){
  return request(createTheURL(Config.API.EVALUATIONDEPT,'lead/depts'),{
    method:"GET",
    body:param
  })
}

export async function getEvaluationDept_USER(param){
  return request(createTheURL(Config.API.EVALUATIONDEPT,'list/info'),{
    method:"GET",
    body:param
  })
}

export async function getEvaluationDeptById(param){
  return request(createTheURL(Config.API.EVALUATIONDEPT,'get'),{
    method:"GET",
    body:param
  })
}

export async function addEvaluationDept_ADMIN(param){
  return request(createTheURL(Config.API.EVALUATIONDEPT,'admin/set'),{
    method:'POST',
    body:param
  })
}

export async function addEvaluationDept_USER(param){
  return request(createTheURL(Config.API.EVALUATIONDEPT,'add'),{
    method:'POST',
    body:param
  })
}

export async function editEvaluationDept(param){
  return request(createTheURL(Config.API.EVALUATION,'dept/task'),{
    method:'PUT',
    body:param
  })
}

export async function deleteEvaluationDept(param){
  return request(createTheURL(Config.API.EVALUATION,`dept/delete?taskId=${param}`),{
    method:'DELETE',
  })
}

export async function getTaskCommitById(param){
  return request(createTheURL(Config.API.TASKCOMMIT,'page'),{
    method:'GET',
    body:param
  })
}

export async function addTaskCommit(param){
  return request(`${remoteLinkAddress()}${Config.API.TASKCOMMIT}`,{
    method:'Post',
    body:param
  })
}

export async function deleteTaskCommit(param){
  return request(createTheURL(Config.API.TASKCOMMIT,`${param}`),{
    method:'Delete',
  })
}

export async function getProviderList() {
  return request();
}

export async function addReviewYear(param){
 return request(createTheURL(Config.API.EDUCATIONDEPARTMENTGUIDE,'setReviewYears'),{
   method: 'PUT',
   body:param,
 });
}
