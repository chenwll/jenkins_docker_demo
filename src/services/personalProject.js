import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function addProject(param) {
  return request(createTheURL(Config.API.APPLICATION, 'add'), {
    method: 'POST',
    body:param,
  });
}

export async function queryList(param){
  return request(createTheURL(Config.API.APPLICATION,'all'),{
    method: 'GET',
    body:param,
  })
}

export async function listAll(param){
  return request(createTheURL(Config.API.APPLICATION,'list'),{
    method: 'GET',
    body:param,
  })
}

export async function delPrj(param){
  return request(createTheURL(Config.API.APPLICATION,'del'),{
    method: 'DELETE',
    body:param,
  })
}

export async function editPrj(param){
  return request(createTheURL(Config.API.APPLICATION,'edit'),{
    method: 'PUT',
    body:param,
  })
}

export async function getProjectContact(param) {
  return request(createTheURL(Config.API.PROJECTPERSON,'prj'),{
    method: 'GET',
    body:param,
  })
}


export async function getProjectMonth(param){
  return request(createTheURL(Config.API.MONTH,'list'),{
    method: 'GET',
    body:param,
  })
}
export async function getProjectMonthDetail(param){
  return request(createTheURL(Config.API.MONTH,'get'),{
    method: 'GET',
    body:param,
  })
}

export async function delProjectMonth(param){
  return request(createTheURL(Config.API.MONTH,'del'),{
    method: 'DELETE',
    body:param,
  })
}

export async function addProjectMonth(param){
  return request(createTheURL(Config.API.MONTH,'add'),{
    method:'POST',
    body:param,
  })
}

export async function getProjectDetail(param){
  return request(createTheURL(Config.API.APPLICATION,'get'),{
    method: 'GET',
    body:param,
  })
}

export async function addPrjContact(param){
  return request(createTheURL(Config.API.PROJECTPERSON,'add'),{
    method: 'POST',
      body:param,
  })
}

export async function getContactDetail(param){
  return request(createTheURL(Config.API.PROJECTPERSON,'get'),{
    method: 'GET',
    body:param,
  })
}

export async function editContactDetail(param){
  return request(createTheURL(Config.API.PROJECTPERSON,'edit'),{
    method: 'PUT',
    body:param,
  })
}

export async function delContact(param){
  return request(createTheURL(Config.API.PROJECTPERSON,'del'),{
    method: 'DELETE',
    body:param,
  })
}

export async function commitPrj(param){
  return request(createTheURL(Config.API.APPLICATION,'commit'),{
    method: 'PUT',
    body:param,
  })
}

export async function cancelPrjSubmit(param){
  return request(createTheURL(Config.API.APPLICATION,'cancel'),{
    method:'PUT',
    body:param,
  })
}

export async function addProjectImplementationPlan(param) {
  return request(createTheURL(Config.API.APPLICATION,'addScheme'),{
    method:'POST',
    body:param,
  })
}

export async function editProjectImplementationPlan(param){
  return request(createTheURL(Config.API.APPLICATION,'editScheme'),{
    method:'PUT',
    body:param,
  })
}

export async function getProjectImplementationPlan(param){
  return request(createTheURL(Config.API.APPLICATION,'getScheme'),{
    method:'GET',
    body:param,
  })
}

export async function submitImplementationPlan(param){
  return request(createTheURL(Config.API.APPLICATION,'commitScheme'),{
    method:'PUT',
    body:param,
  })
}

export async function delImplementationPlan(param){
  return request(createTheURL(Config.API.APPLICATION,'delScheme'),{
    method:'DELETE',
    body:param,
  })
}

export async function cancelSubmitProjectImplementationPlan(param){
  return request(createTheURL(Config.API.APPLICATION,'cancelScheme'),{
    method:'PUT',
    body:param,
  })
}
export async function applyReview(param) {
  return request(createTheURL(Config.API.APPLICATION, 'conApply'), {
    method: 'GET',
    body:param,
  });
}
