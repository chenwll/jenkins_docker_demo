import * as userService from '@/services/user';
import * as registerService from '@/services/register';
import * as schoolSetting from '@/services/schoolSetting'
import {message} from 'antd';
import router from 'umi/router';
import index from '@/pages/EduMangeProjects/CreateProjectsStep';

export default {
  namespace: 'centerModel',

  state: {
    currentUserdata: {},
    visiblePersonInfo: false,
    eduDepartmentData: {},
    schoolData: [],
  },

  effects: {
    * getCurrentUser({payload}, {call, put}) {
      const response = yield call(userService.getCurrentUser, payload);
      const userData = {
        ...response.data.sysUser,
        role:response.data.roles
      }
      yield put({
        type: 'saveCurrentUser',
        payload: userData,
      });
    },
    * getEduDepartment({payload}, {call, put}) {
      const response = yield call(registerService.getEduDepartment, payload);
      const { data } = response
      let child = []
      let allData = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if(element.id === 1){
          //确定绵阳市部门位置
          allData = data[index]
          child = [...child,...element.children]
        }else{
          child.push(element)
        }
      }
      allData.children = child
      yield put({
        type: 'save',
        payload: {
          eduDepartmentData: allData,
        },
      })
    },
    * getSchoolData(_, {call, put}) {
      const response = yield call(schoolSetting.getAll);
      yield put({
        type: 'save',
        payload: {
          schoolData: response.data,
        },
      })
    },
    * editUser({payload}, {call}) {
      const response = yield call(userService.editUser, payload);
      if (response.code === 0) {
        message.success('数据修改成功，请重新登录!');
        router.push(`/user/login`);
      }
      else {
        message.error('数据修改失败!');
      }
    },
    * editPassword({payload}, {call}) {
      const response = yield call(userService.editPassword, payload);
      if(response !== undefined){
        if (response.code == 0) {
          message.success('修改密码成功，请重新登录!');
          router.push(`/user/login`);
        }
        else {
          message.error('修改密码失败!');
        }
      }else {
        message.error('原密码错误!');
      }

    },


  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUserdata: action.payload,
      };
    },
    hiddenModal(state) {
      return {
        ...state,
        visiblePersonInfo: false,
      };
    },
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    showModal(state) {
      return {
        ...state,
        visiblePersonInfo: true,
      };
    },
  },
};
