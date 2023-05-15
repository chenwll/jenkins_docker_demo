import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function deleteItemsById(params){
  return request(createTheURL(Config.API.DICT,`item/${params.id}`),{
    method:'DELETE',
    body:params
  })
}
export async function getItemsById(params){
  return request(createTheURL(Config.API.DICT,`item/${params.id}`),{
    method:'GET',
    body:params
  })
}
export async function getDictionaryItemsByType(params) {
     return request(createTheURL(Config.API.DICT,`type/`),{
       method:'GET',
       body:params
     })
}

export async function getDictionaryItemsBySearch(params) {
  return request(createTheURL(Config.API.DICT,`item/page`),{
    method:'GET',
    body:params
  })
}

export async function getDictionaryList(params) {
  return request(createTheURL(Config.API.DICT, 'getAll'), {
    method: 'GET',
    body:params
  });
};
export async function getDictionaryByPage(params) {
  return request(createTheURL(Config.API.DICT, `page?`), {
    method: 'GET',
    body:params
  });
};
export async function getDataDictionaryDetailInfo(params) {
  return request(createTheURL(Config.API.DICT, `get/`), {
    method: 'GET',
    body:params
  });
};

export async function editDictionaryItems(params){
  return request(createTheURL(Config.API.DICT, 'item'), {
    method: 'PUT',
    body:params
  });
}
export async function editDataDict(params) {
  return request(createTheURL(Config.API.DICT, 'update'), {
    method: 'PUT',
    body:params
  });
};

export async function addDictionaryItems(params){
  return request(createTheURL(Config.API.DICT, 'item'), {
    method: 'POST',
    body:params
  });
}

export async function addDataDict(params) {

  return request(createTheURL(Config.API.DICT, 'add'), {
    method: 'POST',
    body:params
  });
};

export async function delDataDict(params) {
  console.log("pa",params)
  return request(createTheURL(Config.API.DICT, `del/?id=${params.id}`), {
    method: 'DELETE',
    body:params
  });
};

//在basicdata中使用不允许修改
export async function getDictionaryAll(params) {
  return request(createTheURL(Config.API.DATADICT, 'getAll'), {
    method: 'GET',
    body:params
  });
};
