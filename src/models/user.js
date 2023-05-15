import { query as queryUsers } from '@/services/user';
import { queryCurrent } from '@/services/api';
import { routerRedux } from 'dva/router';
import * as basicDataAPI from '@/services/basicdata';

export default {
  namespace : 'user',

  state : {
    list : [],
    currentUser : {},
    currentData:{},
    userData:{},
    userMessage:{},
    roleName:''
  },

  effects : {
    * fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type : 'save',
        payload : response,
      });
    },
    * fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
        console.log('* fetchCurrent,payload,response',response);
      const { code } = response;
      if (code == 0) {
        const { data } = response;
        const { sysUser:{ nickname }, roles} = data;
        const _currentUser = {
          name : nickname,
          role: roles[0],
          unreadCount : 8,
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        };
        yield put({
          type:'saveRoleName',
          payload:data.roleNames[0]
        })
        yield put({
          type : 'saveCurrentUser',
          payload : _currentUser,
        });
        yield put({
          type : 'saveUserMessage',
          payload : response.data,
        });
        yield put({
          type : 'saveUserData',
          payload : data,
        });
        ///获取basicdata中的数据
        yield put({
          type : 'basicdata/getDict',
          payload : {},
        });
        yield put({
          type : 'basicdata/getUserList',
          payload : {},
        });
        yield put(routerRedux.push('/DashBoard'));
      }
      else{
        yield put(routerRedux.push('/index'));
      }
    },
    *getUserData(_,{call,put}){
      const response = yield call(queryCurrent);
      const {code} = response;
      if(code == 0){
        yield put({
          type:'saveUserData',
          payload:response.data,
        })
      }
    }
  },

  reducers : {
    save(state, action) {
      return {
        ...state,
        list : action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser : action.payload || {},
      };
    },
    saveRoleName(state,action) {
      return {
        ...state,
        roleName:action.payload,
      }
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser : {
          ...state.currentUser,
          notifyCount : action.payload.totalCount,
          unreadCount : action.payload.unreadCount,
        },
      };
    },
    saveUserData(state,action){
      return{
        ...state,
        userData:action.payload,
      }
    },
    saveUserMessage(state, action){
      return {
        ...state,
        ...action.payload,
      };
    }
  },
};
