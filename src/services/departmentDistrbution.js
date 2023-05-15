import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function fetch(params){
  return request(createTheURL(Config.API.PROJECTDISTRBUTION,'all'),{
    method:'GET',
    body:params
  })
}

export async function getAllDep() {
  return request(createTheURL(Config.API.EDEPARTMENT, 'all'), {
    method: 'GET',
  });
}

export async function departmentDistrbution(params){
  return request(createTheURL(Config.API.PROJECTDISTRBUTION,'set'),{
    method:'POST',
    body:params
  })
}

export async function cancelDistrbution(params){
  return request(createTheURL(Config.API.PROJECTDISTRBUTION,'cancel'),{
    method:'PUT',
    body:params
  })
}
