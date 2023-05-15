import { message } from 'antd';
import * as UserSettingService from '@/services/UserSetting';

export default {
  namespace:'UserSettingModel',
  state: {
    UsersData: [],
    pagination: {
      total: 0,
      current:1,
      size:20,
    },
    allRoles:[],
    detailData: {},
    selectedRows:[],//用来处理新建之后的表格选中问题
  },
  effects: {
    * getList({ payload }, { call, put }) {//分页获取用户的信息
      payload = payload ? payload : { currentpage : 1 };
      const response = yield call(UserSettingService.getUserList, payload);
      console.log("* getList,listPage",payload,response)
      const { data : { records, current, size, total } } = response;
      const pagination = {
        current,
        size,
        total,
      };
      yield put({
        type : 'save',
        payload : {
          UsersData:records,
          pagination
        },
      });
    },

    *changeInfo({payload},{call,put}){
      const response = yield call(UserSettingService.changeInfo, payload.data);
      if(response.code===0){
        message.success('信息修改成功')
        yield put({
          type: 'getList',
          payload: payload.pagination,
        });
      }
      else{
        message.error('信息修改失败')
      }
    },

    *addUser({payload},{call,put}){
      const response = yield call(UserSettingService.addUser, payload.data);
      if(response.code===0){
        message.success('新建用户成功')
        yield put({
          type: 'getList',
          payload: payload.pagination,
        });
      }
      else{
        message.error('新建用户失败')
      }
    },

    *delUser({payload},{call,put}){
      const response = yield call(UserSettingService.delUser, payload.id);
      if(response.code===0){
        message.success('删除成功')
        yield put({
          type: 'getList',
          payload: payload.pagination,
        });
      }
      else{
        message.error('删除失败')
      }
    },

    *getUser({payload},{call,put}){
      const response=yield call(UserSettingService.getUser,payload);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            detailData:response.data
          }
        })
      }
    },

    //重置密码时后端接口有问题，等待更新!!!
    *resetPassWord({payload},{call,put}){
      const {id,...data}=payload
      console.log("*resetPassWord,payload",payload)
      const response=yield call(UserSettingService.resetPassWord,{id});
      if(response.code===0){
        message.success('密码重置成功为8个8')
        yield put({
          type:'getList',
          payload:{
            ...data
          },
        })
      }
    },

    *getAllRole({payload},{call,put}){
      const respone=yield call(UserSettingService.getAllRole);
      console.log("*getAllRole",respone)
      yield put({
        type:'save',
        payload:{
          allRoles:respone.data//role 用all之后的数据
        },
      })
    },

  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },

    cleanGetDetail(state,){
      return{
        ...state,
        detailData:{}
      }
    }
  },
};
