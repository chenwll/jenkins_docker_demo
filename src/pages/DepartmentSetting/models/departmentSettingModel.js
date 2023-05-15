import {message} from 'antd';
import * as DepartmentSettingService from '@/services/departmentSetting';
import { isDepartmentType } from '@/utils/utils';


export default {
  namespace:'departmentSettingModel',
  state:{
    data:[],
    allUser:[],
    allData:[],
    pagination:{},
    DepartmentDetail:{}
  },

  effects:{
    *getAllDepartment({payload},{call,put}){
      const response=yield call(DepartmentSettingService.getDepartmentByType,payload);
      const {data}=response;
      yield put({
        type:'save',
        payload:{
          allData:data
        }
      })
    },

    *editDepartment({payload},{call,put}){
      const response=yield call(DepartmentSettingService.editDepartment,payload);
      if(response.code===0){
        message.success('数据更新成功')
      }
      yield put({
        type:'getAllDepartment',
        payload:{
          department_type:isDepartmentType()
        }
      })
    },

    *getDepartmentDetail({payload},{call,put}){
      const reponse=yield call(DepartmentSettingService.getDepartmentDetail,payload);
      yield put({
        type:'save',
        payload:{
          DepartmentDetail:reponse.data
        }
      })
    },

    *delDepartment({payload},{call,put}){
      const response=yield call(DepartmentSettingService.delDepartment,payload);
      if(response.code===0){
        message.success('数据删除成功');
      }
      yield put({
        type:'getAllDepartment',
        payload:{
          department_type:isDepartmentType()
        }
      })
    },

    *addDepartment({payload},{call,put}){
      const response=yield call(DepartmentSettingService.addDepartment,payload);
      if(response.code===0){
        message.success('数据新增成功');
      }
      yield put({
        type:'getAllDepartment',
        payload:{
          department_type:isDepartmentType()
        }
      })
    },

    *getAllUser({payload},{call,put}){
      const response=yield call(DepartmentSettingService.getAllUser);
      yield put({
        type:'save',
        payload:{
          allUser:response.data
        }
      })
    }
  },

  reducers:{
    save(state,{payload}){
      return(
        {
          ...state,
          ...payload
        }
      )
    },
    cleanGetData(state){
      return{
        ...state,
        DepartmentDetail:{},
      }
    },
  },
}
