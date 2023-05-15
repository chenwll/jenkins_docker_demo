import {message} from 'antd';
import * as pointManagementServices from '../../../services/pointManagement.js'

export default {
  namespace:'pointManagementModel',
  state:{
    pointsList:[],
    rolesList:[],
    allPoints:[{position:{ longitude: 104.679127, latitude: 31.467673, }}],
    pointInfo:{},
    pagination:{index:1,size:10},
    departmentsList:[],
    newPoint:{
      position:{
        longitude: 104.679127,
        latitude: 31.467673,
      },
      address: '',
    },
    pictures:[]
  },
  effects:{
    *getPointsList({payload},{call,put}){
      try{
        const response=yield call(pointManagementServices.getPointsList,payload);
        if(response.code===0){
          const {data:{records,total,size,current}}=response;
          const pagination = {index:current,total,size}
          yield put({
            type:'save',
            payload:{
              pointsList:records,
              pagination
            }
          })
        }
      }catch (e) {
        console.log(e,'catch error');
      }
    },
    *getRolesList({payload},{call,put}){
      const response=yield call(pointManagementServices.getRolesList,payload);
      if(response.code===0){
        const {data}=response;
        console.log(data);
        yield put({
          type:'save',
          payload:{
            rolesList:data
          }
        })
      }
    },
    *getAllPoints({payload},{call,put}){
      const response = yield call(pointManagementServices.getAllPoints)
      if(response.code===0){
        const {data}=response;
        yield put({
          type:'save',
          payload:{
            allPoints:data
          }
        })
      }
    },
    *getPoint({payload},{call,put}){
      const response = yield call(pointManagementServices.getPoint,payload)
      if(response.code===0){
        const {data}=response;
        yield put({
          type:'save',
          payload:{
            pointInfo: data,
          }
        })
      }
    },
    *getMiniPicture({payload},{call,put}) {
      const response = yield call(pointManagementServices.getMiniPicture,payload)
      if(response.code === 0){
        const {data} = response;
        yield put({
          type:'save',
          payload:{
            imgUrl:data,
          }
        })
      }
      console.log(response,'mini pic');
    },
    *getDepartments({payload},{call,put}) {
      const response = yield call(pointManagementServices.getDepartments,payload)
      if(response.code === 0){
        const {data} = response;
        yield put({
          type:'save',
          payload:{
            departmentsList:data[0].children,
          }
        })
      }
    },
    *getHomePoint({payload},{call,put}) {
      const response = yield call(pointManagementServices.getHomePoint,payload)
      if(response.code===0){
        const {data}=response;
        yield put({
          type:'save',
          payload:{
            pointInfo: data,
          }
        })
      }
    },
    *addPoint({payload,callback},{call,put,select}){
      try{
        const response = yield call(pointManagementServices.addPoint,payload);
        console.log('xxxxxxxxxxxxxx');
        if(response.code===0){
          const pagination = yield select(state => state.pointManagementModel.pagination);
          yield put({
            type:'getPointsList',
            payload:pagination
          })
          yield put({
            type:'save',
            payload:{newPoint:{
                position:{
                  longitude: 104.679127,
                  latitude: 31.467673,
                },
                address: '',
              },}
          })
          message.success('新增成功')
          callback()
        }
        else message.error('新增失败')
      }catch (e) {
        console.log(e,'add error');
      }
    },
    *deletePoint({payload},{call,put,select}){
      try{
        const response = yield call(pointManagementServices.deletePoint,payload)
        if(response.code===0){
          const {data:{records}}=response;
          const pagination = yield select(state => state.pointManagementModel.pagination);
          yield put({
            type:'save',
            payload:{
              pointsList:records
            }
          })
          yield put({
            type:'getPointsList',
            payload:pagination
          })
          message.success('删除成功')
        }
      }catch (e) {
        message.error('删除失败')
      }
    },
    *savePointInfo({payload},{call}){
      try{
        const response = yield call(pointManagementServices.savePointInfo,payload)
        if(response.code===0) {
          message.success('修改成功')
        }
      }catch (e) {
        console.log(e);
      }
    },
    *editPoint({payload},{call,put}) {
      yield put({
        type: 'editPointInfo',
        payload
      })
    },
    *uploadMiniPicture({payload},{call,put,select}) {
      try{
        const pointInfo = yield select(state => state.pointManagementModel.pointInfo);
        const response = yield call(pointManagementServices.uploadMiniPicture,payload)
        if(response.code === 0) {
          const {data:{fileName}} = response;
          yield put({
            type:'save',
            payload:{
              pointInfo: {...pointInfo, thumbnail:fileName}
            }
          })
        }
      }catch (e) {
        console.log(e);
      }
    },
    *addMiniPicture({payload},{call,put,select}) {
      try{
        const newPoint = yield select(state => state.pointManagementModel.newPoint);
        const response = yield call(pointManagementServices.uploadMiniPicture,payload)
        if(response.code === 0) {
          const {data:{fileName}} = response;
          yield put({
            type:'save',
            payload:{
              newPoint: {...newPoint, thumbnail:fileName}
            }
          })
        }
      }catch (e) {
        console.log(e);
      }
    },
    *deleteMiniPicture({payload},{call,put,select}) {
      try{
        const newPoint = yield select(state => state.pointManagementModel.newPoint);
        const response = yield call(pointManagementServices.deleteMiniPicture,payload)
        if(response.code === 0) {
          message.success('删除成功')
          newPoint.thumbnail = null;
          yield put({
            type:'save',
            payload:{
              newPoint
            }
          })
        }
        else message.error('删除失败')
      }catch (e) {
        console.log(e,'errorr');
      }
    },
  },
  reducers:{
    save(state,{payload}){
      return{
        ...state,
        ...payload
      }
    },
    editPointInfo(state,{payload}){
      return{
        ...state,
        pointInfo:{...state.pointInfo,...payload}
      }
    },
  },
}
