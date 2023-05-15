import * as projectStaticsService from '@/services/regProjectStatics';
import * as projectRefService from '@/services/regProjectRefs';
import * as projectStaticsEduService from '@/services/projectStatics';
import * as projectService from '@/services/projectRefs';
import * as departmentSetting from '@/services/departmentSetting'
import * as guideService from '@/services/eguide';
import * as fileService from '@/services/files';
import * as expertRecommendServices from '@/services/expertRecommend'
import {message} from 'antd';

export default {
  namespace: 'regProjectApprovalModal',
  state: {
    // 第一个界面，指南
    guideListData: {
      declaration: [],
      topic: [],
      conclude: []
    },
    // 第二个界面， 流程
    projectListData: {
      declaration: [],
      topic: [],
      conclude: []
    },
    // 第三个页面， 项目
    projectRefDetail:{
      declaration: [],
      topic: [],
      conclude: []
    },
    departList: [],
    guideList: [],
    projectContextDetail: {}, // 详情页detail
    recommendDetail: {},
    APIList: {
      edu: {
        statics: projectStaticsEduService,
        ref: projectService,
        getProjectDetail:projectStaticsEduService,
      },
      reg: {
        statics: projectStaticsService,
        ref: projectRefService,
        getProjectDetail:projectStaticsService,
      },
      exp: {
        statics: projectStaticsEduService,
        ref: expertRecommendServices,
        getProjectDetail:expertRecommendServices,
      },
      dep: {
        statics: projectStaticsEduService,
        ref: projectService,
        getProjectDetail:projectStaticsEduService,
      }
    },
    // 推荐和评分
    recommendType: 'ref',
    // edu,reg,other
    APIType: 'reg',
    urlWay: '',
    scoreRule: {},
  },
  effects: {
    * fetch({payload}, {call, put, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal);
      const { APIType, APIList, guideListData } = stateTmp;
      const { stageType, ...pay } = payload;
      const response = yield call(APIList[APIType].statics.queryList, pay);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const pagination = {
        currentPage: pageNumber,
        pageSize,
        total,
      };
      const result = {
        list,
        pagination,
      };
      guideListData[stageType] = result;
      yield put({
        type: 'save',
        payload: {
          guideListData,
        },
      });
    },
    * fetchProject({payload}, {call, put, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal)
      const { APIType, APIList, projectListData } = stateTmp;
      const { stageType, ...pay } = payload;
      const response = yield call(APIList[APIType].statics.queryProjectList, pay);
      projectListData[stageType] = response.data;
      yield put({
        type: 'save',
        payload: { projectListData },
      });
    },
    * fetchGuideProject({payload}, {call, put, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal)
      const { APIType, APIList, projectRefDetail } = stateTmp;
      const { stageType, ...pay } = payload;
      const response = yield call(APIList[APIType].statics.queryGuideProjectList, pay);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const pagination = {
        currentPage: pageNumber,
        pageSize,
        total,
      };
      const result = {
        list,
        pagination,
      };
      projectRefDetail[stageType] = result;
      yield put({
        type: 'save',
        payload: {
          projectRefDetail,
        },
      });
    },
    * getRecommendDetail({payload}, {call, put, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal)
      const { APIType, APIList, projectRefDetail, recommendType } = stateTmp;
      const { stageType, ...pay } = payload;
      const response = yield call(APIList[APIType][recommendType].selfProject, pay);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const pagination = {
        currentPage: pageNumber,
        pageSize,
        total,
      };
      const result = {
        list,
        pagination,
      };
      projectRefDetail[stageType] = result;
      yield put({
        type: 'save',
        payload: {
          projectRefDetail,
        },
      });
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
    * recommendProjectSet( {payload}, {call, put, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal)
      const { APIType, APIList, recommendType} = stateTmp;
      const { projectId, processId,reviewYear,refId} = payload;
      const response = yield call(APIList[APIType][recommendType].set, payload);
      if(response.code === 0){
        message.success('保存成功')
        yield put({
          type: 'recommendProjectGet',
          payload: {
            projectId,
            processId,
            reviewYear,
            refsId:refId,
          }
        })
      } else {
        message.error('保存失败！')
      }
    },
    * recommendProjectGet( {payload}, {call, put, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal)
      const { APIType, APIList, recommendType } = stateTmp;
      const response = yield call(APIList[APIType][recommendType].getDetail, payload);
      if(response.data) {
        yield put({
          type: 'save',
          payload :{
            recommendDetail: response.data,
          }
        })
      } else{
        yield put({
          type: 'save',
          payload :{
            recommendDetail: {},
          }
        })
      }
    },
    * recommendProjectSubmit( {payload}, {call, select, put}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal);
      const { APIType, APIList } = stateTmp;
      const { recommendType, ...pay } = payload;
      const response = yield call(APIList[APIType][recommendType].submit, pay.submit);
      if(response.code === 0){
        message.success('提交成功')
      } else {
        message.error('提交失败！')
      }
      yield put({
        type: 'getRecommendDetail',
        payload: pay.page,
      })
    },
    * getProjectContext( {payload}, {call, put, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal)
      const { APIType, APIList } = stateTmp;
      // if(APIType=='exp')
      // {
      //   const response = yield call(expertRecommendServices.getProjectDetail, payload);
      // }
      // else{
        const response = yield call(APIList[APIType].getProjectDetail.projectGet, payload);
      // }

      if(response.data) {
        yield put({
          type: 'save',
          payload :{
            projectContextDetail: response.data,
          }
        })
      } else{
        yield put({
          type: 'save',
          payload :{
            projectContextDetail: {},
          }
        })
      }
    },
    * getScore( {payload}, {call, put, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal);
      const { APIType, APIList } = stateTmp;
      const response = yield call(APIList[APIType].ref.getScore, payload);
      yield put({
        type: 'save',
        payload: {
          scoreRule: response.data
        },
      })
    },
    * setScore( {payload}, {call, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal);
      const { APIType, APIList } = stateTmp;
      yield call(APIList[APIType].ref.setScore, payload);
    },
    *downLoadFile({payload},{call,put}){
      const {fileName: downLoadFileName} = payload;
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
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        // 此写法兼容可火狐浏览器
        document.body.appendChild(link);
        const evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
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
    update(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    }
  }
};
