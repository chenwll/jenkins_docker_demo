import request from '@/utils/request/request';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function fetch(params){
  return request(createTheURL(Config.API.ENEWS,'list'),{
    method:'GET',
    body:params
  })
}

export async function addNews(params) {
  return request(createTheURL(Config.API.ENEWS,'add'),{
    method: 'POST',
    body:params
  })
}

export async function editNews(params) {
  return request(createTheURL(Config.API.ENEWS,'edit'),{
    method: 'PUT',
    body:params
  })
}

export async function getNews(params) {
  return request(createTheURL(Config.API.ENEWS,'get'),{
    method: 'GET',
    body:params
  })
}

export async function delNews(params) {
  return request(createTheURL(Config.API.ENEWS,'del'),{
    method: 'DELETE',
    body:params
  })
}

export async function publishNews(params) {
  return request(createTheURL(Config.API.ENEWS,'state'),{
    method: 'PUT',
    body:params
  })
}
