import {message} from 'antd';
import router from 'umi/router';
import * as ExpertDistrbutionServices from '../../../services/expertDistrbution';
import { clickDownLoadFile } from '../../../utils/utils';

export default {
  namespace: 'expertDistributionModel',
  state: {
    data: [],
    list: [],
    pagination: {},
    projectRefDetail:{
      list:[],
      pagination:{},
    },
    APIType: 'reg',
    urlWay: '',

    //专家分配使用
    expList:{
      list:[],
      pagination:{}
    },
    allExpert:[],// 所有专家
    expertGroup:[],// 专家组
    expertScoreDetail:{},
    recommendType:''
  },
  effects: {

    * getRecommendDetail({payload}, {call, put, select}) {
      const stateTmp = yield select(_ => _.regProjectApprovalModal);
      const recommendType = yield select(_ => _.expertDistributionModel.recommendType);
      if(!stateTmp){
        if(recommendType==='conclude'){
          router.push({
            pathname: `/projectEducation/edu/concludeList/${payload.guideId}/${payload.type}/${payload.reviewYear}`,
            query: {prevent: true}
          });
        }else {
          router.push({
            pathname: `/projectEducation/edu/topicList/${payload.guideId}/${payload.type}/${payload.reviewYear}`,
            query: {prevent: true}
          });
        }

        return
      }
      const { APIType, APIList } = stateTmp;
      const response = yield call(APIList[APIType].ref.processProject, payload);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const pagination = {
        currentPage: pageNumber||1,
        pageSize,
        total,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type: 'save',
        payload: {
          projectRefDetail: result,
          pagination
        },
      });
    },

    *getAllExpert({payload},{call,put}){
      const response=yield call(ExpertDistrbutionServices.getAllExpert,payload);
      yield put({
        type:'save',
        payload:{
          allExpert:response.data
        }
      })
    },
    *expertDistrbution({payload},{call,put}){
      const response=yield call(ExpertDistrbutionServices.expertDistrbution,payload.expertDis);
      if(response.code===0){
        message.success("分配成功");
        yield put({
          type:'getRecommendDetail',
          payload:payload.fetch
        })
      }
      else{
        message.error('分配失败')
      }
    },
    *CloudeExpertDistrbution({payload},{call,put}){
      const response=yield call(ExpertDistrbutionServices.expertDistrbution,payload.expertDis);
      if(response.code===0){
        message.success("分配成功");
        yield put({
          type:'getRecommendDetail',
          payload:{
            ...payload.fetch,
            reviewYear:payload.expertDis.reviewYear
          }
        })
      }
      else{
        message.error('分配失败')
      }
    },
    *cancelDistrbution({payload},{call,put}){
      const response=yield call(ExpertDistrbutionServices.cancelDistrbution,payload.cancelDis);
      if(response.code===0){
        message.success("取消分配成功");
        yield put({
          type:'getRecommendDetail',
          payload:payload.fetch
        })
      }
      else{
        message.error('取消分配失败')
      }
    },
    *getExpertGroup({payload},{call,put}) {
      const response = yield call(ExpertDistrbutionServices.getExpertGroup);
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            expertGroup:response.data
          }
        })
      }
      else {
        message.warning('专家组获取失败');
      }
    },
    *getScoreDetail({payload},{call,put}){
      const {groupId} = payload;
      const response = yield call(ExpertDistrbutionServices.getScoreDetail,payload);
      const {data: {rows, pageNumber, pageSize, total}} = response;
      const list = rows;
      const pagination = {
        currentPage: pageNumber||1,
        pageSize,
        total,
      };
      const result = {
        list,
        pagination,
      };
      yield put({
        type: 'save',
        payload: {
          expertScoreDetail: {
            ...result,
            groupId,
            pagination
          },
          pagination,
        },
      });
    },
    *exportScore({payload},{call,put}){
      const response = yield call(ExpertDistrbutionServices.exportScore,payload);
      yield put({
        type : 'saveFile',
        payload : {
          blob : response.resultData,
          fileName : 'expertScore.xls',
        },
      });
    },
    * saveFile({ payload : { blob, fileName } }, { call }) {
      clickDownLoadFile(blob, fileName);
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
    },
    recommendType(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  }
};
