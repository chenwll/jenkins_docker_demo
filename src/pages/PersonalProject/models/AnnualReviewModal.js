import * as AnnualReview from '@/services/AnnualReview';
import {message} from 'antd';
import router from 'umi/router';
import  {PROJECT_IMPLEMENTATION_PLAN} from '../../../utils/Enum.js';

export default {
  namespace: 'AnnualReviewModal',
  state: {
    addProjectData: {}, //  新增申报项目数据
    pagination: {},
    detailData: {},  //  guideDetail的数据
    guideListData: [],
    projectListData: [],
    getAllAboutPrj: {},  //  申报项目修改数据
    visible: false,  //  项目联系人的弹框是否可见
    title: '项目联系人',
    projectContactFlag:'add',
    fileType:'',
    reviewYear:'',
    currentRow: { },
    selectItem: 0,
    AnnualPlan:{
      status:PROJECT_IMPLEMENTATION_PLAN.NOT_SAVE,
      seeSubmit:false,
    },  //  项目实践方案
  },
  effects: {
    //  获取年度评审
    *getAnnualList({payload},{call,put}){
      payload = payload ? payload : {currentPage: 1};
      const response = yield call(AnnualReview.getAnnualList, payload);
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
      yield put({
        type: 'save',
        payload: {projectListData: result,pagination},
      });
      yield put({
        type: 'saveTotal',
        payload: {total},
      });
    },

    *getAnnualDetail({payload},{call,put}){
      const response = yield call(AnnualReview.getAnnualDetail,payload);
      if(response.code === 0){
        yield put({
          type: 'saveDetail',
          payload: {
            data: response.data,
          },
        });
      }
    },

    *addAnnual({payload},{call,put}){

      const response = yield call(AnnualReview.addAnnual,payload);
      if(response.code === 0){
        message.success('新增成功!');
        yield put({
          type:`save`,
          payload:{
            AnnualPlan:{
              ...payload,
              status:PROJECT_IMPLEMENTATION_PLAN.SAVE,
            },
          }
        });
        yield put({
          type: 'getAnnualList',
          payload:{
            currentPage: 1,
            pageSize: 10,
            projectId:payload.projectId
          }
        });
      }
      else{
        message.error('新增失败!');
      }
    },

    *editAnnual({payload}, {call, put}) {
      const response = yield call(AnnualReview.editAnnual, payload);
      if(response.code ===0)
      {
        message.success('数据更新成功!');
        yield put({
          type: 'getAnnualList',
          payload:{
            currentPage: 1,
            pageSize: 10,
            projectId:payload.projectId
          }
        });
        router.push(`/PersonalProject/AnnualReview/${payload.projectId}`);
      }
      else{
        message.error('数据更新失败!');
      }
    },

    // 提交项目实践方案
    *submitAnnualPlanAll({payload},{call,put}){
      const response = yield call(AnnualReview.commitAnnualall,payload);
      if(response.code === 0){
        message.success('材料提交成功!');
        yield put({
          type: 'getAnnualList',
          payload:{
            currentPage: 1,
            pageSize: 10,
            projectId:payload.projectId
          }
        });
        yield put({
          type:'save',
          payload:{
            AnnualPlan:{
              ...payload,
              status:PROJECT_IMPLEMENTATION_PLAN.SUBMIT,
            },
          },
        });
        yield put({
          type: 'global/closeCurrentTab',
          payload: {
            tabName: '年度评审',
          },
        });
        router.push(`/PersonalProject/AnnualReview/${payload.projectId}`);
      }
      else{
        message.error('材料提交失败!');
      }
    },

    *submitAnnualPlan({payload},{call,put}){
      const response = yield call(AnnualReview.commitAnnual,payload.data);
      if(response.code === 0){
        message.success('材料提交成功!');
        yield put({
          type:'save',
          payload:{
            AnnualPlan:{
              ...payload,
              status:PROJECT_IMPLEMENTATION_PLAN.SUBMIT,
            },
          },
        });
        yield put({
          type: 'getAnnualList',
          payload:{
            currentPage: 1,
            pageSize: 10,
            projectId:payload.projectId
          }
        });
      }
      else{
        message.error('材料提交失败!');
      }
    },

    * deleteAnnual({payload}, {call, put}) {
      const response = yield call(AnnualReview.deleteAnnual, payload.data);
      if(response.code ===0)
      {
        message.success('数据删除成功!');
        yield put({
          type: 'getAnnualList',
          payload:{
            currentPage: 1,
            pageSize: 10,
            projectId:payload.projectId
          }
        });
      }
      else{
        message.error('数据删除失败!');
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

    saveDetail(state, {payload}) {
      return {
        ...state,
        detailData: payload.data,
      };
    },
    showModel(state, {payload}) {
      return {
        ...state,
        visible: true,
        fileType:payload.fileType,
        currentRow:payload.conclusionId,
      };
    },
    hiddenModal(state) {
      return {
        ...state,
        visible: false,
        currentRow: {}
      };
    },
    saveTotal(state, {payload}) {
      return {
        ...state,
        ...payload
      };
    },
  }
};
