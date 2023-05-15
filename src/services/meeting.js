import request from '@/utils/request/request';
import GLOBAL_URL from '@/utils/ip';

export async function getMeetingList(params) {
  return request(`${GLOBAL_URL}/api/meeting/list`, {
    method: 'GET',
    body: params
  });
}

export async function postMeetingAdd(params) {
  return request(`${GLOBAL_URL}/api/meeting/add`, {
    method: 'POST',
    body: params
  });
}

export async function getMeetingAll(params) {
  return request(`${GLOBAL_URL}/api/meeting/all`, {
    method: 'GET',
    body: params
  });
}

export async function getMeetingDel(params) {
  return request(`${GLOBAL_URL}/api/meeting/del`, {
    method: 'GET',
    body: params
  });
}

export async function postMeetingEdit(params) {
  return request(`${GLOBAL_URL}/api/meeting/edit`, {
    method: 'POST',
    body: params
  });
}

export async function getMeetingGet(params) {
  return request(`${GLOBAL_URL}/api/meeting/get`, {
    method: 'GET',
    body: params
  });
}

export async function getMeetingConfigAll(params) {
  return request(`${GLOBAL_URL}/api/meetingConfig/all`, {
    method: 'GET',
    body: params
  });
}
