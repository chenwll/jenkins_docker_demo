import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';
import { REQUEST_HEADER_LIST } from '../utils/request/requestHeader';

export async function fetch(params){
  return request(createTheURL(Config.API.PROJECTEXPERT,'list'),{
    method:'GET',
    body:params
  })
}

export async function expertDistrbution(params){
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

export async function getAllExpert(params){
  return request(createTheURL(Config.API.EXPERT,'all'),{
    method:'GET',
    body:params
  })
}

export async function getExpertGroup(params){
  return request(createTheURL(Config.API.EXPERTGROUP,'all'),{
    method:'GET',
    body:params
  })
}

export async function getScoreDetail(params){
  return request(createTheURL(Config.API.SCORE,'listScore'),{
    method:'PUT',
    body:params
  })
}


export async function getDepartmentDetail(params){
  return request(createTheURL(Config.API.PROJECTREFS,'listRefs'),{
    method:'PUT',
    body:params
  })
}

export async function exportRecommed(params){
  return request(createTheURL(Config.API.PROJECTREFS,'excelRefs'),{
    method:'GET',
    body:params
  },REQUEST_HEADER_LIST.EXPORT_TYPE)
}

export async function exportScore(params){
  return request(createTheURL(Config.API.SCORE, 'excelScore'), {
    method: 'GET',
    body:params
  },REQUEST_HEADER_LIST.EXPORT_TYPE);
}

