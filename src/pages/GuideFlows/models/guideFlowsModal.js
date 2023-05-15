import * as personalProjectService from '@/services/personalProject';
import * as guideFlowService from '@/services/guideFlow';
import { message } from 'antd';
import * as guideService from '@/services/eguide';
import * as departmentSetting from '@/services/departmentSetting';
import * as guideFlowsScore from '@/services/guideFlowsScore';
import router from 'umi/router';

export default {
  namespace : 'guideFlowsModal',
  state : {
    data : [],
    list : [],
    pagination : {},
    detailData : {},// 流程详细数据
    guideListData : [],
    projectListData : [],
    getAllAboutPrj : {},
    flowType : 0,// 流程类型
    processType : 0,// 流程阶段类型 如立项和结题
    selectGuideData : {},// 选中的指南数据
    flowData : {},// 流程列表数据
    drawerVisible : false,
    depart : [],// 所有部门列表
    scoreRuleList : [],
  },
  effects : {
    * add({ payload }, { call, put }) {
      const response = yield call(personalProjectService.addProject, payload);
      if (response.code === 0) {
        message.success('添加成功');
        yield put({
          type : 'global/closeCurrentTab',
          payload : {
            tabName : '项目申报',
          },
        });
        router.push(`/PersonalProject/MyProject`);
        yield put({
          type : 'listAll',
        });
      } else {
        message.error('添加失败:' + response.msg);
      }
    },
    * fetch({ payload }, { call, put }) {
      payload = payload ? payload : {currentPage: 1 , pageSize:10};
      const response = yield call(guideService.queryList, {current:payload.currentPage ,size:payload.pageSize});
      const { data : { rows, pageNumber, pageSize, total } } = response;
      const list = rows;
      const pagination = {
        currentPage : pageNumber,
        pageSize ,
        total ,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type : 'save',
        payload : { guideListData : result },
      });
    },

    // 获取流程配置列表数据
    * fetchFlowList({ payload }, { call, put }) {
      payload = payload ? payload : { currentpage : 1 };
      const response = yield call(guideFlowService.queryList, payload);
      const { data : { rows, pageNumber, pageSize, total } } = response;
      const list = rows;
      const pagination = {
        currentPage : pageNumber,
        pageSize ,
        total ,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type : 'save',
        payload : { flowData : result },
      });
    },


    * listAll({ payload }, { call, put }) {
      payload = payload ? payload : { currentpage : 1 };
      const response = yield call(personalProjectService.listAll, payload);
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
        type : 'save',
        payload : {
          projectListData : result,
        },
      });
    },
    * getGuide({ payload }, { call, put }) {
      const response = yield call(guideService.getDetail, payload);
      yield put({
        type : 'save',
        payload : {
          detailData : response.data,
        },
      });
      yield put({
        type : 'update',
        getAllAboutPrj : {},
      });
    },
    * getAllAboutPrj({ payload }, { call, put }) {
      const response = yield call(personalProjectService.listAll, payload);
      const { data : { rows } } = response;
      yield put({
        type : 'save',
        payload : {
          getAllAboutPrj : rows[0],
        },
      });
      yield put({
        type : 'getGuideWhileEdit',
        payload : {
          guideId : response.data.rows[0].guideId,
        },
      });
    },
    * deleteProject({ payload }, { call, put }) {
      const response = yield call(personalProjectService.delPrj, payload);
      if (response.code === 0) {
        message.success('数据删除成功!');
        yield put({
          type : 'listAll',
        });
      }
    },
    * edit({ payload }, { call, put }) {
      const response = yield call(personalProjectService.editPrj, payload);
      if(response.code===0){
        message.success('数据更新成功!');
        yield put({
          type : 'listAll',
        });
        router.push(`/PersonalProject/MyProject`);
      }
    },
    * getGuideWhileEdit({ payload }, { call, put }) {
      const response = yield call(guideService.getDetail, payload);
      yield put({
        type : 'save',
        payload : {
          detailData : response.data,
        },
      });
    },
    * getAllData(_, { call, put }) {
      const response = yield call(departmentSetting.getAllData);
      let depart = [];
      if (response.data) {
        depart = response.data;
      }
      yield put({
        type : 'update',
        payload : {
          depart,
        },
      });
    },
    * guideAddAll({ payload }, { call, put }) {
      const { list } = payload;
      const response = yield call(guideFlowService.guideAddAll, list);
      if (response.code === 0) {
        message.success('操作成功');
        yield put({
          type : 'updateList',
          payload : list,
        });
      }
      else{
        message.error('操作失败');
      }
    },
    * guideScoreRuleAll(_, { call, put }) {
      const response = yield call(guideFlowsScore.guideScoreRuleAll);
      if (response.code === 0) {
        yield put({
          type : 'update',
          payload : {
            scoreRuleList : response.data,
          },
        });
      }
    },
  },

  reducers : {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateList(state, { payload }) {
      const { flowData } = state;
      const list = payload;
      const flowDataCopy = {
        ...flowData,
        list,
      };
      return {
        ...state,
        flowData : flowDataCopy,
      };
    },
  },
};
