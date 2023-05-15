import {message} from 'antd';
import * as GetProjectAllInfoService from '../../../services/getProjectAllInfo';
import * as fileService from '@/services/files';
import * as departmentService from '@/services/departmentSetting';
import * as ExpertDistrbutionServices from "../../../services/expertDistrbution";
import {clickDownLoadFile} from "../../../utils/utils";



export  default {
  namespace: 'GetProjectAllInfo',
  state: {
    allUser: [],
    projectList: {},
    guideList: {},
    classicCaseList:{},
    classicCasePagination:{
      currentPage: 1,
      pageSize: 10,
    },
    guideListPagination: {
      currentPage: 1,
      pageSize: 10,},
    projectPagination: {currentPage: 1,
      pageSize: 10,},
    projectAllInfo: {},
    projectRecommendInfo: {},
    allGuide: [],
    allDep: [],
    processData: {},
    scoreData: {},
    stageData:{},
  },
  effects: {
    * getGuideList({payload}, {call, put}) {
      const response = yield call(GetProjectAllInfoService.getGuideList, payload);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const guideListPagination = {
        currentPage: pageNumber || 1,
        pageSize,
        total,
      };
      yield put({
        type: 'save',
        payload: {
          guideListPagination,
          guideList: {
            list,
            pagination: guideListPagination
          }
        },
      });
    },

    * getProjectList({payload}, {call, put}) {
      const response = yield call(GetProjectAllInfoService.getAllProjectList, payload);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const projectPagination = {
        currentPage: pageNumber || 1,
        pageSize,
        total,
      };
      yield put({
        type: 'save',
        payload: {
          projectPagination,
          projectList: {
            list,
            pagination: projectPagination
          }
        },
      });
    },
    * getAllProjectDetail({payload}, {call, put}) {
      const response = yield call(GetProjectAllInfoService.getAllProjectDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            projectAllInfo: response.data
          }
        })
      }
    },
    * getProjectRecommendInfo({payload}, {call, put}) {
      const response = yield call(GetProjectAllInfoService.getProjectRecommendInfo, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            projectRecommendInfo: response.data
          }
        })
      }
    },
    * getAllGuide({payload}, {call, put}) {
      const response = yield call(GetProjectAllInfoService.getAllGuide);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            allGuide: response.data
          }
        })
      }
    },
    * forceRecommend({payload}, {call, put}) {
      const response = yield call(GetProjectAllInfoService.forceRecommend, payload.setup);
      const {params}=payload
      if (response.code === 0) {
        message.warning('已强制推荐，请检查相关流程和数据');
        yield put({
          type: 'getProjectList',
          payload: {
            ...params
          }
        })
      }
    },
    * downLoadFile({payload}, {call, put}) {
      const {fileName: downLoadFileName} = payload;
      const response = yield call(fileService.downloadFile, payload);
      if (response.code && response.code != 0) {
        message.error('下载文件失败');
      } else {
        yield put({type: 'saveFile', payload: {blob: response.resultData, fileName: downLoadFileName}})
      }
    },
    // * saveFile({payload: {blob, fileName}}, {call}) {
    //   if (window.navigator.msSaveOrOpenBlob) {
    //     navigator.msSaveBlob(blob, fileName);
    //   } else {
    //     var link = document.createElement('a');
    //     link.href = window.URL.createObjectURL(blob);
    //     link.download = fileName;
    //     // 此写法兼容可火狐浏览器
    //     document.body.appendChild(link);
    //     var evt = document.createEvent("MouseEvents");
    //     evt.initEvent("click", false, false);
    //     link.dispatchEvent(evt);
    //     document.body.removeChild(link);
    //   }
    // },

    * getAlldep({payload}, {call, put}) {
      const response = yield call(departmentService.getAllData);
      yield put({
        type: 'save',
        payload: {
          allDep: response.data
        }
      })
    },

    * setEnd({payload}, {call,put}) {
      const response = yield call(GetProjectAllInfoService.setEnd, payload.data);
      if (response.code === 0) {
        message.success(response.msg);
        yield put({
          type: 'getAllGuide',
        });
        yield put({
          type: 'getProjectList',
          payload:payload.params
        });
      } else {
        message.error(response.msg);
      }
    },

    * exportRefs({payload}, {call, put}) {
      const response = yield call(GetProjectAllInfoService.excelProjectRecommendInfo, payload);
      yield put({
        type: 'saveFile',
        payload: {
          blob: response.resultData,
          fileName: 'projectRefs.xls',
        },
      });
    },

    * saveFile({payload: {blob, fileName}}, {call}) {
      clickDownLoadFile(blob, fileName);
    },

    * withDraw({payload}, {call, put}) {
      const response = yield call(GetProjectAllInfoService.withDraw, payload);
      if (response.code === 0) {
        message.success('撤回成功')
        yield put({
          type: 'getProjectRecommendInfo',
          payload: {
            projectId: payload.projectId
          }
        })
      } else {
        message.error('撤回失败')
      }
    },

    *getProcess({ payload }, { call, put }) {
      const response = yield call(GetProjectAllInfoService.getProcess, payload);
      yield put({
        type: 'save',
        payload: {
          processData:response,
        }
      });
    },

    *getScoreTree({ payload, callback }, { call, put }) {
      const response = yield call(GetProjectAllInfoService.getScoreTree, payload);
      yield put({
        type: 'save',
        payload:{
          scoreData:response,
        }
      });
      if (callback) callback();
    },

    *getStage({ payload, callback }, { call, put }) {
      const response = yield call(GetProjectAllInfoService.getStage, payload);
      yield put({
        type: 'save',
        payload: {
          stageData:response,
        }
      });
      if (callback) callback();
    },

    *getClassicCaseList({ payload }, { call, put }) {
      const response = yield call(GetProjectAllInfoService.getClassicCaseList, payload);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const classicCasePagination = {
        currentPage: pageNumber || 1,
        pageSize,
        total,
      };
      yield put({
        type: 'save',
        payload: {
          classicCasePagination,
         classicCaseList: {
            list,
            pagination:classicCasePagination
          }
        },
      });


    },

    *exportClassicCase({ payload }, { call, put }) {
      const response = yield call(GetProjectAllInfoService.exportClassicCase, payload);
      yield put({
        type : 'saveFile',
        payload : {
          blob : response.resultData,
          fileName : `经典案例.xls`,
        },
      });
    },



  },

  reducers:{
    save(state,{payload}){
      return{
        ...state,
        ...payload,
      }
    },
  },
}
