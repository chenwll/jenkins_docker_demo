import { message } from 'antd';
import { getRoleList,editRole,addRole,delRole,getRole} from '@/services/roleSetting';

export default {
  namespace:'roleSettingModel',
  state: {
    allRoleData: [],
    departmentData: [],
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    detailData: {},
  },
  effects: {
    * fetchList({payload}, { call, put }) {
      const response = yield call(getRoleList,payload);
      const { data : { rows, pageNum, pageSize, total } } = response;
      const list = response.data;
      const pagination = {
        page : pageNum,
        pageSize ,
        total ,
      };
      const result = {
        list
      };
      yield put({
        type : 'save',
        payload :{
          allRoleData:list
        }
      });
    },

    *editRole({payload},{call,put}){
      const response = yield call(editRole, payload.data);
      if(response.code===0){
        message.success('信息修改成功')
        yield put({
          type: 'fetchList',
          payload: payload.pagination,
        });
      }
      else{
        message.error('信息修改失败')
      }
    },

    *addRole({payload},{call,put}){
      const response = yield call(addRole, payload.data);
      if(response.code===0){
        message.success('新建角色成功')
        yield put({
          type: 'fetchList',
          payload: payload.pagination,
        });
      }
      else{
        message.error('新建角色失败')
      }
    },

    *delRole({payload},{call,put}){
      const response = yield call(delRole, payload.record);
      if(response.code===0){
        message.success('删除成功')
        yield put({
          type: 'fetchList',
          payload: payload.pagination,
        });
      }
      else{
        message.error('删除失败')
      }
    },

    *getRoleInfo({payload},{call,put}){
      const response=yield call(getRole,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            detailData:response.data
          }
        })
      }
    },

  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
