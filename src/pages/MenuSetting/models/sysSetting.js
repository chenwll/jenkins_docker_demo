import {message} from 'antd';
import { getAllList,addChildMenu ,delChooseMenu,updateChooseMenu,getMenu} from '../../../services/sysSetting';

export default {
  namespace:'sysSetting',
  state:{
    listAll:[],
    drawerMenuData:{}
  },
  effects:{
    *updateData({payload},{call,put}){
      const {data}=payload
      yield put({
        type:'updateDataInit',
        payload:data
      })
    },

    *listAll({payload},{ call, put}) {
      const response=yield call(getAllList);
      yield put ({
        type: 'saveData',
        payload: {
          data: response.data,
        },
      });
    },
    *addMenu({payload},{call,put}){
      const response=yield call(addChildMenu,payload);
      if(response.code===0){
        message.success("新增成功")
        const response1=yield call(getAllList);
        yield put ({
          type: 'saveData',
          payload: {
            data: response1.data,
          },
        });
      }
      else{
        message.error("新增失败")
      }
    },
    *delMenu({payload},{call,put}){
      const response=yield call(delChooseMenu,payload);
      if(response.code===0){
        message.success("删除成功")
        const response1=yield call(getAllList);
        yield put ({
          type: 'saveData',
          payload: {
            data: response1.data,
          },
        });
      }
      else{
        message.error("删除失败")
      }
    },

    *updateMenu({payload},{call,put}){
      const response=yield call(updateChooseMenu,payload);
      if(response.code===0){
        message.success("更新成功")
        const response1=yield call(getAllList);
        yield put ({
          type: 'saveData',
          payload: {
            data: response1.data,
          },
        });
      }
      else{
        message.error("更新失败")
      }
    },

    *getMenu({payload},{call,put}){
      const response=yield call(getMenu,payload);
      if(response.code===0){
        yield put({
          type:'saveMenuData',
          payload:{
            data:response.data
          }
        })
      }
    }
  },
  reducers:{

    updateDataInit(state,{payload}){
      return{
        ...state,
        drawerMenuData:payload
      }
    },

    saveData(state, { payload }) {
      const { data } = payload;
      return{
        ...state,
        listAll:data
      }
    },

    saveMenuData(state,{payload}){
      return{
        ...state,
        drawerMenuData:payload.data
      }
    }
  }
}
