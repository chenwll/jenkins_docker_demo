import {message} from 'antd';
import * as expertRecommendService from '../../../services/expertRecommend';
import * as departmentSetting from '@/services/departmentSetting'
import * as guideService from '@/services/eguide';
import * as fileService from '@/services/files';
import * as expertRecommendServices from '@/services/expertRecommend'

export default {
  namespace:'expertRecommend',
  state:{
    GuideSelectedRows:[], // 指南页的选中项
    ProjectSelectedRows:[], // 项目也中选中项
    ProjectPagination:{},
    GuidePagination:{currentPage:1,pageSize:10},
    ConcludePagination:{currentPage:1,pageSize:10},
    ExpertGuideList:{},
    ConcludeGuideList:{},
    expertProjectList:{},
    departList:[],
    guideList:[],
    distributionDataDetail:{
      state:'',
      reason:''
    },
    hanReason:false,
    detail:{},
  },

  effects:{
    *guideFetch({payload},{call,put}){
      const response=yield call(expertRecommendService.guideFetchScore,payload.data);
      const { data : { rows, pageNumber, pageSize, total } } = response;
      const {type}=payload;
      if(response.code === 0){
        const list = rows;
        const pagination={
          currentPage : pageNumber,
          pageSize,
          total ,
        };
        const result = {
          list,
          pagination,
        };
        if(type==='topic'){
          yield put({
            type:'save',
            payload:{
              ExpertGuideList:result,
              GuidePagination:pagination
            }
          })
        }else{
          yield put({
            type:'save',
            payload:{
              ConcludeGuideList:result,
              ConcludePagination:pagination
            }
          })
        }
      }
      else{
        message.error('获取数据失败!');
      }

    },
    *guideFetchRecommend({payload},{call,put}){
      const response=yield call(expertRecommendService.processProject,payload);
      const { data : { rows, pageNumber, pageSize, total} } = response;
      const list = rows;
      const pagination={
        currentPage : pageNumber,
        pageSize,
        total,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type:'save',
        payload:{
          ExpertGuideList:result,
          GuidePagination:pagination
        }
      })
    },
    *projectFetch({payload},{call,put}){
      const response=yield call(expertRecommendService.fetch,payload);
      const { data : { rows, pageNumber, pageSize, total } } = response;
      const list = rows;
      const pagination = {
        currentPage : pageNumber,
        pageSize,
        total,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type:'save',
        payload:{
          expertProjectList:result,
          ProjectPagination:pagination
        }
      })
    },
    *getDetail({payload},{call,put}){
      const response=yield call(expertRecommendService.getDetail,payload);
      if(response.code===0){
        if(response.data!==undefined){
          yield put({
            type:'save',
            payload:{
              distributionDataDetail:response.data,
              hanReason:true
            }
          })
        }
        else {
          yield put({
            type:'save',
            payload:{
              distributionDataDetail:{
                state:'',
                reason:''
              },
              hanReason:false
            }
          })
        }
      }
      else {
        message.error('信息获取失败')
      }
    },
    *setDistribution({payload},{call,put}){
      const response=yield call(expertRecommendService.setDistribution,payload);
      if(response.code===0){
        message.success('信息保存成功')
      }
      else {
        message.error('信息保存失败')
      }
    },
    *delDistribution({payload},{call,put}){
      const response=yield call(expertRecommendService.delDistribution,payload);
      if(response===0){
        message.success('信息删除成功')
        yield put({
          type:'fetch',
          payload
        })
      }
      else {
        message.error('信息删除失败')
      }
    },
    *submitDistribution({payload},{call,put}){
      const response=yield call(expertRecommendService.submitDistribution,payload.submitData);
      if(response.code===0){
        message.success('信息提交成功')
        yield put({
          type:'projectFetch',
          payload:{
            ...payload.projectFetch,
            currentPage:1,
            pageSize:10
          }
        })
      }
      else {
        message.error('信息提交失败')
      }
    },
    * getAllDepart(_, {call, put}) {
      const response = yield call(departmentSetting.getAllData);
      let departList = [];
      if(response.data) {
        departList = response.data
      }
      yield put({
        type: 'update',
        payload: {
          departList,
        }
      })
    },
    * getAllGuide(_, {call, put}) {
      const response = yield call(guideService.queryRegAll);
      let guideList = [];
      if(response.data) {
        guideList = response.data
      }
      yield put({
        type: 'update',
        payload: {
          guideList,
        }
      })
    },
    * getProjectDetail( {payload}, {call, put}) {
      const response = yield call(expertRecommendServices.projectGet, payload);
      yield put({
        type: 'save',
        payload :{
          detail: response.data || {},
        }
      })
    },
    *editGrade({payload},{put,call}){
      const response = yield call(expertRecommendServices.editGrade, payload.data);
      const {page} =payload;
      if(response.code === 0){
        message.success('更改成功！');
        if(payload.type==='conclude'){
          yield put({
            type:'guideFetch',
            payload:{
              data:{...page,
                guideStage: 2,
                reviewYear:new Date().getFullYear()},
              type:payload.type
            }
          })
        }else {
          yield put({
            type:'guideFetch',
            payload:{
              data:{...page,
                guideStage: 2,},
              type:payload.type
            }
          })
        }

      }
      else{
        message.success('更改失败！');
      }
    },
    *submitScore({payload,callback}, {call,put,select}) {
      const stateTmp = yield select(_ => _.prjScoreModel);
      const { api } = stateTmp;
      const {type,...other} = payload.data;
      const {page}=payload;
      const response = yield call(api[type].score.setSubmit, other);
      if(response.code === 0) {
        if (callback && typeof callback === 'function'){
          callback(response);
        }
        message.success('提交成功');
        if(payload.type==='conclude'){
          yield put({
            type:'guideFetch',
            payload:{
              data:{...page,
                guideStage: 2,
                reviewYear:new Date().getFullYear()},
              type:payload.type
            }
          })
        }else {
          yield put({
            type:'guideFetch',
            payload:{
              data:{...page,
                guideStage: 2,},
              type:payload.type
            }
          })
        }

      }
      else{
        message.error('提交失败');
      }
    },
    *muchSubmitScore({payload},{call,put}){
      const response = yield call(expertRecommendServices.muchSubmitScore, payload.data);
      const {page}=payload
      if(response.code === 0){
        message.success('批量提交成功！');
        if(payload.type==='conclude'){
          yield put({
            type:'guideFetch',
            payload:{
              data:{...page,
                guideStage: 2,
                reviewYear:new Date().getFullYear()},
              type:payload.type
            }
          })
        }else {
          yield put({
            type:'guideFetch',
            payload:{
              data:{...page,
                guideStage: 2,},
              type:payload.type
            }
          })
        }

      }
      else{
        message.success('批量提交失败！');
      }
    },
    *downLoadFile({payload},{call,put}){
      const { fileName: downLoadFileName} = payload;
      const response = yield call(fileService.downloadFile, payload);
      if (response.code &&response.code!==0) {
        message.error('下载文件失败');
      }
      else {
        yield put({type: 'saveFile', payload: {blob: response.resultData, fileName: downLoadFileName}})
      }
    },
    * saveFile({payload: {blob, fileName}}, {call}) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        // 此写法兼容可火狐浏览器
        document.body.appendChild(link);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
      }
    },
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
    update(state,{payload}){
      return(
        {
          ...state,
          ...payload
        }
      )
    },
  },
}
